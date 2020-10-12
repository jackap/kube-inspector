import dns from "dns";
import { promisify } from "util";
import { NmapResult } from "../interfaces";
import { getNamespace, getService } from "./kubernetes";
const nsLookup = promisify(dns.lookup);

export const hasDefaultHostname = (hostname: string | null) =>
  hostname ? hostname.split(".").length > 3 : false;
export const getDnsNames = async (hostname: string | null) => {
  if (hostname === null) {
    return null;
  }
  const address = await nsLookup(hostname);
  const kubernetesAddress = await nsLookup(
    `${getService(hostname)}.${getNamespace(hostname)}`
  );
  if (!address || !kubernetesAddress) {
    return null;
  }
  const output = {
    hostname,
    addresses: [address.address, kubernetesAddress.address]
  };
  console.log(output);
  return output;
};
export const fetchDNSResults = async (data: NmapResult[]) => {
  const filteredData = data.filter(element =>
    hasDefaultHostname(element.hostname)
  );
  console.log(filteredData);
  return Promise.all(filteredData.map(entry => getDnsNames(entry.hostname)));
};
