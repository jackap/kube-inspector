source ./run-kubernetes-cluster.sh

restartMinikube
buildAndApplyInspector
installIstio
installBookinfoOnOtherNamespace
sleep 60
kubectl exec -it $(kubectl get pod -l app=inspector -o jsonpath='{.items[0].metadata.name}') npm run start | tee result-istio-multiple-namespaces.txt