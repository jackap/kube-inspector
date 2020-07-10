import express from 'express'
export const registerHealthCheck = (app: express.Application) => {
    app.get('/healthz/ready', (_req: express.Request,res: express.Response) => {
        res.status(200).send('OK')
    });
};
