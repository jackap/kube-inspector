'use strict';
import {getIPAddresses, pprint} from "./utils";
import {NmapResult} from "./interfaces";
import {getServicesRunningOnNamespaces, printDNSResults} from "./extractors";
// @ts-ignore
import * as nmap from 'node-nmap'
// @ts-ignore
const eventToPromise = require('event-to-promise');
// @ts-ignore
const Docker = require('dockerode');


function processData(data: NmapResult[]) :void {
  pprint(
      getServicesRunningOnNamespaces(data)
  );
  printDNSResults(
      data
  );
  pprint(data);

const docker = new Docker(); // defaults to above if env variables are not used
docker.listImages(function (err: any, containers : [any]) {
	if (!err && containers.length > 0){
	console.log("Container has access to Docker");
	}
	else {
	console.log("Container has no access to Docker");
	}
  });
}

getIPAddresses().forEach(async (ipRange) => {
  console.log(`+++++++++++++ SCANNING IP RANGE ${ipRange} +++++++++++++`)
  const scan = eventToPromise( new nmap.QuickScan(ipRange),'complete');
  const result = await scan.then((data:any) => data);
  processData(result)
});
