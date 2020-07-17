

const child_process = require('child_process');


function installManifest(){
    return new Promise(function(resolve,reject ){
      // TODO: fetch istio version from env file
        const out = child_process.spawnSync('./istio-1.6.0/bin/istioctl', [
            'manifest',
            'apply',
            '--set',
            'profile=demo'
        ]);

        if (out.status !== 0){
            console.error('status: ' + out.status);
            console.error('stdout: ' + out.stdout.toString('utf8'));
            resolve({ // TODO: use proper reject schema here
                one: out.stdout.toString('utf8'),
                two: out.stderr.toString('utf8')
            });

        }
        console.info(out.stdout.toString('utf8'));
        resolve(out.stdout.toString('utf8')); // TODO: probably there is nothing to return here
    })

};

export async function installIstio(kubectl,namespace='default'){
    if (namespace !== 'default'){
        await kubectl.createNamespace(namespace)
    }

    await installManifest()
        .then(kubectl.command(`label namespace ${namespace} istio-injection=enabled --overwrite`))
        .then(kubectl.command(`apply -f ./istio-1.6.0/samples/bookinfo/platform/kube/bookinfo.yaml -n ${namespace}`))
        .then(kubectl.command(`apply -f ./istio-1.6.0/samples/bookinfo/networking/bookinfo-gateway.yaml -n ${namespace}`))
}


