"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// @ts-ignore
var nmap = require('node-nmap');
var DEFAULT_PORT = 9080;
var ipRange = "10.1.0/24";
// @ts-ignore
nmap.nmapLocation = 'nmap'; //default
var pprint = function (element) { return console.log(JSON.stringify(element, null, '\t')); };
var getNamespace = function (hostname) { return hostname ? hostname.split('.')[2] : "None"; };
var getService = function (hostname) { return hostname ? hostname.split('.')[1] : "None"; };
var getNamespaces = function (data) {
    var namespaces = data.map(function (entry) { return getNamespace(entry.hostname); });
    var distinctNameSpaces = Array.from(new Set(namespaces));
    return distinctNameSpaces;
};
function getServicesRunningOnNamespaces(data) {
    var servicesOnNamespace = data.reduce(function (acc, current) {
        var _a;
        var service = getService(current.hostname);
        var namespace = getNamespace(current.hostname);
        if (!namespace || namespace == null)
            return acc;
        return __assign(__assign({}, acc), (_a = {}, _a[namespace] = acc[namespace] ? acc[namespace].concat(service) : [service], _a));
    }, {});
    return servicesOnNamespace;
}
function processData(data) {
    var podsInDefaultNamespace = data.filter(function (entry) { return entry.hostname != null && entry.hostname.includes("default"); });
    //pprint(getNamespaces(data))
    pprint(getServicesRunningOnNamespaces(data));
}
/*let quickscan = new nmap.QuickScan(ipRange);
quickscan.on('complete', function(data: Array<NmapResult>){
  const hostnames = data.map( (entry:NmapResult) => entry.hostname)
  console.log("Hostnames")
  console.log(hostnames.toString())
  console.log(data)
});

quickscan.on('error', function(error: Error){
  console.log(error);
});

 quickscan.startScan();
*/
var results = [
    { hostname: null,
        ip: '10.1.0.1',
        mac: '76:86:6D:5D:69:C8',
        openPorts: null,
        osNmap: null,
        vendor: undefined },
    { hostname: '10-1-0-2.kube-dns.kube-system.svc.cluster.local',
        ip: '10.1.0.2',
        mac: '92:74:21:4F:07:91',
        openPorts: null,
        osNmap: null,
        vendor: undefined },
    { hostname: '10-1-0-3.kube-dns.kube-system.svc.cluster.local',
        ip: '10.1.0.3',
        mac: '6E:4F:91:39:E7:48',
        openPorts: null,
        osNmap: null,
        vendor: undefined },
    { hostname: '10-1-0-4.istiod.istio-system.svc.cluster.local',
        ip: '10.1.0.4',
        mac: '22:05:5C:2D:0D:D7',
        openPorts: null,
        osNmap: null,
        vendor: undefined },
    { hostname: '10-1-0-5.istio-ingressgateway.istio-system.svc.cluster.local',
        ip: '10.1.0.5',
        mac: '52:E0:92:61:02:3F',
        openPorts: null,
        osNmap: null,
        vendor: undefined },
    { hostname: '10-1-0-6.istio-egressgateway.istio-system.svc.cluster.local',
        ip: '10.1.0.6',
        mac: '72:FD:78:8A:ED:BF',
        openPorts: null,
        osNmap: null,
        vendor: undefined },
    { hostname: '10-1-0-7.zipkin.istio-system.svc.cluster.local',
        ip: '10.1.0.7',
        mac: '16:19:65:59:2D:5C',
        openPorts: null,
        osNmap: null,
        vendor: undefined },
    { hostname: '10-1-0-8.grafana.istio-system.svc.cluster.local',
        ip: '10.1.0.8',
        mac: '2E:7E:2C:C6:24:90',
        openPorts: null,
        osNmap: null,
        vendor: undefined },
    { hostname: '10-1-0-9.kiali.istio-system.svc.cluster.local',
        ip: '10.1.0.9',
        mac: 'E2:F3:FF:A7:EF:9F',
        openPorts: null,
        osNmap: null,
        vendor: undefined },
    { hostname: '10-1-0-10.prometheus.istio-system.svc.cluster.local',
        ip: '10.1.0.10',
        mac: 'DE:E9:F7:B0:D6:7A',
        openPorts: null,
        osNmap: null,
        vendor: undefined },
    { hostname: '10-1-0-11.details.default.svc.cluster.local',
        ip: '10.1.0.11',
        mac: '56:73:CF:D6:91:38',
        openPorts: null,
        osNmap: null,
        vendor: undefined },
    { hostname: '10-1-0-12.ratings.default.svc.cluster.local',
        ip: '10.1.0.12',
        mac: 'D2:5C:8A:5A:12:53',
        openPorts: null,
        osNmap: null,
        vendor: undefined },
    { hostname: '10-1-0-13.reviews.default.svc.cluster.local',
        ip: '10.1.0.13',
        mac: 'FA:14:DF:CB:40:8D',
        openPorts: null,
        osNmap: null,
        vendor: undefined },
    { hostname: '10-1-0-14.reviews.default.svc.cluster.local',
        ip: '10.1.0.14',
        mac: 'B2:7F:B6:58:31:6C',
        openPorts: null,
        osNmap: null,
        vendor: undefined },
    { hostname: '10-1-0-15.reviews.default.svc.cluster.local',
        ip: '10.1.0.15',
        mac: 'BA:28:62:E3:B3:64',
        openPorts: null,
        osNmap: null,
        vendor: undefined },
    { hostname: '10-1-0-16.productpage.default.svc.cluster.local',
        ip: '10.1.0.16',
        mac: '3A:A7:BC:98:10:0C',
        openPorts: null,
        osNmap: null,
        vendor: undefined },
    { hostname: 'inspector-deployment-695f784cc4-nnlgm',
        ip: '10.1.0.17',
        mac: null,
        openPorts: null,
        osNmap: null,
        vendor: undefined }
];
processData(results);
