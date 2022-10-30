import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { screenshot } from "./utils/screenshot";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/", async (req: Request, res: Response) => {
  const ss = await screenshot();
  res.send(ss);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
