import * as Influx from 'influx';
import {IPoint, ISchemaOptions} from 'influx';
import {env} from '../../config/env';
import {SendProgress} from "../../config/types";
import {createInfluxDatabaseIfNotExist} from "./createInfluxDatabaseIfNotExist";

const {influxDB: influxDBConfig} = env;

interface SchemaItem {
  measurement: string,
  score: Influx.FieldType,
}

const databaseName = 'lighthouse';

const schemaItems: Array<SchemaItem> = [
  {measurement: 'progress', score: Influx.FieldType.INTEGER},
];

const schemaItemTags: Array<string> = [
  'environment',
  'site',
  'tag',
  'progressType',
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
    progressPercent,
    progressMilliseconds,
  }: SendProgress
): Promise<Array<IPoint>> {
  const points: Array<IPoint> = [
    {
      measurement: 'progress',
      tags: {
        environment,
        site: siteName,
        tag: siteTag,
        progressType: 'percent'
      },
      fields: {
        score: 1,
        value: progressPercent,
      }
    },
    {
      measurement: 'progress',
      tags: {
        environment,
        site: siteName,
        tag: siteTag,
        progressType: 'milliseconds'
      },
      fields: {
        score: 1,
        value: progressMilliseconds,
      }
    }
  ];

  await createInfluxDatabaseIfNotExist(influx, databaseName);
  await influx.writePoints(points);
  console.log('Sending progress...');
  console.log(points);
  return points;
}
