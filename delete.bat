@echo off

echo Deleting infrastructure services
kubectl delete -f k8s-global\infra\consul\
kubectl delete -f k8s-global\infra\kafka\
kubectl delete -f k8s-global\infra\zookeeper\
kubectl delete -f k8s-global\infra\mongo\
kubectl delete -f k8s-global\infra\otel-jaeger\
kubectl delete -f k8s-global\infra\alertManager\
kubectl delete -f k8s-global\infra\ingress\

echo Deleting doctorservice...
kubectl delete -f k8s-global\doctorservice\

echo Deleting frontend..
kubectl delete -f k8s-global\frontend\

echo Deleting patientservice...
kubectl delete -f k8s-global\patientservice\

echo Deleting appointmentservice...
kubectl delete -f k8s-global\appointmentservice\

echo Deleting apigateway...
kubectl delete -f k8s-global\apigateway\

echo Deleting promtail and loki ...
helm uninstall logging -n logging

echo Deleting prometheus and grafana ...
helm uninstall monitoring -n monitoring

