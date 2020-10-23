## Motivation

Modern applications run on containers and are deployed on the cloud. They can be scaled up and tore down in matter of
seconds improving the reliability and overall cost of the infrastructure. One of the major concerns of cloud-based
applications is due to the tight bound between the infrastructure, and the provider used. In very rare occasion might
happen that a failure on the provider availability can cause network failures and interruptions. In addition, using
cloud services require deep knowledge of the provider implementations and requirements (e.g., minimum NodeJS version to
use when deploying a serverless function). These reasons motived the community to create solutions that would perform
this heavy lifting for the developers so that they could operate without deep knowledge of the cloud provider.

Currently, the major container orchestration tool is the ``kubernetes`` project which enables creating, managing,
securing and monitoring an infrastructure. Moreover, kubernetes can be used as a way to create resources inside between
different providers so to build an efficient tool to implement cross-cloud communication. A number of benefits arise fromm this
approach. First, using different clouds improves reliability and resilience of an application in case of
spurious network errors. Second, having a central tool to govern an infrastructure makes it easy for developers
to deploy their stack without knowledge of each specific cloud syntax. Third, the whole kubernetes configuration
relies on a series of yaml files which make it suitable for infrastructure as code which makes infrastructure 
maintainability easier especially in multi-cloud scenarios.

All the benefits hereby described, however, do not come at no cost. Kubernetes
(like any other container orchestration tool e.g., Docker Swarm) is a very complex software and several plugins can be installed
making the resulting infrastructure difficult to test. In addition to that, security is a very big concern. Security
policies like firewall rules or packet forwarding, can be also defined in kubernetes. 
With such a complex mechanism, configuration errors are easy to appear and they can lead to security vulnerabilities.
Here we describe some attack scenarios: 

    - A malicious user leverages network misconfiguration to escalate privileges. 
    - A malicious user leverages network misconfiguration to get visibility on the system and access protected resources. 
    - A multi-tenant clusters does not enforce policies. External parties can access private and sensitive data.

It appears clear how critical is ensuring that proper policies are applied and that services only have access to
what they need.

Here we describe ``kubesec``, our way to approach this problem. Kubesec comes as a pod that attaches
to existing deployments and performs a ``shapshot`` of the system at the time of the deployment.
It fetches system information among which network topology and security measures. Main reason of
having a snapshot is to have a concrete state of the network security policies together with some other information useful to devise the status. 
Next time kubesec is run, it will generate a new snapshot that can be compared against the previous one. 
