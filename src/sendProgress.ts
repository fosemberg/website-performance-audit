import lighthouse from 'lighthouse/lighthouse-core';
import * as Influx from 'influx';
import {IPoint, ISchemaOptions} from 'influx';
import {env} from './env';
import {Input, InputExternal, SendProgress, Site} from "./types";

const {influxDB: influxDBConfig} = env;

interface SchemaItem {
  measurement: string,
  score: Influx.FieldType,
}

const schemaItems: Array<SchemaItem> = [
  {measurement: 'progress', score: Influx.FieldType.INTEGER},
];

const schemaItemTags: Array<string> = [
  'environment',
  'site',
  'tag',
];

const schema: ISchemaOptions[] = schemaItems.map(schemaItem => {
  return {
    measurement: schemaItem.measurement,
    fields: {
      score: schemaItem.score,
      value: Influx.FieldType.FLOAT
    },
    tags: schemaItemTags,
  };
});

schema.push({
  measurement: 'score',
  fields: {
    score: Influx.FieldType.INTEGER,
    value: Influx.FieldType.FLOAT
  },
  tags: schemaItemTags,
});

const influx = new Influx.InfluxDB({
  ...influxDBConfig,
  schema,
});

export async function sendProgress(
  {
    environment,
    siteName,
    siteTag,
    progress
  }: SendProgress
): Promise<Array<IPoint>> {

  const point: IPoint = {
    measurement: 'progress',
    tags: {
      environment,
      site: siteName,
      tag: siteTag,
    },
    fields: {
      score: 1,
      value: progress,
    }
  };

  const points: Array<IPoint> = [point];

  const names = await influx.getDatabaseNames();
  if (!names.includes('lighthouse')) {
    await influx.createDatabase('lighthouse');
    await influx.createRetentionPolicy('lighthouse', {
      duration: '30d',
      database: 'lighthouse',
      replication: 1,
      isDefault: true
    });
  }
  await influx.writePoints(points);
  console.log('Sending progress...');
  console.log(points);
  return points;
}
