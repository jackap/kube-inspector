import {NmapResult} from "../src/interfaces";

jest.mock('../src/utils.ts')

import {createInspectorServer} from "../src/server";
import request from 'supertest';
import {scanIpRange,getIPAddresses} from "../src/utils";
import {results} from "./fixtures/nmap-results";

describe('Inspect endpoint', () => {
    it('returns correct data', async () => {
        const expectedBody = [{
            ipRange: 'fooo',
            namespaces: [ 'default', 'istio-system', 'kube-system', null ],
            services: {
                'default': [ // TODO: this should return a set
                    'details',
                    'productpage',
                    'ratings',
                    'reviews',
                    'reviews',
                    'reviews'
                ],
                'kube-system': [ 'kube-dns', 'kube-dns' ],
                'istio-system': [
                    'grafana',
                    'istio-egressgateway',
                    'istio-ingressgateway',
                    'istiod',
                    'kiali',
                    'prometheus',
                    'zipkin']
            }
        }];
        const scanIpRangeStub  = scanIpRange as jest.Mock<Promise<NmapResult[]>>;
        const getIpAddressStub  = getIPAddresses as jest.Mock<string[]>;

        scanIpRangeStub.mockReturnValue(Promise.resolve(results));
        getIpAddressStub.mockReturnValue(['fooo'])
        const app = createInspectorServer();
        await request(app)
            .get('/inspect')
            .expect(200,expectedBody);

        expect(scanIpRangeStub).toHaveBeenCalled();
})});
