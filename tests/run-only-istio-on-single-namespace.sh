source ./run-kubernetes-cluster.sh

restartMinikube
installIstio
buildAndApplyInspector
sleep 60
kubectl exec -it $(kubectl get pod -l app=inspector -o jsonpath='{.items[0].metadata.name}') npm run start | tee ../results/result-istio-single-namespace.txt
