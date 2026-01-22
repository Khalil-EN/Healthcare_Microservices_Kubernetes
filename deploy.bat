@echo off
setlocal enabledelayedexpansion

REM =========================
REM Configuration
REM =========================
set PROMETHEUS_PORT=9090
set GRAFANA_PORT=3001
set JAEGER_PORT=16686

set MONITORING_NS=monitoring
set LOGGING_NS=logging
set TRACING_NS=tracing


set PROM_RELEASE=monitoring
set LOKI_RELEASE=loki
set JAEGER_RELEASE=jaeger

echo =====================================
echo Adding Helm repositories
echo =====================================
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

REM ==================================================
REM Monitoring stack (Prometheus + Grafana)
REM ==================================================
echo =====================================
echo Installing kube-prometheus-stack
echo =====================================
helm upgrade --install %PROM_RELEASE% prometheus-community/kube-prometheus-stack ^
  -n %MONITORING_NS% ^
  --create-namespace ^
  --set prometheus-node-exporter.enabled=false ^
  -f k8s-global\infra\alertManager\alertManager-values.yaml ^
  --timeout 10m




REM ==================================================
REM Logging stack (Loki + Promtail)
REM ==================================================
echo =====================================
echo Installing Loki + Promtail
echo =====================================
helm upgrade --install %LOKI_RELEASE% grafana/loki-stack ^
  -n %LOGGING_NS% ^
  --create-namespace ^
  --set promtail.enabled=true ^
  --set grafana.enabled=false ^
  --timeout 5m


echo ======================================
echo Installing Ingress
echo ======================================
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

echo Waiting for different stacks to stabilize...
timeout /t 65 > nul


REM ==================================================
REM Infrastructure services
REM ==================================================
echo =====================================
echo Deploying infrastructure services
echo =====================================

echo ---- Prometheus ----
kubectl apply -f k8s-global\infra\prometheus\

timeout /t 10 > nul

echo ---- Consul ----
kubectl apply -f k8s-global\infra\consul\

echo ---- Zookeeper ----
kubectl apply -f k8s-global\infra\zookeeper\

echo ---- Kafka ----
kubectl apply -f k8s-global\infra\kafka\

echo ---- Mongo ----
kubectl apply -f k8s-global\infra\mongo\

echo ---- Loki ----
kubectl apply -f k8s-global\infra\loki\

echo ---- Alert Manager ----
kubectl apply -f k8s-global\infra\alertManager\

echo ---- Ingress ----
kubectl apply -f k8s-global\infra\ingress\


echo ---- OpenTelemetry + Jaeger ----
kubectl create namespace %TRACING_NS%
kubectl apply -f k8s-global\infra\otel-jaeger\

echo Waiting for infra services...
timeout /t 10 > nul


REM ==================================================
REM Application services
REM ==================================================
echo =====================================
echo Deploying doctorservice
echo =====================================
kubectl apply -f k8s-global\doctorservice\

echo =====================================
echo Deploying patientservice
echo =====================================
kubectl apply -f k8s-global\patientservice\

echo =====================================
echo Deploying appointmentservice
echo =====================================
kubectl apply -f k8s-global\appointmentservice\

echo =====================================
echo Deploying apigateway
echo =====================================
kubectl apply -f k8s-global\apigateway\

echo =====================================
echo Deploying frontend
echo =====================================
kubectl apply -f k8s-global\frontend\

echo Waiting for application pods...
timeout /t 30 > nul


REM ==================================================
REM Port-forwards
REM ==================================================
echo =====================================
echo Starting port-forwards
echo =====================================

REM Prometheus
start "Prometheus Port Forward" cmd /k ^
kubectl port-forward -n %MONITORING_NS% svc/%PROM_RELEASE%-kube-prometheus-prometheus %PROMETHEUS_PORT%:9090

REM Grafana
start "Grafana Port Forward" cmd /k ^
kubectl port-forward -n %MONITORING_NS% svc/%PROM_RELEASE%-grafana %GRAFANA_PORT%:80

REM Jaeger
start "Jaeger Port Forward" cmd /k ^
kubectl port-forward -n %TRACING_NS% svc/%JAEGER_RELEASE% %JAEGER_PORT%:16686

echo =====================================
echo Done!
echo Prometheus: http://localhost:%PROMETHEUS_PORT%
echo Grafana:    http://localhost:%GRAFANA_PORT%
echo Jaeger:    http://localhost:%JAEGER_PORT%
echo Loki:       http://loki.%LOGGING_NS%.svc.cluster.local:3100
echo =====================================
