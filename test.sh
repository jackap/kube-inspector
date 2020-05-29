kubectl exec -it $(kubectl get pod -l app=inspector -o jsonpath='{.items[0].metadata.name}') bash
cd /tmp
nmap -T4 -v 172.17.0.0/24 | tee nmap.txt
kubectl cp inspector-deployment-695f784cc4-dbgqg:/tmp/nmap.txt ./oych.txt