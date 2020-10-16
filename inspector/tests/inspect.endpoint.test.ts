import { NmapResult } from "../src/interfaces";

jest.mock("../src/utils.ts");
jest.mock("../src/extractors/dns");
import request from "supertest";
import { getDnsNames } from "../src/extractors/dns";
import { createInspectorServer } from "../src/server";
import { getIPAddresses, scanIpRange } from "../src/utils";
import { results } from "./fixtures/nmap-results";

describe("Inspect endpoint", () => {
  it("returns correct data", async () => {
    jest.setTimeout(10000);
    const expectedBody = [
      {
        ipRange: "fooo",
        namespaces: ["default", "istio-system", "kube-system", null],
        services: {
          default: [
            // TODO: this should return a set
            "details",
            "productpage",
            "ratings",
            "reviews",
            "reviews",
            "reviews"
          ],
          "kube-system": ["kube-dns", "kube-dns"],
          "istio-system": [
            "grafana",
            "istio-egressgateway",
            "istio-ingressgateway",
            "istiod",
            "kiali",
            "prometheus",
            "zipkin"
          ]
        },
        options: { docker: false, hasInternetAccess: true }
      }
    ];
    const scanIpRangeStub = scanIpRange as jest.Mock<Promise<NmapResult[]>>;
    const getIpAddressStub = getIPAddresses as jest.Mock<string[]>;
    const getDnsNamesStub = getDnsNames as jest.Mock<Promise<any>>;

    getDnsNamesStub.mockReturnValue(
      Promise.resolve({
        hostname: "test-dns",
        addresses: []
      })
    );
    scanIpRangeStub.mockReturnValue(Promise.resolve(results));
    getIpAddressStub.mockReturnValue(["fooo"]);
    const app = createInspectorServer();
    await request(app)
      .get("/inspect")
      .expect(200, expectedBody);

    expect(scanIpRangeStub).toHaveBeenCalled();
  });
});
