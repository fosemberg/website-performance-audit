import express, {Request, Response} from 'express';
import cors from "cors";

import {ExternalInput} from "../../config/types";
import {env} from "../../config/env";
import {measureSiteSpeed} from "./measureSiteSpeed";
import {checkValidExternalInput} from "../utils/envParser";

interface IQuery<T> {
  query: T;
}

const app = express();
app.use(cors());
const urlExampleMessage = 'http://example.com/?env=trunk&site=some-site&tag=1.32';

app.get(
  '/',
  async (
    {query}: IQuery<ExternalInput>,
    res: Response
  ) => {
    try {
      if (checkValidExternalInput(query) === true) {
        const status = {
          status: 'testing',
          buildParameters: query,
        };
        res.json(status);
        console.log(status);
        measureSiteSpeed(query).then();
      }
    } catch (e) {
      console.error(e);
      res.json({
        error: e.toString(),
        "url-example": urlExampleMessage,
      });
    }
  }
);

app.get('/help', ({}, res: Response) => {
    res.json({
      "url-example": urlExampleMessage,
    });
  }
);

const port = env.port || 3000;

console.log(`Server start on port: ${port}`)
app.listen(env.port || 3000);
