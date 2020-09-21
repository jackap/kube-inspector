import {getDockerCredentialsFromMinikube, getDockerEnv, getServiceUrl, setupMinikube} from "./minikube";
import {applyInspector, buildInspector} from "./inspector";
import {installIstioManifest} from "./istio";
import * as child_process from "child_process";
import {exec} from "child_process";
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
    let someAreNotRunning = true;
    let miss_count = 0;
    while (someAreNotRunning) {
        miss_count +=1;
        const retval  = await statusHandler(kubectl,status);
        someAreNotRunning = retval.someAreNotRunning;
        if (someAreNotRunning) {
            if (miss_count % 10 === 0)
                console.info(`Not all pods have state ${status}!`,retval.podsWithDifferentStatus);
            if (miss_count % 15 === 0){
                const out  = child_process.spawnSync('kubectl',['describe', 'pods']);
                console.error(out.stdout.toString());
            }
            await timeout(6000);
        }
    }
    return
}

export async function setupTests(){
    const kubectl = K8s.kubectl({
        binary: 'kubectl'
        ,version: '/api/v1'
    });

        console.info('Starting minikube from scratch');
        await setupMinikube()//.then(getDockerEnv);
        //const credentials = getDockerCredentialsFromMinikube(env);
        //console.info('Logging into docker using IP ',credentials.host);
        //const docker = new Docker({
        //    ...credentials
       // });
       const commands = [ 'pwd','eval $(minikube -p minikube docker-env)',
           'docker build -t inspector:1.0.0 ..'

        ]
        exec(commands.join(' && '), (error,stdout,stderr) => {
            console.log(error);console.log(stdout);console.log(stderr);
        })
        // await buildInspector(docker);
        await installIstioManifest();

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
