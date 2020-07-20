import {installInspector, setupTests, waitPodsWithStatus} from "./setup";
import {deleteInspector, inspect} from "./inspector";
import {applyDenyToDefaultNamespace, applyDenyToTestNamespace, installCalico} from "./calico";
import {deleteIstio, installIstio} from "./istio";

const verifyNoActivePods = async (kubectl) => {
    const pods = await kubectl.pod.list();
    expect(pods.items.length).toBe(0)
};

describe('Test mechanism works', () => {
    let kubectl;
    beforeAll(async () => {
        jest.setTimeout(60 * 15 * 1000); // 15 minutes
        (kubectl = await setupTests());
    });

    afterEach( async () => {
        await verifyNoActivePods(kubectl)
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

describe('Kubernetes cluster tests with istio', () => {
    let kubectl;
    beforeAll(async () => {
        jest.setTimeout(60 * 15 * 1000); // 15 minutes
        (kubectl = await setupTests());
    });

    afterEach(async () => {
        await verifyNoActivePods(kubectl)
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
            await deleteIstio(kubectl);
            await deleteIstio(kubectl, 'test-namespace');
            await deleteInspector(kubectl);
            await waitPodsWithStatus(kubectl, 'Terminating');
        }

    });

});

describe('Kubernetes cluster tests with istio and calico', () =>{
    let kubectl;
    beforeAll(async () => {
        jest.setTimeout(60 * 15 * 1000); // 15 minutes
        (kubectl = await setupTests());
        await installCalico(kubectl);
    });

    afterEach(async () => {
        await verifyNoActivePods(kubectl)
    });
    it.skip('case with calico rules enabled for default namespace',async () => {

        await applyDenyToDefaultNamespace(kubectl);
        const inspectorResponse = await inspect('');
        expect(inspectorResponse).toMatchSnapshot();
    });

    it.skip('case with calico rules enabled for all namespaces',async () => {

        await applyDenyToTestNamespace(kubectl);
        const inspectorResponse = await inspect('');
        expect(inspectorResponse).toMatchSnapshot();
    })
});
