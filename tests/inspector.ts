import path from "path";

export const INSPECT_ENDPOINT = '/inspect';

export async function inspect(inspectorUrl){
    const res =  await fetch(inspectorUrl+INSPECT_ENDPOINT);
    const inspectorResponse = await res.json();
    return inspectorResponse;
}
export async function buildInspector(docker) {
    let dockerStream: NodeJS.ReadableStream = await docker.buildImage({
        context: path.resolve(__dirname, '..'),
    }, {t: 'inspector:1.0.0'});

    return new Promise((resolve, reject) => {
        docker.modem.followProgress(dockerStream, (err, res) => err ? reject(err) : resolve(res), (evt) => console.info(evt.stream));
    });
}
export async function applyInspector(kubectl) {

    return await kubectl.deployment.create('../deployments/inspector.yaml').then(
    kubectl.service.create('../services/inspector.yaml'));
}
