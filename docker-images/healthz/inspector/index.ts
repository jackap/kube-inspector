import {pprint} from "./utils";
import {NmapResult} from "./interfaces";
import {getServicesRunningOnNamespaces} from "./extractors";
// @ts-ignore
const nmap = require('node-nmap')

const DEFAULT_PORT = 9080
const ipRange = "10.1.0/24"
// @ts-ignore
nmap.nmapLocation = 'nmap'; //default



function processData(data: Array<NmapResult>) :void {
  const podsInDefaultNamespace = data.filter(
      (entry:NmapResult) => entry.hostname != null && entry.hostname.includes("default"))
  //pprint(getNamespaces(data))
  pprint(
      getServicesRunningOnNamespaces(data)
  )
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

/*

                "annotation.io.kubernetes.container.ports": "[{\"containerPort\":8080,\"protocol\":\"TCP\"},{\"containerPort\":15010,\"protocol\":\"TCP\"},{\"containerPort\":15017,\"protocol\":\"TCP\"},{\"containerPort\":15053,\"protocol\":\"TCP\"}]",
* 10.1.0.4:8080/debug/authorizationz
* */