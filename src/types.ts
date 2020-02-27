import {ISingleHostConfig} from "influx";

interface Url {
  name: string,
  url: string,
}

export interface Input {
  environment: string,
  siteName: string,
  siteTag: string,
  iterations: number,
}

export type InputExternal =  MakeOptional<Input, 'iterations'>;

export interface Site {
  name: string,
  url: string,
}

interface Environment {
  name: string,
  sites: Array<Site>
}

interface SiteWithPages {
  name: string,
  pages: Array<Site>
}

interface TagValue {
  name: string,
  lighthouseFlags: LH.SharedFlagsSettings
}

export interface TagWithValues {
  name: string,
  values: Array<TagValue>
}

export interface Env {
  input: InputExternal,
  iterations: number,
  influxDB: ISingleHostConfig,
  chromeFlags: Array<string>,
  lighthouseFlags: LH.SharedFlagsSettings,
  environments: Array<Environment>,
  sites: Array<SiteWithPages>,
  tags: Array<TagWithValues>
}
