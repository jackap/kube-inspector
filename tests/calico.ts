export async function installCalico(kubectl){
    try{
        console.log("[Calico] Install calico")
        const output = await kubectl.command('apply -f https://docs.projectcalico.org/manifests/calico.yaml');
        console.log(output)
    }
    catch (e) {
       console.error(e)
    }


}

export async function deleteCalico(kubectl){
    try {
        console.log("[Calico] Delete calico")
        await kubectl.command('delete -f https://docs.projectcalico.org/manifests/calico.yaml');
    } catch (e) {
        console.error(e)
    }


}

export async function applyDenyToDefaultNamespace(kubectl){
    console.info('Applying default-deny to default namespace');
    const output = await kubectl.command('apply -f default-deny-single-namespace.yaml');
    console.log(output);
}

export async function applyDenyToAllNamespaces(kubectl){
    console.info('Applying default-deny to all namespaces');
    await kubectl.command('apply -f default-deny.yaml');
}

export async function deleteDenyToDefaultNamespace(kubectl){
    await kubectl.command('delete -f default-deny-single-namespace.yaml');
}

export async function deleteDenyToAllNamespaces(kubectl){
    await kubectl.command('delete -f default-deny.yaml');
}
