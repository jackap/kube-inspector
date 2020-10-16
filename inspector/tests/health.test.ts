import request from "supertest";
import { createInspectorServer } from "../src/server";

describe("Health check", () => {
  it("responds with 200 OK", done => {
    const app = createInspectorServer();
    request(app)
      .get("/healthz/ready")
      .expect(200, "OK")
      .end((err: Error) => {
        if (err) {
          throw err;
        }
      });
    done();
  });
});
