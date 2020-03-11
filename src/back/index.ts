import express, {Request, Response} from 'express';
import {InputExternal} from "../../config/types";
import {env} from "../../config/env";
import {measureSiteSpeed} from "./measureSiteSpeed";
import cors from "cors";

interface IQuery<T> {
  query: T;
}

const app = express();
app.use(cors());
const urlExampleMessage = 'http://example.com/?env=trunk&site=some-site&tag=1.32';

app.get(
  '/',
  async (
    {query}: IQuery<InputExternal>,
    res: Response
  ) => {
    try {
      const status = {
        status: 'testing',
        buildParameters: query,
      };
      res.json(status);
      console.log(status);
      measureSiteSpeed(query).then();
    } catch (e) {
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
