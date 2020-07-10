// @ts-ignore
import {NmapResult} from "./interfaces";

const os = require('os');
// @ts-ignore
const eventToPromise = require('event-to-promise');
// @ts-ignore
import * as nmap from 'node-nmap'
export const scanIpRange = (ipRange: String): Promise<NmapResult[]> => eventToPromise( new nmap.QuickScan(ipRange),'complete');

export const pprint = (element: any) => console.log(JSON.stringify(element, null, '\t'));

export const getIPAddresses = (): String[] =>  {
    const ifaces = os.networkInterfaces();
    const filteredInterfaces = Object.keys(ifaces).filter( ifname => {
        const loopbackOrIPv6 = ifaces[ifname].filter( (iface: any) => iface.internal || iface.family === "IPv6");
        return loopbackOrIPv6.length  === 0
    })
    const filteredIPs = filteredInterfaces.map(addresses => ifaces[addresses][0].address + "/24");
    return filteredIPs
}
