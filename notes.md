# How to run custom example
First you have to run this with virtualbox. 

Then follow https://stackoverflow.com/questions/42564058/how-to-use-local-docker-images-with-minikube
to let kubernetes see the docker imgage locally. 
````shell script
health-check-2.healthz.default.svc.cluster.local
172-17-0-3.kube-dns.kube-system.svc.cluster.local
nslookup --dns-ip=172.17.0.3 health-check-2.healthz.default.svc.cluster.local
````

### Testing the booking app exampole
When I apply only the istio pods there is nothing happening. Links are shown
only when traffic is routed. 
I am now inspecting the code of the main entrypoint.
it has these among the other endpoints which are passed through env variables.
- `/login`
- `/logout`
- `/productpage`

> There is a check in the code which actually works so that if no env variable is set then it uses a standard name
that is exactly the same specified in the yaml configuration.

# Apps to install in inspect-container
```sh
apt-get install net-tools
apt-get install iputils-ping
apt-get install traceroute
apt-get install dnsutils
apt-get install curl
```

# Ideas
Istio check!> 
Check kernel
What can I see? 
Fire traversal to connect with other containers

### How does it work for aws? 


---
# Diary

## Day 2 
Install networking interface https://kubernetes.io/docs/tasks/administer-cluster/network-policy-provider/cilium-network-policy/ 


Try traffic balancing :) 
https://kubernetes.io/docs/tasks/administer-cluster/declare-network-policy/
https://kubernetes.io/docs/concepts/cluster-administration/networking/


### Test performed
1. Follow the tutorial for istio download and test (https://istio.io/docs/setup/getting-started)
2. Install the custom healthz container
3. Verify that health check can see inside deployments

## Day 3
Question: at which iso/osi layer does ISTIO work? How about Consul?
Guess: layer 2/3 are demanded to the kubernetes networking layer while 
upper layers can be modified by sidecars and proxies. 

## Day 4 (May 29th)
After the discussion with Joao, we can say that there are some complex things going deep in the
networking model of kubernetes. He brought up the `CALICO` project which
should help with network security. 
I also saw a youtube video (https://www.youtube.com/watch?v=0zCHtrEJ9Bc) 
in which there seems to be some differences between pods living in
different namespaces. I need to read more about that (https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/). 