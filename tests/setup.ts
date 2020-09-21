import {getDockerCredentialsFromMinikube, getDockerEnv, getServiceUrl, setupMinikube} from "./minikube";
import {applyInspector, buildInspector} from "./inspector";
import {installIstioManifest} from "./istio";
import * as child_process from "child_process";
const Docker = require('dockerode');
const K8s = require('k8s');

const statusHandler = async (kubectl,status) => {
    const pods = await kubectl.pod.list();
    const statuses = pods.items.map((item) => item.status.phase);
    const podsWithDifferentStatus = pods.items
        .filter( (pod) => pod.status.phase !== status)
        .map((pod) =>
        [
            pod.metadata.name,
            pod.status.phase
        ]
            );
     const someAreNotRunning = !statuses.every((curr_status: string) => {
         return curr_status === status

     });
     return {someAreNotRunning,podsWithDifferentStatus}
};
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export const waitPodsWithStatus = async (kubectl,status='Running') => {
    console.log("WAITING PODS WITH STATUS")
    let someAreNotRunning = true;
    let miss_count = 0;
    while (someAreNotRunning) {
        miss_count +=1;
        const retval  = await statusHandler(kubectl,status);
        someAreNotRunning = retval.someAreNotRunning;
        if (someAreNotRunning) {
            console.info(`Not all pods have state ${status}!`,retval.podsWithDifferentStatus);
            if (miss_count % 5 === 0){
                const out  = child_process.spawnSync('kubectl',['describe', 'pods']);
                console.error(out.stdout.toString());
            }
            await timeout(3000);
        }
    }
    console.log("ALL PODS WITH DESIRED STATUS")
    return
}

export async function setupTests(){
    let env;
    const kubectl = K8s.kubectl({
        binary: 'kubectl'
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
    console.log('[InstallInspector]: Installing inspector')
    await applyInspector(kubectl)
    console.log('[InstallInspector]: Inspector applied')
    const inspectorUrl = await getServiceUrl('inspector-service');
    console.info('[InstallInspector]: Inspector url is: ',inspectorUrl.trim());
    return inspectorUrl.trim();
}
