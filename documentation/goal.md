# Goal

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

