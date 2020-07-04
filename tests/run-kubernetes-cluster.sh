#!/usr/bin/env bash

set -e
set -x

function restartMinikube() {
    minikube delete
     minikube start --vm-driver=hyperkit  --network-plugin=cni --extra-config=kubelet.network-plugin=cni
    eval $(minikube -p minikube docker-env)
}

function buildAndApplyInspector(){
    eval $(minikube -p minikube docker-env)
    docker build -t inspector:1.0.0 ../docker-images/healthz
    kubectl apply -f ../deployments/inspector.yaml
}

function installIstio(){
      #export PATH=$(PWD)/bin:$(PATH)
      ./istio-1.6.0/bin/istioctl manifest apply --set profile=demo
      kubectl label namespace default istio-injection=enabled --overwrite
      kubectl apply -f ./istio-1.6.0/samples/bookinfo/platform/kube/bookinfo.yaml
      kubectl apply -f ./istio-1.6.0/samples/bookinfo/networking/bookinfo-gateway.yaml

}

function installBookinfoOnOtherNamespace(){
      kubectl create namespace test-namespace
      kubectl label namespace test-namespace istio-injection=enabled --overwrite
      kubectl apply -f ./istio-1.6.0/samples/bookinfo/platform/kube/bookinfo.yaml -n test-namespace
      kubectl apply -f ./istio-1.6.0/samples/bookinfo/networking/bookinfo-gateway.yaml -n test-namespace

}

function installCalico(){
# Create rbac for etcd
kubectl apply -f https://docs.projectcalico.org/v3.2/getting-started/kubernetes/installation/rbac.yaml
# Grab the hosted (etcd) calico manifest
curl https://docs.projectcalico.org/v3.2/getting-started/kubernetes/installation/hosted/calico.yaml -O
kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml

}
#restartMinikube # This SHOULD NOT be run unless changes in minikube are detected
#installCalico
#buildAndApplyInspector
#installIstio
#installBookinfoOnOtherNamespace
#kubectl apply -f default-deny.yaml
#Which security do they provide?
#Make the tool public.
#Add ownership of the tool to probe the
#cloud network.
# semantic web