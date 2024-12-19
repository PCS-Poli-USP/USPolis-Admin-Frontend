#!/bin/bash
npm run build
scp -P 2222 -r ./build/ ubuntu@200.144.244.245:/diskb/home/frontend
