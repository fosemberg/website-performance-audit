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
  port?: number,
  origin?: string,
  iterations: number,
  influxDB: ISingleHostConfig,
  chromeFlags: Array<string>,
  lighthouseFlags: LH.SharedFlagsSettings,
  environments: Array<Environment>,
  sites: Array<SiteWithPages>,
  tags: Array<TagWithValues>
}
