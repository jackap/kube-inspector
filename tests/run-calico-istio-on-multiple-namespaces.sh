source ./run-kubernetes-cluster.sh

restartMinikube
installCalico
buildAndApplyInspector
installIstio
installBookinfoOnOtherNamespace
sleep 60
kubectl exec -it $(kubectl get pod -l app=inspector -o jsonpath='{.items[0].metadata.name}') npm run start | tee ../results/result-calico-istio-multiple-namespaces.txt
kubectl apply -f default-deny.yaml
sleep 10
kubectl exec -it $(kubectl get pod -l app=inspector -o jsonpath='{.items[0].metadata.name}') npm run start | tee ../results/result-calico-istio-multiple-namespaces-with-default-deny.txt
