"use strict";

import { fetchDNSResults } from "./extractors/dns";
import { isDockerEnabled } from "./extractors/docker";
import { hasInternetAccess } from "./extractors/internetAccess";
import {
  getNamespaces,
  getServicesRunningOnNamespaces
} from "./extractors/kubernetes";
import { NmapResult, ProcessedNmapData } from "./interfaces";
import { getIPAddresses, scanIpRange } from "./utils";

export async function processNmapData(
  data: NmapResult[]
): Promise<ProcessedNmapData> {
  const retval = {
    namespaces: getNamespaces(data).sort(),
    services: getServicesRunningOnNamespaces(data),
    dns: await fetchDNSResults(data),
    options: {
      docker: await isDockerEnabled(),
      hasInternetAccess: await hasInternetAccess()
    }
  };

  return retval;
}

export const getInspectorOutput = async () => {
  let retval: any[] = [];
  for (const ipRange of getIPAddresses()) {
    console.log(`SCANNING IP RANGE ${ipRange}`);
    const nMapResult = await scanIpRange(ipRange);
    const scanResult = await processNmapData(nMapResult);
    console.log(scanResult);
    retval = [...retval, { ipRange, ...scanResult }];
  }
  return retval;
};
