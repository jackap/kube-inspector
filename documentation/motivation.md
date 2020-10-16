# Motivation

Modern applications are containerized and run on the cloud. They can be scaled and tore down in matter of seconds and
services can run in multiple clouds. This evolved into a new paradigm of
multi-cloud platforms, where developers can easily move artifacts from a provider to another. 

In this respect, a big step forward is due to ``kubernetes``which provides an orchestration
layer for containerized applications. Benefits of this approach are numerous but, the
main goal is to provide the heavy-lifting of creating, managing, securing and monitoring
the infrastructure. Moreover, kubernetes can be used as a trait d'union between cloud providers
providing an effective way to implement cross-cloud communication. A number of benefits arise fromm this
approach. First, using different clouds improves reliability and resilience of an application in case of
spurious network errors. Second, having a central tool to govern an infrastructure makes it easy for developers
to deploy their stack without knowledge of each specific cloud syntax. Third, the whole kubernetes configuration
relies on a series of yaml files which make it suitable for infrastructure as code which makes infrastructure 
maintainability easier especially in multi-cloud scenarios.
Finally, kubernetes comes with several security and networking capabilities. 

One of the mayor drawbacks of this approach is that is requires a deep understanding of kubernetes and its underlying
mechanisms expecially when it somes to network and security. With such a complex mechanism, configuration errors are
easy to appear and they can lead to security vulnerabilities. Here we describe some attack scenarios: 
 - A malicious user leverages network misconfiguration to escalate privileges. 
 - A malicious user leverages network misconfiguration to get visibility on the system and access protected resources. 
 - A multi-tenant clusters does not enforce policies. External parties can access private and sensitive data.

It appears clear how critical is ensuring that proper policies are applied and that services only have access only to
what they need. Here we describe ``kubesec``, our way to approach this problem. Kubesec comes as a pod that attaches
to existing deployments and performs a ``shapshot`` of the system at the time of the deployment. It fetches system 
information among which network topology and security measures. Main reason of having a snapshot is to have a concrete
state of the network security policies together with some other information useful to devise the status. 
Next time kubesec is run, it will generate a new snapshot that can be compared against the previous one. 