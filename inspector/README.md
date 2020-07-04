# Inspector service
This is used to check the kubernetes configuration and system reachability
At the moment it uses nmap apis to get the pods in the cluster 

##TODOs
````
"annotation.io.kubernetes.container.ports": `
"[{\"containerPort\":8080,\"protocol\":\"TCP\"},
{\"containerPort\":15010,\"protocol\":\"TCP\"},
{\"containerPort\":15017,\"protocol\":\"TCP\"},
{\"containerPort\":15053,\"protocol\":\"TCP\"}]",
```
* 10.1.0.4:8080/debug/authorizationz
