source ./run-kubernetes-cluster.sh

restartMinikube
installCalico
buildAndApplyInspector
installIstio
sleep 60
kubectl exec -it $(kubectl get pod -l app=inspector -o jsonpath='{.items[0].metadata.name}') npm run start | tee ../results/result-calico-istio-single-namespace.txt
