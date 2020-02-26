import {ISingleHostConfig} from "influx";

interface Url {
  name: string,
  url: string,
}

interface Input {
  environment: string,
  siteName: string,
  siteTag: string,
}

interface Site {
  name: string,
  url: string,
}

interface Environment {
  name: string,
  sites: Array<Site>
}

interface SitePages {
  name: string,
  pages: Array<Site>
}

interface TagValue {
  name: string,
  lighthouseFlags: any
}

interface Tag {
  name: string,
  values: Array<TagValue>
}

export interface Env {
  // DELETE LEGACY {
  environment: string,
  urls: Array<Url>,
  // DELETE LEGACY }

  input: Input
  iterations: number,
  influxDB: ISingleHostConfig,
  chromeFlags: Array<string>,
  lighthouseFlags: any,
  environments: Array<Environment>,
  sites: Array<SitePages>,
  tags: Array<Tag>
}
