# Goal

Nowadays the concept of cattle infrastructure has become very popular. There are several tools
that can help developers with infrastructure as code and applications can be easily moved from a provider
to another. Also, with kubernetes things have become very easy. 

One of the limitations with the kubernetes approach is represented by the fact that with k8s you have
a state of the application which represent a list of resources (note that also network configurations are resources)
but you do not know how they relate to each other. In this respect, it is important to have a way to test and verify
that the system is behaving as it should.


---

The aim of the paper is to provide a framework that can be used to assess the
correctness of a kubernetes cluster network configuration. 
Other than that the framework will guide the developers towards a more responsible
implementation of the cluster specifications. 
The main goal of the tool is to find all the possible misconfigurations
that can lead to a network security vulnerability.

---
The tool operates as follows:
1. Scans the subnet of the current pod plus other that can be passed as command line arguments
2. Looks for DNS records in the kubernetes canonical form:
``<service/ip>.<namespace>.cluster.local``
3. Searches for misconfigurations of the container engine

