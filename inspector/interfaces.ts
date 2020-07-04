export interface NmapResult {
    hostname: string|null,
    ip: string,
    mac: string|null,
    openPorts: string|null,
    osNmap: string|null,
    vendor: null|undefined
}