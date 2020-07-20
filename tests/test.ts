import {installInspector, setupTests, waitPodsWithStatus} from "./setup";
import {deleteInspector, inspect} from "./inspector";
import {applyDenyToDefaultNamespace, applyDenyToTestNamespace} from "./calico";
import {installIstio} from "./istio";

const verifyNoActivePods = async (kubectl) => {
    const pods = await kubectl.pod.list();
    console.log(pods.items[0]);
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

describe.skip('Kubernetes cluster tests', () =>
{
   let inspectorUrl,kubectl;
    beforeAll(async () => {
        jest.setTimeout(60*15*1000); // 15 minutes
        ({inspectorUrl,kubectl} = await setupTests());
    });

    it('case with istio enabled',async () => {

        const inspectorResponse = await inspect(inspectorUrl);
        expect(inspectorResponse).toMatchSnapshot();
    })

    it('case with istio enabled in two namespaces',async () => {
        await installIstio(kubectl,'test-namespace').catch((e) => (console.log(e)));
        await waitPodsWithStatus(kubectl);
        const inspectorResponse = await inspect(inspectorUrl);
        expect(inspectorResponse).toMatchSnapshot();
    });

    it('case with calico rules enabled for default namespace',async () => {

        await applyDenyToDefaultNamespace(kubectl);
        const inspectorResponse = await inspect(inspectorUrl);
        expect(inspectorResponse).toMatchSnapshot();
    });

    it('case with calico rules enabled for all namespaces',async () => {

        await applyDenyToTestNamespace(kubectl);
        const inspectorResponse = await inspect(inspectorUrl);
        expect(inspectorResponse).toMatchSnapshot();
    })
});
