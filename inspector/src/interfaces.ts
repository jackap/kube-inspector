export interface NmapResult {
  hostname: string | null;
  ip: string;
  mac: string | null;
  openPorts: string | null;
  osNmap: string | null;
  vendor: null | undefined;
}

export interface ProcessedServiceData {
  [key: string]: string | undefined;
}

export interface ProcessedNmapData {
  namespaces: Array<string | undefined>;
  services: ProcessedServiceData;
}
