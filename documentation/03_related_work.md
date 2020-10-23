## Related work

Even though this problem has  not been studied in the container
orchestration world, several approaches have been proposed in the literature
for a similar problem that regards SDN an NFV. 

One group regards using tooling on top of existing orchestration frameworks to make
development of security practices easier. Such frameworks interact with the underlying
orchestration API and will provide a simpler interface to them. They are based on tools that
provide a simpler interface or language to communicate network and security policies of 
the underlying infrastructure.
Other tools go beyond this and provide automated security policies based on heuristics devised
by the network topology.  

While these approaches guarantee some kind of protection against misconfiguration and aim at
providing simpler tools to the developers, they pose at least two major concerns. 
First, having a simpler way to define security policies does not imply users to implement them
correctly. Second, developers need to heavily trust these tools to implement policies. This means
that developers should learn a new language on top of the existing stack.
Another group of tools provides the same capabilities as the previous
one but adds the possibility of automatically generate resources at runtime (as load-balancers,
firewalls). On top of the aforementioned issues, having runtime systems
that are spawn on demand make the infrastructure less predictable. This means that the infrastructure
state might have unstable states.  
