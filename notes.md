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

## Useful commands
```
kubectl run --namespace=policy-demo access --rm -ti --image inspector:1.0.0 /bin/bash
https://kubernetes.io/docs/reference/kubectl/cheatsheet/
https://github.com/projectcalico/calico/issues/1456
https://docs.projectcalico.org/security/tutorials/kubernetes-policy-basic
kubectl -n policy-demo delete networkpolicy access-nginx
```


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
Discovered that with default settings one can access different namespaces. 
Output of nmap does not return service names but dns canoncal names.
I made a test for the two different dns names. Here is the output:
````bash
root@inspector-deployment-695f784cc4-fzz9v:/# nslookup productpage
Server:		10.96.0.10
Address:	10.96.0.10#53

Name:	productpage.default.svc.cluster.local
Address: 10.106.203.227

root@inspector-deployment-695f784cc4-fzz9v:/# nslookup 10-1-0-15.productpage.default.svc.cluster.local
Server:		10.96.0.10
Address:	10.96.0.10#53

Name:	10-1-0-15.productpage.default.svc.cluster.local
Address: 10.1.0.15
```` 
The DNS is the same and corresponds to: 

`kube-system    service/kube-dns                    ClusterIP      10.96.0.10       <none>        53/UDP,53/TCP,9153/TCP      38m   k8s-app=kube-dns`

Let's query it.-> Nothing interesting

## Day 5 
Test calico. Install calico. I cannot see also pods in other namspaces. As expected.
TRY WITH RPCINFO https://computersecuritystudent.com/SECURITY_TOOLS/METASPLOITABLE/EXPLOIT/lesson4/index.html

Try container running as complete root -> full vm access 
what can they do?


Try container with docker access



## Day N 26/06
Recap:
- by default there is no network security in place in minikube
- when istio (sidecars in general) is enabled, then there is still another chance to contact other clients
- if docker context is sent to container, then a pod can access all the containers
- If you build a container as root, then you cannot run 
it as a non-root container
- without calico it is even possible to connect to: `10.1.0.4:8080/debug/authorizationz`

## Jul 03 
Refactor the codebase and move around stuff.
Fix deployments of the docker image and make running the tests easier :green_circle:
######TODO: Update documentation to include the download of calico
 
## Jul 06
After the meeting with Tuomas, there are some things to improve in the service: 
* Use web based api :green_circle:
* Add logging to a logfile with the following capabilities:
    - json structured log-file.
    - json structured output from web-service :green_circle:
* Aim should be ``reporting connectivity`` or problems 
on access within pods.
* Testing the system with **helm**

### Open questions
- What more can we do?
- Is there anything that could be done? 
- Should we cover more service meshes or more networking solutions? 
Is this beyond kubernetes?

### Outcomes
30 page reports with as many results as possible. 
Should test it also to other systems. 
Test with helm. 
syslog entries as well
 
