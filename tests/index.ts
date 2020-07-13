import {getDockerCredentialsFromMinikube, getDockerEnv, setupMinikube} from "./minikube";
const Docker = require('dockerode');
const path = require('path');

async function buildInspector(docker) {
    let dockerStream: NodeJS.ReadableStream = await docker.buildImage({
        context: path.resolve(__dirname, '..'),
    }, {t: 'inspector:1.0.0'});

    return new Promise((resolve, reject) => {
        docker.modem.followProgress(dockerStream, (err, res) => err ? reject(err) : resolve(res), (evt) => console.log(evt));
    });
}

async function main(){
    const env = await setupMinikube().then(getDockerEnv)
   // const env = getDockerEnv();
    const credentials = getDockerCredentialsFromMinikube(env);
    console.log('Logging into docker with:',credentials);
    const docker = new Docker({
        ...credentials
    });
    await buildInspector(docker)

}

main().then(r => console.log(r));
