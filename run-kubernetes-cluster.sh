#!/usr/bin/env bash

set -e
set -x

function restartMinikube() {
    minikube delete
    minikube start --vm-driver=virtualbox --bootstrapper=kubeadm --network-plugin=cni --enable-default-cni
    eval $(minikube -p minikube docker-env)
}

function buildAndApplyInspector(){
    eval $(minikube -p minikube docker-env)
    docker build -t inspector:1.0.0 ./docker-images/healthz
    kubectl apply -f deployments/inspector.yaml
}

function installIstio(){
    pushd "istio-1.6.0"
      export PATH=$(PWD)/bin:$(PATH)
      istioctl manifest apply --set profile=demo
      kubectl label namespace default istio-injection=enabled
      kubectl apply -f samples/bookinfo/platform/kube/bookinfo.yaml
      kubectl apply -f samples/bookinfo/networking/bookinfo-gateway.yaml
    popd
}

function installCalico(){
  kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml

}
restartMinikube # This SHOULD NOT be run unless changes in minikube are detected
#installCalico
#buildAndApplyInspector
# installIstio


#Which security do they provide?
#Make the tool public.
#Add ownership of the tool to probe the
#cloud network.
# semantic web