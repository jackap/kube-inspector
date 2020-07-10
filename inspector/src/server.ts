import * as express from 'express';
import {registerHealthCheck} from "./health";

export function createInspectorServer(): express.Application{
    // @ts-ignore
    const app = express();
    registerHealthCheck(app);
    return app
}

