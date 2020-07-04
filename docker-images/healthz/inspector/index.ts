'use strict';
import {getIPAddresses, pprint} from "./utils";
import {NmapResult} from "./interfaces";
import {getServicesRunningOnNamespaces, printDNSResults} from "./extractors";
// @ts-ignore
const nmap = require('node-nmap');
// @ts-ignore
var Docker = require('dockerode');
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

var docker= new Docker(); //defaults to above if env variables are not used
docker.listImages(function (err: any, containers : [any]) {
	if (!err && containers.length > 0){
	console.log("Container has access to Docker");
	}
	else {
	console.log("Container has no access to Docker");
	}
  });

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