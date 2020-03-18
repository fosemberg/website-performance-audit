import express, {Response} from 'express';
import cors from "cors";

import {ExternalInput} from "../../config/types";
import {env} from "../../config/env";
import {measureSiteSpeed} from "./measureSiteSpeed";
import {checkValidExternalInput, getEnvironmentNames, getSiteNamesByEnvironmentName} from "../utils/envParser";
import {convertExternalInputToInternal} from "./convertExternalInputToInternal";

interface IQuery<T> {
  query: T;
}

const app = express();
app.use(cors());

const environmentNames = getEnvironmentNames();
const exampleEnvironmentName = environmentNames[0] || '';
const siteNames = getSiteNamesByEnvironmentName(exampleEnvironmentName);
const exampleSiteName = siteNames[0] || '';
const exampleTagName = '1.32';
const urlExampleMessage = `http://example.com/?env=${exampleEnvironmentName}&site=${exampleSiteName}&tag=${exampleTagName}`;

app.get(
  '/',
  async (
    {query}: IQuery<ExternalInput>,
    res: Response
  ) => {
    try {
      checkValidExternalInput(query);
      const status = {
        status: 'testing',
        query,
      };
      res.json(status);
      console.log(status);
      measureSiteSpeed(convertExternalInputToInternal(query)).then();
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

console.log(`Server start on port: ${port}`);
app.listen(env.port || 3000);
