import path from "path";
const fetch = require('node-fetch');
const retry = require('async-retry');

export const INSPECT_ENDPOINT = '/inspect';

export async function inspect(inspectorUrl){
    return await retry(async bail => {
        // if anything throws, we retry
        const res = await fetch(inspectorUrl+INSPECT_ENDPOINT, {timeout: 600*1000});
        const data = await res.json();
        return data;
    }, {
        retries: 10
    });
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

export async function deleteInspector(kubectl) {

    return await kubectl.command('delete -f ../services/inspector.yaml').then(kubectl.command('delete -f ../deployments/inspector.yaml'));
}
