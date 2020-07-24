'use strict';
import {getIPAddresses, pprint, scanIpRange} from "./utils";
import {NmapResult} from "./interfaces";
import {getNamespace, getServicesRunningOnNamespaces, printDNSResults} from "./extractors";


// @ts-ignore
const Docker = require('dockerode');

const getNamespaces  = (data: NmapResult[]): (string | undefined)[] => Array.from(new Set(data.map((entry: NmapResult) => getNamespace(entry.hostname))));
export function processData(data: NmapResult[]) :any{
    const retval = {
      namespaces: getNamespaces(data).sort(),
      services: getServicesRunningOnNamespaces(data),
    }
 /* pprint(
      getServicesRunningOnNamespaces(data)
  );
  printDNSResults(
      data
  );
  pprint(data);*/

  return retval;
/*const docker = new Docker(); // defaults to above if env variables are not used
docker.listImages(function (err: any, containers : [any]) {
	if (!err && containers.length > 0){
	console.log("Container has access to Docker");
	}
	else {
	console.log("Container has no access to Docker");
	}
  });*/
}

export const getInspectorOutput = async () => {
    let retval: any[] = [];
    for (const ipRange of getIPAddresses()) {
        console.log(`SCANNING IP RANGE ${ipRange}`);
        const result = await scanIpRange(ipRange).then((data: any) => processData(data));
        console.log(result);
        retval = [...retval,{ipRange: ipRange,...result}]
    }
    return retval
}

