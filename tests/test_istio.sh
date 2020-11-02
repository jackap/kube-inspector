#!/bin/zsh
set -x
minikube start --driver=hyperkit --memory=10000 --cpus=4

eval $(minikube -p minikube docker-env) && docker build -t inspector:1.0.0 ..
istioctl manifest install --set profile=demo
nvm use
npm test -- istio_test.ts
