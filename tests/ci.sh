#!/bin/bash
set -e
minikube start --driver=docker --memory=6500 --cpus=2 --network-plugin=cni 1> /dev/null
eval $(minikube -p minikube docker-env) && docker build -t inspector:1.0.0 .. 1> /dev/null
./istio-1.7.2/bin/istioctl manifest install --set profile=demo 1> /dev/null
