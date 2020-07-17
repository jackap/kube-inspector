import path from "path";
const fetch = require('node-fetch');

export const INSPECT_ENDPOINT = '/inspect';

export async function inspect(inspectorUrl){
    const res =  await fetch(inspectorUrl+INSPECT_ENDPOINT);
   return await res.json();
}
export async function buildInspector(docker) {
    const dockerStream: NodeJS.ReadableStream = await docker.buildImage({
        context: path.resolve(__dirname, '..'),
    }, {t: 'inspector:1.0.0'});

    return new Promise((resolve, reject) => {
        docker.modem.followProgress(dockerStream, (err, res) => err ? reject(err) : resolve(res), (evt) => console.info(evt.stream ?? evt));
    });
}
export async function applyInspector(kubectl) {

    return await kubectl.deployment.create('../deployments/inspector.yaml').then(
    kubectl.service.create('../services/inspector.yaml'));
}
