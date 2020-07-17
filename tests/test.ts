import {setupTests} from "./setup";
import {inspect} from "./inspector";

describe('Kubernetes cluster tests', () =>
{
   let inspectorUrl;
    beforeAll(async () => {
        jest.setTimeout(60*10*1000);
        ({inspectorUrl} = await setupTests());
    });

    it('case with istio enabled',async () => {

        const inspectorResponse = await inspect(inspectorUrl);
        expect(inspectorResponse).toMatchSnapshot();
    })

});
