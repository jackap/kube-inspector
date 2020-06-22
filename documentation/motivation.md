# Motivation

Modern applications run on containers. They can be scaled and tore down in matter of seconds and
deployments can be run in different prodviders. This evolved into a new paradigm of
multi-cloud platforms, where developers can easily move artifacts from a provider to another. 

In this respect, a big step forward is due to ``kubernetes``which provides an orchestration for
layer for containerized applications. Benefits of this approach are numerous but, the
main goal is to provide the heavy-lifting of creating, managing, securing and monitoring
the infrastructure. 

Usually when it comes to networking and security there are already-made solutions
so that developers can focus only on delivering code. However, proper testing is required
to ensure that the selected policies are enforced and that common security practices
are in place. 

Testing the networking settings is particularly important in kubernetes where the routing
of requests is software-based and typically is very easy to connect from a pod to another.
An example might be the possibility for a malicious user to leverage network misconfiguration
to get visibility of the system and escalate privileges. 

Another problem is related with multi-tenant clusters where, for instance, part of the
system is maintained by a third party which, in case of misconfiguration, might get access to private and sensitive data.
