import * as fs from "fs";

const child_process = require('child_process');


function deleteExistingCluster(){
    const out = child_process.spawnSync('minikube', ['delete']);

    if (out.status !== 0){
        console.error('status: ' + out.status);
        console.error('stdout: ' + out.stdout.toString('utf8'));
        return false;

    }
    console.info(out.stdout.toString('utf8'));
    return true;
};

function createNewCluster(){
    const out = child_process.spawnSync('minikube', [
        'start', '--vm-driver=hyperkit',
        '--network-plugin=cni',
        '--extra-config=kubelet.network-plugin=cni'
    ]);

    if (out.status !== 0){
        console.error('status: ' + out.status);
        console.error('stdout: ' + out.stdout.toString('utf8'));
        return false
    }
    console.info(out.stdout.toString('utf8'));
    return true
};

export function setupMinikube() {
    return new Promise(
        (resolve, reject) => {
            if (
                deleteExistingCluster()
                &&
                createNewCluster()
            ) {
                resolve(true)
            } else {
                reject(new Error('Minikube not working'))
            }
        }
    )
};

export function getDockerEnv() {
    return new Promise(
        (resolve, reject) => {
            const out = child_process.spawnSync('minikube', [
                '-p', 'minikube',
                'docker-env'
            ]);
            if (out.status !== 0) {
                console.error('status: ' + out.status);
                console.error('stdout: ' + out.stdout.toString('utf8'));
                reject(new Error('Could not get docker environment'))
            }
            console.info(out.stdout.toString('utf8'));
            resolve(out.stdout.toString('utf8'));


        }
    );
}

export function getDockerCredentialsFromMinikube(result) {
    const DOCKER_HOST = 1;
    const DOCKER_CERT_PATH = 2;
    /**
     * Results are in the form:
     * DOCKER_TLS_VERIFY,
     * DOCKER_HOST,
     * DOCKER_CERT_PATH,
     * MINIKUBE_ACTIVE_DOCKERD */
    const variables = result.split('\n');
    const variablesRegexes = [/(.*)/, // dummy element
        /.*="(.*):\/\/(.*):(\d+)/,
        /.*="(.*)"/];

    const [_, protocol, host, port] = variablesRegexes[DOCKER_HOST].exec(variables[DOCKER_HOST]);
    const [__,path] = variablesRegexes[DOCKER_CERT_PATH].exec(variables[DOCKER_CERT_PATH]);
    return {
        protocol: 'https',
        host,
        port,
        ca: fs.readFileSync(path + '/ca.pem'),
        cert: fs.readFileSync(path +'/cert.pem'),
        key: fs.readFileSync(path + '/key.pem')}
}

export function getServiceUrl(serviceName: string) {
    return new Promise(
        (resolve, reject) => {
            const out = child_process.spawnSync('minikube', [
                'service', serviceName,
                '--url'
            ]);
            if (out.status !== 0) {
                console.error('status: ' + out.status);
                console.error('stdout: ' + out.stdout.toString('utf8'));
                reject(new Error('Could not get docker environment'))
            }
            resolve(out.stdout.toString('utf8'));


        }
    );
}
