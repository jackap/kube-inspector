import {NmapResult} from "../src/interfaces";

jest.mock('../src/utils.ts')

import {createInspectorServer} from "../src/server";
import request from 'supertest';
import {scanIpRange,getIPAddresses} from "../src/utils";
import {results} from "./fixtures/nmap-results";

describe('Inspect endpoint', () => {
    it('returns correct data', async () => {
        const expectedBody = {
            namespaces: [ null, 'kube-system', 'istio-system', 'default' ],
            services: {
                'kube-system': [ 'kube-dns', 'kube-dns' ],
                'istio-system': [
                    'istiod',
                    'istio-ingressgateway',
                    'istio-egressgateway',
                    'zipkin',
                    'grafana',
                    'kiali',
                    'prometheus'
                ],
                default: [
                    'details',
                    'ratings',
                    'reviews',
                    'reviews',
                    'reviews',
                    'productpage'
                ]
            }
        };
        const scanIpRangeStub  = scanIpRange as jest.Mock<Promise<NmapResult[]>>;
        const getIpAddressStub  = getIPAddresses as jest.Mock<String[]>;

        scanIpRangeStub.mockReturnValue(Promise.resolve(results));
        getIpAddressStub.mockReturnValue(['fooo'])
        const app = createInspectorServer();
        await request(app)
            .get('/inspect')
            .expect(200,expectedBody);

        expect(scanIpRangeStub).toHaveBeenCalled();
})});
