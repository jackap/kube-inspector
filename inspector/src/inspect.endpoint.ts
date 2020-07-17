import express from 'express'
import {getInspectorOutput} from "./inspector";
// @ts-ignore

export const registerInspectEndpoint = (app: express.Application) => {
    app.get('/inspect', async (_req: express.Request,res: express.Response) => {
        const data = await getInspectorOutput();
        res.status(200).json(data);
    });
};
