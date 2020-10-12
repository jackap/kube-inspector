import { NmapResult, ProcessedServiceData } from "../interfaces";

export const getNamespaces = (data: NmapResult[]): (string | undefined)[] =>
  Array.from(
    new Set(data.map((entry: NmapResult) => getNamespace(entry.hostname)))
  );
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
