source ./run-kubernetes-cluster.sh

restartMinikube
buildAndApplyInspector
installIstio
installCalico
sleep 60
kubectl exec -it $(kubectl get pod -l app=inspector -o jsonpath='{.items[0].metadata.name}') npm run start | tee result-istio-calico-single-namespace.txt
kubectl apply -f default-deny-single-namespace.yaml
sleep 10
kubectl exec -it $(kubectl get pod -l app=inspector -o jsonpath='{.items[0].metadata.name}') npm run start | tee result-istio-calico-single-namespace-with-default-deny.txt
