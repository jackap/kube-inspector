export async function installCalico(kubectl){
    await kubectl.command('apply -f https://docs.projectcalico.org/manifests/calico.yaml').catch();


}

export async function deleteCalico(kubectl){
    await kubectl.command('delete -f https://docs.projectcalico.org/v3.2/getting-started/kubernetes/installation/rbac.yaml').catch();
    await kubectl.command('delete -f https://docs.projectcalico.org/manifests/calico.yaml').catch();


}

export async function applyDenyToDefaultNamespace(kubectl){
    console.info('Applying default-deny to default namespace');
    await kubectl.command('apply -f default-deny-single-namespace.yaml');
}

export async function applyDenyToAllNamespaces(kubectl){
    await kubectl.command('apply -f default-deny.yaml');
}

export async function deleteDenyToDefaultNamespace(kubectl){
    await kubectl.command('delete -f default-deny-single-namespace.yaml');
}

export async function deleteDenyToAllNamespaces(kubectl){
    await kubectl.command('delete -f default-deny.yaml');
}
