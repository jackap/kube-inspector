#!/bin/bash

minikube start --driver=docker --memory=6500 --cpus=2 --network-plugin=cni
eval $(minikube -p minikube docker-env) && docker build -t inspector:1.0.0 ..
./istio-1.7.2/bin/istioctl manifest install --set profile=demo
