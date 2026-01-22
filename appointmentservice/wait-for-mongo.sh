#!/bin/sh

set -e

echo "Waiting for MongoDB to be ready..."

until nc -z -v -w30 $MONGO_HOST $MONGO_PORT 
do
  echo "Waiting for MongoDB connection..."
  sleep 2
done

echo "MongoDB is up - starting the service."


echo "Waiting for Consul to be ready at $CONSUL_HOST:$CONSUL_PORT..."

until nc -zv $CONSUL_HOST $CONSUL_PORT 
do
  echo "Consul not ready yet..."
  sleep 2
done

echo "Consul is ready. Starting doctor service..."

until nc -z $KAFKA_HOST $KAFKA_PORT ; do
  echo "Waiting for Kafka connection..."
  sleep 2
done
echo "Kafka is up - continuing..."

exec "$@"
