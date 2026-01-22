FROM node:16-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN apk update && apk add --no-cache netcat-openbsd
RUN npm install
RUN npm install -g nodemon
COPY . .
COPY wait-for-mongo.sh /wait-for-mongo.sh
RUN chmod +x /wait-for-mongo.sh

EXPOSE 4002
CMD ["./wait-for-mongo.sh", "npm", "start"]