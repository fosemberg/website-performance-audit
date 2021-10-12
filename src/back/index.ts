import express, {Response} from 'express';
import cors from "cors";

import {ExternalInput, FetchOnFinishConfig} from "../../config/types";
import {env} from "../../config/env";
import {measureSiteSpeed} from "./measureSiteSpeed";
import {checkValidExternalInput, getEnvironmentNames, getSiteNamesByEnvironmentName} from "../utils/envParser";
import {convertExternalInputToInternal} from "./convertExternalInputToInternal";
import {fetchOnFinishIfNeed} from "./fetchOnFinishIfNeed";

interface IQuery<T> {
  query: T;
}

const app = express();
app.use(cors());

const serverUrl = `${env.origin}:${env.port}`;
const environmentNames = getEnvironmentNames();
const exampleEnvironmentName = environmentNames[0] || '';
const siteNames = getSiteNamesByEnvironmentName(exampleEnvironmentName);
const exampleSiteName = siteNames[0] || '';
const exampleTagName = '1.32';
const urlExampleMessage = `${serverUrl}/?env=${exampleEnvironmentName}&site=${exampleSiteName}&tag=${exampleTagName}`;

app.get(
  '/',
  async (
    req: IQuery<ExternalInput>,
    res: Response,
    next
  ) => {
    try {
      const {query} = req;
      console.info('Start load test with parameters: ', query);
      checkValidExternalInput(query);
      const status = {
        status: 'testing',
        query,
      };
      res.json(status);
      console.log(status);
      measureSiteSpeed(convertExternalInputToInternal(query))
        .then(() => fetchOnFinishIfNeed(query, env.fetchOnFinish));
    } catch (e) {
      console.error(e);
      res.json({
        error: String(e),
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

if (env.isServeFrontStatic) {
  app.use('/static', express.static(`${__dirname}/../../../web`));
  console.info(`Application front available at: ${serverUrl}/static/index.html`);
}

const port = env.port || 3000;

console.log(`Server start on: ${serverUrl}`);
app.listen(env.port || 3000);
