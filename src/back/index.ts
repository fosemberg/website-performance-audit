import express, {Request, Response} from 'express';
import {InputExternal} from "../../config/types";
import {measureSiteSpeed} from "./measureSiteSpeed";

interface IQuery<T> {
  query: T;
}

const app = express();
const urlExampleMessage = 'http://example.com/?env=trunk&site=some-site&tag=1.32';

app.get(
  '/',
  async (
    {query}: IQuery<InputExternal>,
    res: Response
  ) => {
    try {
      res.json(await measureSiteSpeed(query));
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

const port = process.env.PORT || 3000;

console.log(`Server start on port: ${port}`)
app.listen(process.env.PORT || 3000);
