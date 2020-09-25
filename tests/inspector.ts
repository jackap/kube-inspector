import path from "path";
const fetch = require('node-fetch');
const retry = require('async-retry');

export const INSPECT_ENDPOINT = '/inspect';

export async function inspect(inspectorUrl){
    return await retry(async bail => {
        // if anything throws, we retry
        const res = await fetch(inspectorUrl+INSPECT_ENDPOINT, {timeout: 600*1000});
        const data = await res.json();
        console.debug(data)
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
        console.info('Building inspector container...')
        docker.modem.followProgress(dockerStream, (err, res) => err ? reject(err) : resolve(res));
    });
}
export async function applyInspector(kubectl) {
    await kubectl.command('apply -f ../deployments/inspector.yaml')
    await kubectl.command('apply -f ../services/inspector.yaml');
    return
}

export async function deleteInspector(kubectl) {

    return await kubectl.command('delete -f ../services/inspector.yaml').then(kubectl.command('delete -f ../deployments/inspector.yaml'));
}
