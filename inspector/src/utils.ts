// @ts-ignore
const os = require('os');

export const pprint = (element: any) => console.log(JSON.stringify(element, null, '\t'));

export const getIPAddresses = (): Array<String> =>  {
    const ifaces = os.networkInterfaces();
    const filteredInterfaces = Object.keys(ifaces).filter( ifname => {
        const loopbackOrIPv6 = ifaces[ifname].filter( (iface: any) => iface.internal || iface.family === "IPv6")
        return loopbackOrIPv6.length  === 0
    })
    const filteredIPs = filteredInterfaces.map(addresses => ifaces[addresses][0].address + "/24")
    return filteredIPs
}