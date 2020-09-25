

const child_process = require('child_process');


export async function installIstioManifest(){
    return new Promise(function(resolve,reject ){
        console.log('[Istio]: Install istio manifest');
      // TODO: fetch istio version from env file
        let out = child_process.spawnSync('./istio-1.7.2/bin/istioctl', [
            'manifest',
            'install',
            '--set',
            'profile=demo'
        ]);

        if (out.status !== 0) {
            console.error('status: ' + out.status);
            try {
                console.error('stderr: ' + out.stderr.toString('utf8'));
            }
            catch (e){
                console.error('Could not get the root cause')
                reject("I do not know!")
            }

            resolve();

        }
        console.info(out.stdout.toString('utf8'));
        resolve(out.stdout.toString('utf8')); // TODO: probably there is nothing to return here
    })

};

export async function installIstio(kubectl,namespace='default'){
    console.log(`Installing istio on ${namespace} namespace...`);
    if (namespace !== 'default'){
        await kubectl.command(`create namespace ${namespace}` )
    }

        await kubectl.command(`label namespace ${namespace} istio-injection=enabled --overwrite`)
        await kubectl.command(`apply -f ./istio-1.7.2/samples/bookinfo/platform/kube/bookinfo.yaml -n ${namespace}`)
        await kubectl.command(`apply -f ./istio-1.7.2/samples/bookinfo/networking/bookinfo-gateway.yaml -n ${namespace}`)
}

export async function deleteIstio(kubectl,namespace='default'){
    console.log(`Deleting istio on ${namespace} namespace...`);


    await kubectl.command(`delete -f ./istio-1.7.2/samples/bookinfo/platform/kube/bookinfo.yaml -n ${namespace}`);
    await kubectl.command(`delete -f ./istio-1.7.2/samples/bookinfo/networking/bookinfo-gateway.yaml -n ${namespace}`);

    if (namespace !== 'default'){
        console.log(`Deleting ${namespace} namespace...`);
        await kubectl.command(`delete namespace ${namespace}` )
    }
}
