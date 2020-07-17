import {getDockerCredentialsFromMinikube, getDockerEnv, getServiceUrl, setupMinikube} from "./minikube";
import {applyInspector, buildInspector, inspect, INSPECT_ENDPOINT} from "./inspector";
import {installIstio} from "./istio";
import {installCalico} from "./calico";
const Docker = require('dockerode');
const K8s = require('k8s');
const fetch = require('node-fetch');

async function setupTests(){
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
    await applyInspector(kubectl).catch((e) => console.log(e));
    await installIstio(kubectl).catch((e) => (console.log(e)));
    await installCalico(kubectl).catch((e) => (console.log(e)));

    const inspectorUrl = await getServiceUrl('inspector-service');
    console.log('Inspector url is: ',inspectorUrl.trim())
    return {inspectorUrl: inspectorUrl.trim(),kubectl};
}

async function main(){ // TODO: wait for all containers to be up and running
    const {inspectorUrl} = await setupTests();
   const inspectorResponse = await inspect(inspectorUrl);

}
main().then(r => console.log(r));
