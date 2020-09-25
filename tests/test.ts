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
import {setupMinikube} from "./minikube";

const verifyNoActivePods = async (kubectl) => {
    const pods = await kubectl.pod.list();
    expect(pods.items.length).toBe(0)
};
const _10MINUTES = 60 * 20 * 1000
xdescribe('Test mechanism works', () => {
    let kubectl;
    beforeAll(async () => {
        jest.setTimeout(60 * 20 * 1000); // 20 minutes
        (kubectl = await setupTests());
    });

    afterEach( async () => {
        await verifyNoActivePods(kubectl)
       //    exec('minikube stop && kubectl config use-context minikube')
       // await setupMinikube()
    });
    it('There are no active pods when starting the tests', async () => {
    });

    it('There are no active pods when installing and deleting a service', async () => {

        await installInspector(kubectl);
        await waitPodsWithStatus(kubectl);
        await deleteInspector(kubectl);
        await waitPodsWithStatus(kubectl, 'Terminating');

    });
});

xdescribe('Kubernetes cluster tests with istio', () => {
    let kubectl;
    beforeAll(async () => {
        jest.setTimeout(60 * 20 * 1000); // 20 minutes
        (kubectl = await setupTests());
    });

    afterEach(async () => {
        await verifyNoActivePods(kubectl)
   //     exec('minikube stop && kubectl config use-context minikube')
   //     await setupMinikube()
    });
    it('Istio bookinfo example on single namespace', async () => {

        await installIstio(kubectl);
        const inspectorUrl = await installInspector(kubectl);
        await waitPodsWithStatus(kubectl);
        let inspectorResponse;
        try {
            inspectorResponse = await inspect(inspectorUrl);
            expect(inspectorResponse.length).toBe(1);
            expect(inspectorResponse[0].services.default).toMatchSnapshot();
            expect(inspectorResponse[0].services['test-namespace']).toBeUndefined();
            expect(inspectorResponse[0].namespaces).toMatchObject(
                ['default',
                    'istio-system',
                    'kube-system',
                    null]);
        } finally {
            await deleteInspector(kubectl);
            await deleteIstio(kubectl);
            await waitPodsWithStatus(kubectl, 'Terminating');
        }

    });

    it('Istio bookinfo example on multiple namespace', async () => {


        try {
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
                    'kube-system',
                    'test-namespace',
                    null]);
        } finally {
            try {
                await deleteIstio(kubectl);
                await deleteIstio(kubectl, 'test-namespace');
                await deleteInspector(kubectl);
                await waitPodsWithStatus(kubectl, 'Terminating');
            }
            catch (e){
                console.log("ANOMALY DETECTED DURING TEST")
            }

        }

    });

});

describe('Kubernetes cluster tests with istio and calico', () =>{
    let kubectl;
    beforeAll(async () => {
        jest.setTimeout(60 * 20 * 1000); // 20 minutes
        (kubectl = await setupTests());
        await installCalico(kubectl);
    });

    afterEach(async () => {
        await verifyNoActivePods(kubectl);
       // await setupMinikube()
    });
    afterAll(async () => await deleteCalico(kubectl));

    xit('Istio bookinfo example on single namespace and calico', async () => {

        await installIstio(kubectl);
        const inspectorUrl = await installInspector(kubectl);
        await waitPodsWithStatus(kubectl);
        let inspectorResponse;
        try {
            inspectorResponse = await inspect(inspectorUrl);
            expect(inspectorResponse.length).toBe(1);
            expect(inspectorResponse[0].services.default).toMatchSnapshot();
            expect(inspectorResponse[0].services['test-namespace']).toBeUndefined();
            expect(inspectorResponse[0].namespaces).toMatchObject(
                ['default',
                    'istio-system',
                    'kube-system',
                    null]);
        } finally {
            await deleteInspector(kubectl);
            await deleteIstio(kubectl);
            await waitPodsWithStatus(kubectl, 'Terminating');
        }

    });

    xit('Installing Istio bookinfo example on multiple namespaces with calico ' +
        'enabled does not enforce any security policy ', async () => {


        try {
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
                    'kube-system',
                    'test-namespace',
                    null]);
        } finally {
            await deleteIstio(kubectl);
            await deleteIstio(kubectl, 'test-namespace');
            await deleteInspector(kubectl);
            await waitPodsWithStatus(kubectl, 'Terminating');
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
                [null]);
        } finally {
            await deleteDenyToDefaultNamespace(kubectl)
            await deleteInspector(kubectl);
            await deleteIstio(kubectl);
            await waitPodsWithStatus(kubectl, 'Terminating');
        }

    },_10MINUTES);

    xit('Istio bookinfo example on multiple namespace', async () => {


        try {
            await installIstio(kubectl);
            await installIstio(kubectl, 'test-namespace');
            await applyDenyToAllNamespaces(kubectl);
            const inspectorUrl = await installInspector(kubectl);
            await waitPodsWithStatus(kubectl);
            let inspectorResponse;
            inspectorResponse = await inspect(inspectorUrl);
            expect(inspectorResponse.length).toBe(1);
            expect(inspectorResponse[0].services.default).toBeUndefined();
            expect(inspectorResponse[0].services['test-namespace']).toBeUndefined();

            expect(inspectorResponse[0].namespaces).toMatchObject(
                [null]);
        } finally {
            await deleteDenyToAllNamespaces(kubectl);
            await deleteIstio(kubectl);
            await deleteIstio(kubectl, 'test-namespace');
            await deleteInspector(kubectl);
            await waitPodsWithStatus(kubectl, 'Terminating');
        }

    },_10MINUTES)
});
