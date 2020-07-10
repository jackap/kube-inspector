import {NmapResult} from "./interfaces";
// @ts-ignore
const dns = require('dns');

export const hasDefaultHostname = (hostname: string|null) => hostname ? hostname.split('.').length >3 : false
export const getDnsNames = (hostname: string | null) => {
    // TODO: Use promisified version
    dns.lookup(hostname,(_err: any, address: any, _family: any) =>{
        console.log(`\n------------${hostname}----------------\n`);
        console.log(`${hostname} : ${address}`)
    })
    dns.lookup(`${getService(hostname)}.${getNamespace(hostname)}`,(_err: any, address: any, _family: any) =>{
        console.log(`${getService(hostname)} : ${address}`);
        console.log("--------------------------------------")
    })
}
export const printDNSResults = (data: NmapResult[]) => {
    data.filter( element => hasDefaultHostname(element.hostname))
        .forEach(entry => getDnsNames(entry.hostname))
}
export const getNamespace = (hostname: string|null) => hostname ? hostname.split('.')[2] : undefined;
export const getService = (hostname: string|null) => hostname ? hostname.split('.')[1] : undefined;
export const getServicesRunningOnNamespaces = (data: Array<NmapResult>) => data.reduce((acc:any,current) => {
        const service = getService(current.hostname)
        const namespace:string |undefined = getNamespace(current.hostname);
        if (!namespace || namespace == null) return acc;
        return {
            ...acc,
            [namespace]: acc[namespace] ? acc[namespace].concat(service) : [service]
        }
    },{})
