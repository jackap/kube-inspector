export async function installCalico(kubectl){
    await kubectl.command('apply -f https://docs.projectcalico.org/v3.2/getting-started/kubernetes/installation/rbac.yaml').catch();
    await kubectl.command('apply -f https://docs.projectcalico.org/manifests/calico.yaml').catch();


}
