import {installInspector, setupTests, waitPodsWithStatus} from "./setup";
import {deleteInspector, inspect} from "./inspector";
import {
    installCalico,
    deleteCalico,
    applyDenyToDefaultNamespace,
    deleteDenyToDefaultNamespace,
    applyDenyToAllNamespaces,
    deleteDenyToAllNamespaces,
} from "./calico";
import {deleteIstio, installIstio} from "./istio";
import {exec} from "child_process";
const K8s = require('k8s');

const kubectl = K8s.kubectl({
    binary: 'kubectl'
    ,version: '/api/v1'
});

const verifyNoActivePods = async (kubectl) => {
    const pods = await kubectl.pod.list();
    if(pods.items.length !== 0){
        console.error(pods.items)
    }
  //  expect(pods.items.length).toBe(0)
};

const withCleanupSingleNamespace = async (caller: () => Promise<void>) => {
    await caller
    await kubectl.command("delete --all pods --namespace=default")
    await kubectl.command("delete --all deployments --namespace=default");
    await kubectl.command("delete --all services --namespace=default")

}

const _10MINUTES = 60 * 20 * 1000
describe('Kubernetes cluster tests with istio and calico', () =>{
    beforeAll(async () => {
        jest.setTimeout(60 * 20 * 1000); // 20 minutes
         await installCalico(kubectl);
    });

    afterEach(async () => {
        // FIXME: verify also that pods are not running in test-namespace
        await verifyNoActivePods(kubectl)
        const testName = expect.getState().currentTestName
        console.log(`${testName} Ended`)
    });
    afterAll(async () => await deleteCalico(kubectl));

    it('Istio bookinfo example on single namespace and calico', async () => {
        try {
            await installIstio(kubectl);
            const inspectorUrl = await installInspector(kubectl);
            await waitPodsWithStatus(kubectl);
            let inspectorResponse;
            inspectorResponse = await inspect(inspectorUrl);
            expect(inspectorResponse.length).toBe(1);
            expect(inspectorResponse[0].services.default).toMatchSnapshot();
            expect(inspectorResponse[0].services['test-namespace']).toBeUndefined();
            expect(inspectorResponse[0].namespaces).toMatchObject(
                ['default',
                    'istio-system',
                    null]);
        }
        finally {
            await deleteIstio(kubectl);
            await deleteInspector(kubectl);
            await waitPodsWithStatus(kubectl, 'Terminating');
            await kubectl.command("delete --all pods --namespace=default")
            await kubectl.command("delete --all deployments --namespace=default");
            await kubectl.command("delete --all services --namespace=default");
        }

    });

    it('Istio bookinfo example on single namespace and calico rules', async () => {

        await installIstio(kubectl);
        const inspectorUrl = await installInspector(kubectl);
        await waitPodsWithStatus(kubectl);
        await applyDenyToDefaultNamespace(kubectl);
        let inspectorResponse;
        try {
            inspectorResponse = await inspect(inspectorUrl);
            expect(inspectorResponse.length).toBe(1);
            expect(inspectorResponse[0].services.default).toBeUndefined();
            expect(inspectorResponse[0].namespaces).toMatchObject(
                ['istio-system',null]);
        } finally {
            await deleteDenyToDefaultNamespace(kubectl)
            await kubectl.command("delete --all services --namespace=default")
            await kubectl.command("delete --all deployments --namespace=default");
            await kubectl.command("delete --all pods --namespace=default")
            await waitPodsWithStatus(kubectl, 'Terminating');
        }

    },_10MINUTES);

    it('Installing Istio bookinfo example on multiple namespaces with calico ' +
        'enabled hides istio and kube-system namespaces', async () => {


            await installIstio(kubectl);
            await installIstio(kubectl, 'test-namespace');
            const inspectorUrl = await installInspector(kubectl);
            await waitPodsWithStatus(kubectl);
            let inspectorResponse;
            inspectorResponse = await inspect(inspectorUrl);
            expect(inspectorResponse.length).toBe(1);
            expect(inspectorResponse[0].services.default).toMatchSnapshot();
            expect(inspectorResponse[0].services['test-namespace']).not.toBeUndefined();
            expect(inspectorResponse[0].services['test-namespace']).toMatchSnapshot();

            expect(inspectorResponse[0].namespaces).toMatchObject(
                ['default',
                    'istio-system',
                    'test-namespace',
                    null]);

        await applyDenyToAllNamespaces(kubectl);
        await waitPodsWithStatus(kubectl);
        inspectorResponse = await inspect(inspectorUrl);
        expect(inspectorResponse.length).toBe(1);
        expect(inspectorResponse[0].services.default).toBeUndefined();
        expect(inspectorResponse[0].services['test-namespace']).toBeUndefined();

        expect(inspectorResponse[0].namespaces).toMatchObject(
            ['istio-system',null]);
        await deleteDenyToAllNamespaces(kubectl);
        await kubectl.command("delete --all services --namespace=default")
        await kubectl.command("delete --all deployments --namespace=default");
        await kubectl.command("delete --all pods --namespace=default")
        await kubectl.command("delete namespace test-namespace").catch()
        await waitPodsWithStatus(kubectl, 'Terminating');
    });


});
