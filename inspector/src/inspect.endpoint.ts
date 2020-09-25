import express from "express";
import { getInspectorOutput } from "./inspector";
// @ts-ignore

export const registerInspectEndpoint = (app: express.Application) => {
  app.get("/inspect", async (req: express.Request, res: express.Response) => {
    res.setTimeout(300 * 1000, () => console.log("Timed out"));
    console.info("Inspector endpoint called");
    const data = await getInspectorOutput();
    res.status(200).json(data);
  });
};
