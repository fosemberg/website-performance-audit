import {ISingleHostConfig} from "influx";

export interface SendProgress extends Input {
  progressPercent: number,
  progressMilliseconds: number,
}

export interface ExternalInput {
  env: string,
  site: string,
  tag: string,
  iterations?: number,
}

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

export interface Site {
  name: string,
  url: string,
}

interface Environment {
  name: string,
  sites: Array<Site>,
}

interface SiteWithPages {
  name: string,
  pages: Array<Site>,
}

interface TagValue {
  name: string,
  lighthouseFlags: LH.SharedFlagsSettings,
}

export interface TagWithValues {
  name: string,
  values: Array<TagValue>,
}

type InfluxDB = ISingleHostConfig & {
  database: string,
}

export interface FetchOnFinishConfig {
  url: string,
  isFetch: boolean,
  isAddParams: boolean,
  description?: string,
}

export interface Env {
  port?: number,
  origin?: string,
  isServeFrontStatic: boolean,
  fetchOnFinish?: FetchOnFinishConfig,
  iterations: number,
  influxDB: InfluxDB,
  chromeFlags: Array<string>,
  lighthouseFlags: LH.SharedFlagsSettings,
  environments: Array<Environment>,
  sites: Array<SiteWithPages>,
  tags: Array<TagWithValues>,
}
