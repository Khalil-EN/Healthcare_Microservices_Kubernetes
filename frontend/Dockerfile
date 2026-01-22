FROM node:alpine as builder
COPY . /frontend
WORKDIR /frontend
RUN npm install
RUN npm run build

FROM nginx:1.15-alpine
COPY --from=builder /frontend/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
