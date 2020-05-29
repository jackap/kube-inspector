SHELL := /bin/bash

reset-minikube:
	minikube delete && minikube start --vm-driver=virtualbox
build-inspector:
	$(eval $(minikube -p minikube docker-env)) ; docker build -t inspector:1.0.0 ./docker-images/healthz
install-inspector: build-inspector
	kubectl apply -f deployments/inspector.yaml
remove-inspector:
	kubectl delete -f deployments/inspector.yaml
install-istio:
	pushd "istio-1.6.0" ;\
	export PATH=$(PWD)/bin:$(PATH) ;\
	istioctl manifest apply --set profile=demo ;\
	kubectl label namespace default istio-injection=enabled ;\
	kubectl apply -f samples/bookinfo/platform/kube/bookinfo.yaml ;\
	popd
uninstall-istio:
	pushd "istio-1.6.0" ;\
	kubectl delete -f samples/bookinfo/platform/kube/bookinfo.yaml ;\
	istioctl manifest generate --set profile=demo | kubectl delete -f - ;\
	kubectl delete namespace istio-system ;\
	popd
get-into-inspector:
	@kubectl exec -it $(kubectl get pod -l app=inspector -o jsonpath='{.items[0].metadata.name}') bash
get-istio-dashboard:
	@istioctl dashboard kiali
add-bookinfo-gateway:
	pushd "istio-1.6.0" && kubectl apply -f samples/bookinfo/networking/bookinfo-gateway.yaml && popd