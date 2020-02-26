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

export interface Tag {
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
  lighthouseFlags: LH.SharedFlagsSettings,
  environments: Array<Environment>,
  sites: Array<SiteWithPages>,
  tags: Array<Tag>
}
