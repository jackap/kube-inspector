'use strict';
import {getIPAddresses, pprint, scanIpRange} from "./utils";
import {NmapResult, ProcessedNmapData} from "./interfaces";
import {getNamespace, getServicesRunningOnNamespaces, fetchDNSResults} from "./extractors";


// @ts-ignore
const Docker = require('dockerode');

const getNamespaces  = (data: NmapResult[]): (string | undefined)[] => Array.from(new Set(data.map((entry: NmapResult) => getNamespace(entry.hostname))));
export async function processNmapData(data: NmapResult[]): Promise<ProcessedNmapData> {
    const retval = {
        namespaces: getNamespaces(data).sort(),
        services: getServicesRunningOnNamespaces(data),
        dns: await fetchDNSResults(data)
    }

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
        const nMapResult = await scanIpRange(ipRange);
        const scanResult = await processNmapData(nMapResult);
        console.log(scanResult);
        retval = [...retval,{ipRange: ipRange,...scanResult}]
    }
    return retval
}

