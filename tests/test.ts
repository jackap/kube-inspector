import {setupTests, waitUntilAllPodsAreRunning} from "./setup";
import {inspect} from "./inspector";
import {applyDenyToDefaultNamespace, applyDenyToTestNamespace, installCalico} from "./calico";
import {installIstio} from "./istio";

describe('Kubernetes cluster tests', () =>
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
        await waitUntilAllPodsAreRunning(kubectl);
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
