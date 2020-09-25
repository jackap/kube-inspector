import * as dns from "dns";
import { promisify } from "util";
import { NmapResult, ProcessedServiceData } from "./interfaces";

const nsLookup = promisify(dns.lookup);
export const hasDefaultHostname = (hostname: string | null) =>
  hostname ? hostname.split(".").length > 3 : false;
export const getDnsNames = async (hostname: string | null) => {
  if (hostname === null) {
    return {};
  }
  const address = await nsLookup(hostname);
  const kubernetesAddress = await nsLookup(
    `${getService(hostname)}.${getNamespace(hostname)}`
  );
  return { hostname, addresses: [address, kubernetesAddress] };
};
export const fetchDNSResults = async (data: NmapResult[]) => {
  return data
    .filter(element => hasDefaultHostname(element.hostname))
    .map(async entry => await getDnsNames(entry.hostname));
};
export const getNamespace = (hostname: string | null) =>
  hostname ? hostname.split(".")[2] : undefined;
export const getService = (hostname: string | null) =>
  hostname ? hostname.split(".")[1] : undefined;
export const getServicesRunningOnNamespaces = (
  data: NmapResult[]
): ProcessedServiceData =>
  data.reduce((acc: any, current) => {
    const service = getService(current.hostname);
    const namespace: string | undefined = getNamespace(current.hostname);
    if (!namespace || namespace == null) return acc;
    return {
      ...acc,
      [namespace]: acc[namespace]
        ? acc[namespace].concat(service).sort()
        : [service]
    };
  }, {});
