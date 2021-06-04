# Kube-inspector
![Passes tests](https://github.com/jackap/kubesec/workflows/Test%20kubesec/badge.svg)    

kube-inspector is a tool that enables container probing within a kubernetes cluster. 

## Capabilities
- Find cluster network topology when using istio and/or calico.
- Discover root misconfiguration of containers or docker engine.
- Test if the current cluster status represents the expected one. 
- Provide a measurable way of testing the infrastructure

## How to run

`kubectl apply -f deployments/inspector.yaml`
`kubectl apply -f services/inspector.yaml`

When the service becomes healthy it will expose an http service on port `8081`.
To probe the containers, you can run `GET IP_ADDRESS:8081/inspect`
