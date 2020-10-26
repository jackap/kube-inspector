## Approach

Our approach differs from the ones presented in the related works by a number of factors. 
First we believe that current way of specifying the policies offers enough flexibility
and readability to the end user  to define their policies. Also, adding additional 
specifications and languages does prevent mis-usage of the tools. 
What we want to achieve is to move from a solution that abstracts the security and network policies
to a one testing them. Most of the times problems encountered by developers and DevOps
concern the complexity to narrow down the policies in a fine-grained fashion. As en example,
sometimes setting up the policy to prohibit traffic on a specific port is more complex
than disabling access at all. 

This is much more  evident in kubernetes where, by default, everything is allowed
from anywhere which is the opposite of the industry standard since the past 30 years.

With this in mind, our approach relies on taking a picture of the current state of the 
application at the time of the deployment.

### Reference scenario

For the sake of simplicity, we introduce a reference scenario to contextualize the approach. 
A Network Service Provider (NSP) provides the network and security services for its customers.
Customers use orchestration tools (e.g., kubernetes) to interact with the NSP APIs and to provide
an abstraction layer. Through the orchestration APIs customers define their infrastructure and enable
security services both coming from the NSP and enabled by the orchestration framework. Final goal
of the customer is to implement the required policies on the infrastructure. 
Usually SPs have their own implementation of kubernetes interacting with the services
offered by the cloud provider. This means that a volume is not a file system in a virtual machine,
but a "cloud  volume" (e.g., google cloud storage, Amazon S3). In the current context
we will always refer to bare-metal implementations, but the same assumptions can be
done for cloud-based implementations.


### Architecture

Our approach is composed by a service which runs inside the infrastructure, records its 
topology and produces a readable output. Users can then look at the report and compare it with the desired infrastructure. 
On top of that, the report can be used as a ``system state`` that can be used as a reference
for each and every subsequent modification of the infrastructure. 

 