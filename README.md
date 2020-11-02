# Inspector
![Passes tests](https://github.com/jackap/kubesec/workflows/Test%20kubesec/badge.svg)    
## Capabilities
- Find cluster network topology when using istio and/or calico.
- Discover root misconfiguration of containers or docker engine.
- Test if the current cluster status represents the expected one. 
- Provide a measurable way of testing the infrastructure

## Build containers
To speed up the testing process, a base version of the inspector container is
deployed to dockerhub. The only version to deploy is `jackops93/inspector_base:1.0.0`
which will be then used by the inspector service. 
### Login
` docker login -u jackops93
`
### Build the dockerfile
`docker build -f Dockerfile_base -t jackops93/inspector_base:1.0.0 .`
### Push the dockerfile
`docker push jackops93/inspector_base:1.0.0`