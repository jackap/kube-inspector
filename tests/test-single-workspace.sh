#!/usr/bin/env bash

set -e
set -x

function restartMinikube() {
    minikube delete
    minikube start --vm-driver=virtualbox --bootstrapper=kubeadm --network-plugin=cni --enable-default-cni
    eval $(minikube -p minikube docker-env)
}

function installIstio(){
      ./istio-1.6.0/bin/istioctl manifest apply --set profile=demo
      /usr/local/bin/kubectl label namespace default istio-injection=enabled
      /usr/local/bin/kubectl apply -f istio-1.6.0/samples/bookinfo/platform/kube/bookinfo.yaml
      /usr/local/bin/kubectl apply -f istio-1.6.0/samples/bookinfo/networking/bookinfo-gateway.yaml
}

#restartMinikube
installIstio