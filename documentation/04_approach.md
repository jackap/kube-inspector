## Approach

Our approach differs from the ones presented in the related works by a number of factors. 
First we move from a solution that ebstracts the security policies to a one that actually tests them. 

### Reference scenario

For the sake of simplicity, we introduce a reference scenario to contextualize the approach. 
A Network Service Provider (NSP) provides network and security services for its customers.
Customers use orchestraction tools (e.g., kubernetes) to interact with the NSP APIs and to provide
an abstraction layer. Through the orchestraction APIs customers define their infrastructure and enable
security services both coming from the NSP and enabled by the orchestration framework. Final goal
of the customer is to implement the required policies on the infrastructure. 

### Architecture

Our approach is composed by a service which runs inside the infrastructure, records its 
topology and produces a readable output. Users can then look at the report and compare it with the desired infrastructure. 
On top of that, the report can be used as a ``system state`` that can be used as a reference
for each and every subsequent modification of the infrastructure. 

 

