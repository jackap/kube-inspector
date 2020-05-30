import {getNamespace, getService, getServicesRunningOnNamespaces} from "../extractors";
import { expect } from "chai";
import {NmapResult} from "../interfaces";


describe("Nmap result", () => {
    const hostname = '10-1-0-2.kube-dns.kube-system.svc.cluster.local';
    const nmapResults: Array<NmapResult> = [
        { hostname: '10-1-0-2.foo.kube-system.svc.cluster.local',
            ip: '10.1.0.2',
            mac: '92:74:21:4F:07:91',
            openPorts: null,
            osNmap: null,
            vendor: undefined },
        { hostname: '10-1-0-3.bar.kube-system.svc.cluster.local',
            ip: '10.1.0.3',
            mac: '6E:4F:91:39:E7:48',
            openPorts: null,
            osNmap: null,
            vendor: undefined },
    ]
    it("Parses namespace",() =>{
        expect(getNamespace(hostname)).equal('kube-system')
    });
    it("Parses service",() =>{
        expect(getService(hostname)).equal('kube-dns')
    });
    it("Groups services by namespace",() =>{
        expect(getServicesRunningOnNamespaces(nmapResults)).eql
        ({
            'kube-system':['foo','bar']
        }
        )
    });
});