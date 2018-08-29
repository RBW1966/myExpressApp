#!/usr/bin/env bash
docker build -t rweed-nodejs-webapp-01 .
docker run --env-file .env -p 80:80 -it rweed-nodejs-webapp-01
