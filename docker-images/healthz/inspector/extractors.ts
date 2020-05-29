
export const getNamespace = (hostname: string|null) => hostname ? hostname.split('.')[2] : "None"
export const getService = (hostname: string|null) => hostname ? hostname.split('.')[1] : "None"
export const getServicesRunningOnNamespaces = (data: Array<NmapResult>) => data.reduce((acc:any,current) => {
        const service = getService(current.hostname)
        const namespace:string = getNamespace(current.hostname)
        if (!namespace || namespace == null) return acc
        return {
            ...acc,
            [namespace]: acc[namespace] ? acc[namespace].concat(service) : [service]
        }
    },{})
