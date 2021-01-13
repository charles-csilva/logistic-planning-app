#!/bin/bash
[ ! -d ./routing-service/data/ ] && mkdir ./routing-service/data/ && tar -xf ./routing-service/toronto.tar.xz -C ./routing-service/data/
docker-compose up