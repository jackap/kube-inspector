import express from 'express';
import {registerHealthCheck} from "./health";
import {registerInspectEndpoint} from "./inspect.endpoint";

export function createInspectorServer(): express.Application{
    const app = express();
    registerHealthCheck(app);
    registerInspectEndpoint(app);
    return app
}

