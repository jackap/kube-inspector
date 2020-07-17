import path from "path";

export async function buildInspector(docker) {
    let dockerStream: NodeJS.ReadableStream = await docker.buildImage({
        context: path.resolve(__dirname, '..'),
    }, {t: 'inspector:1.0.0'});

    return new Promise((resolve, reject) => {
        docker.modem.followProgress(dockerStream, (err, res) => err ? reject(err) : resolve(res), (evt) => console.log(evt.stream));
    });
}
export async function applyInspector(kubectl) {

    await kubectl.deployment.create('../deployments/inspector.yaml');
    await kubectl.service.create('../services/inspector.yaml');
}
