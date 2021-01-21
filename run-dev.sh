#!/bin/bash
bash run-extract-map-data.sh
docker build -t directions-service ./directions-service/
docker build -t routing-solver-service ./routing-solver-service/
npx concurrently \
"yarn --cwd ./front-end start" \
"docker run -p 6379:6379 redis:rc-alpine3.12" \
"yarn --cwd ./api-gateway start" \
"yarn --cwd ./orders-service start" \
"yarn --cwd ./shipment-service start" \
"docker run -p 8989:8989 -v $PWD/directions-service/data/:/data directions-service /data/toronto.xml" \
"docker run -p 8080:8080 routing-solver-service"