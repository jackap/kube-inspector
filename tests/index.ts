import {getDockerCredentialsFromMinikube, getDockerEnv, setupMinikube} from "./minikube";
import {applyInspector, buildInspector} from "./inspector";
import {installIstio} from "./istio";
import {installCalico} from "./calico";
const Docker = require('dockerode');
const K8s = require('k8s');


async function main(){
    const env = await setupMinikube().then(getDockerEnv);
    //const env = await getDockerEnv();
    const credentials = getDockerCredentialsFromMinikube(env);
    console.log('Logging into docker with:',credentials);
    const docker = new Docker({
        ...credentials
    });
    await buildInspector(docker);
    // Create API engine for kubernetes
    const kubectl = K8s.kubectl({
        binary: '/usr/local/bin/kubectl'
        ,version: '/api/v1'
    });
    await applyInspector(kubectl);
    await installIstio(kubectl).catch((e) => (console.log(e)));
    await installCalico(kubectl).catch((e) => (console.log(e)));
}

main().then(r => console.log(r));
