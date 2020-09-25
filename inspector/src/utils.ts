// @ts-ignore
// @ts-ignore
import * as eventToPromise from "event-to-promise";
// @ts-ignore
import * as nmap from "node-nmap";
import * as os from "os";
import { NmapResult } from "./interfaces";
export const scanIpRange = (ipRange: string): Promise<NmapResult[]> =>
  eventToPromise(new nmap.QuickScan(ipRange), "complete");

export const pprint = (element: any) =>
  console.log(JSON.stringify(element, null, "\t"));

export const getIPAddresses = (): string[] => {
  const ifaces = os.networkInterfaces();
  const filteredInterfaces = Object.keys(ifaces).filter(ifname => {
    // @ts-ignore
    const loopbackOrIPv6 = ifaces[ifname].filter(
      (iface: any) => iface.internal || iface.family === "IPv6"
    );
    return loopbackOrIPv6.length === 0;
  });

  const filteredIPs: string[] = filteredInterfaces.map(addresses => {
    // @ts-ignore
    return ifaces[addresses][0].address + "/24";
  });
  return filteredIPs;
};
