import {getDockerCredentialsFromMinikube, getDockerEnv, getServiceUrl, setupMinikube} from "./minikube";
import {applyInspector, buildInspector} from "./inspector";
import {installIstioManifest} from "./istio";
import {installCalico} from "./calico";
const Docker = require('dockerode');
const K8s = require('k8s');

const statusHandler = async (kubectl,status) => {
    const pods = await kubectl.pod.list();
    const statuses = pods.items.map((item) => item.status.phase);
     return !statuses.every((curr_status: string) => {
         return curr_status === status

     });
};
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export const waitPodsWithStatus = async (kubectl,status='Running') => {
    let someAreNotRunning = true;
    while (someAreNotRunning) {
        someAreNotRunning = await statusHandler(kubectl,status);
        if (someAreNotRunning) {
            console.info(`Not all pods have state ${status}!`);
            await timeout(5000);
        }
    }
    return
}

export async function setupTests(){
    let env;
    const kubectl = K8s.kubectl({
        binary: '/usr/local/bin/kubectl'
        ,version: '/api/v1'
    });
    try {
        env = await getDockerEnv();
        const credentials = getDockerCredentialsFromMinikube(env);
        console.info('Logging into docker using IP ',credentials.host);
    }
    catch (e) {
        console.info('Starting minikube from scratch');
        env = await setupMinikube().then(getDockerEnv);
        const credentials = getDockerCredentialsFromMinikube(env);
        console.info('Logging into docker using IP ',credentials.host);
        const docker = new Docker({
            ...credentials
        });
        await buildInspector(docker);
        await installIstioManifest();
    }

    await waitPodsWithStatus(kubectl);
    return kubectl;
}

export async function installInspector(kubectl){
    await applyInspector(kubectl).catch((e) => console.log(e));
    const inspectorUrl = await getServiceUrl('inspector-service');
    console.info('Inspector url is: ',inspectorUrl.trim())
    return inspectorUrl.trim();
}
