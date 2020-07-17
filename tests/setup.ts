import {getDockerCredentialsFromMinikube, getDockerEnv, getServiceUrl, setupMinikube} from "./minikube";
import {applyInspector, buildInspector} from "./inspector";
import {installIstio} from "./istio";
import {installCalico} from "./calico";
const Docker = require('dockerode');
const K8s = require('k8s');

const timeoutHandler = async (kubectl) => {
    console.info('Not all pods are running!');
    const pods = await kubectl.pod.list();
    const statuses = pods.items.map((item) => item.status.phase);
     return !statuses.every((status: string) => status === "Running");
};
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export const waitUntilAllPodsAreRunning = async (kubectl) => {
    let someAreNotRunning = true;
    while (someAreNotRunning) {
        someAreNotRunning = await timeoutHandler(kubectl);
        await timeout(5000);
    }
    return
}

export async function setupTests(){
    let env;
    try {
        env = await getDockerEnv();
    }
    catch (err) {
        console.error(err);
        env = await setupMinikube().then(getDockerEnv);
    }
    const credentials = getDockerCredentialsFromMinikube(env);
    console.info('Logging into docker using IP ',credentials.host);
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

    await waitUntilAllPodsAreRunning(kubectl);
    const inspectorUrl = await getServiceUrl('inspector-service');
    console.info('Inspector url is: ',inspectorUrl.trim())
    return {inspectorUrl: inspectorUrl.trim(),kubectl};
}
