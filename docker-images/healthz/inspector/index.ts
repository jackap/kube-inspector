import {pprint} from "./utils";
import {NmapResult} from "./interfaces";
import {getServicesRunningOnNamespaces, printDNSResults} from "./extractors";
// @ts-ignore
const nmap = require('node-nmap')

const DEFAULT_PORT = 9080
const ipRange = "10.1.0/24"
// @ts-ignore
nmap.nmapLocation = 'nmap'; //default



function processData(data: Array<NmapResult>) :void {
  // pprint(data);
  pprint(
      getServicesRunningOnNamespaces(data)
  );
  printDNSResults(
      data
  );
}

let quickscan = new nmap.QuickScan(ipRange);
quickscan.on('complete', function(data: Array<NmapResult>){
  processData(data)
});

quickscan.on('error', function(error: Error){
  console.log(error);
});

 quickscan.startScan();
