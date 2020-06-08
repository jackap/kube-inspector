'use strict';
import {getIPAddresses, pprint} from "./utils";
import {NmapResult} from "./interfaces";
import {getServicesRunningOnNamespaces, printDNSResults} from "./extractors";
// @ts-ignore
const nmap = require('node-nmap')


const DEFAULT_PORT = 9080
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
  pprint(data);
}

getIPAddresses().forEach((ipRange) => {
  console.log(`+++++++++++++ SCANNING IP RANGE ${ipRange} +++++++++++++`)
let quickscan = new nmap.QuickScan(ipRange);
quickscan.on('complete', function(data: Array<NmapResult>){
  processData(data)
});

quickscan.on('error', function(error: Error){
  console.log(error);
});

 quickscan.startScan();
})