#!/bin/bash
set -x
minikube start --driver=hyperkit --memory=10000 --cpus=4 --network-plugin=cni

eval $(minikube -p minikube docker-env) && docker build -t inspector:1.0.0 ..

#kubectl apply -f ../deployments/inspector.yaml
#kubectl apply -f ../services/inspector.yaml
./istio-1.7.2/bin/istioctl manifest install --set profile=demo

#kubectl label namespace default istio-injection=enabled --overwrite

#kubectl apply -f ./istio-1.7.2/samples/bookinfo/platform/kube/bookinfo.yaml -n default
#kubectl apply -f ./istio-1.7.2/samples/bookinfo/networking/bookinfo-gateway.yaml -n default

#kubectl apply -f https://docs.projectcalico.org/v3.2/getting-started/kubernetes/installation/rbac.yaml
#kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml

#kubectl create namespace test-namespace
#kubectl label namespace test-namespace istio-injection=enabled --overwrite
#kubectl apply -f ./istio-1.7.2/samples/bookinfo/platform/kube/bookinfo.yaml -n test-namespace
#kubectl apply -f ./istio-1.7.2/samples/bookinfo/networking/bookinfo-gateway.yaml -n test-namespace

# kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml  

#curl -O -L https://docs.projectcalico.org/v3.1/getting-started/kubernetes/installation/hosted/kubeadm/1.7/calico.yaml
#sed -i -e '/nodeSelector/d' calico.yaml
#sed -i -e '/node-role.kubernetes.io\/master: ""/d' calico.yaml
#kubectl apply -f calico.yaml

#kubectl apply -f default-deny-single-namespace.yaml

#curl -O -L https://docs.projectcalico.org/v3.1/getting-started/kubernetes/installation/hosted/kubeadm/1.7/calico.yaml
#sed -i -e '/nodeSelector/d' calico.yaml
#sed -i -e '/node-role.kubernetes.io\/master: ""/d' calico.yaml
#kubectl apply -f calico.yaml
#npm run test
