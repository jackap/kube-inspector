import {getDockerCredentialsFromMinikube, getDockerEnv, setupMinikube} from "./minikube";
const Docker = require('dockerode');
const path = require('path');
async function main(){
    const credentials = await setupMinikube().then(getDockerEnv)
        .then((result) => getDockerCredentialsFromMinikube(result));

    console.log('Logging into docker with: ${credentials}');
    console.log(credentials);
    const docker = new Docker({
        ...credentials
    });

    docker.listContainers(function (err, containers) {
        containers.forEach(function (containerInfo) {
            console.log(containerInfo['Image'])
        });
    });
    let dockerStream: NodeJS.ReadableStream = await docker.buildImage({
        context: path.resolve(__dirname,'..'),
    }, {t: 'inspector:1.0.0'});

    return await new Promise((resolve, reject) => {
        console.log('Following build!');
        docker.modem.followProgress(dockerStream, (err, res) => err ? reject(err) : resolve(res), (evt) => console.log(evt));
    });

}

main().then(r => console.log(r));
