import {NmapResult} from "../interfaces";
import {promisify} from "util";
import dns from "dns";
import {getNamespace, getService} from "./kubernetes";
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
    if (!address || !kubernetesAddress){
        return null;
    }
    return { hostname, addresses: [address, kubernetesAddress] };
};
export const fetchDNSResults = async (data: NmapResult[]) => {
    return data
        .filter(element => hasDefaultHostname(element.hostname))
        .map(async entry => await getDnsNames(entry.hostname))
        .filter(async result => result !== null  || result !== {})
};
