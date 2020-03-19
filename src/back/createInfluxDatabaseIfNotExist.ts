import * as Influx from 'influx';

export const createInfluxDatabaseIfNotExist = async (influx: Influx.InfluxDB, databaseName: string) => {
  const names = await influx.getDatabaseNames();
  if (!names.includes(databaseName)) {
    await influx.createDatabase(databaseName);
    await influx.createRetentionPolicy(databaseName, {
      duration: '30d',
      database: databaseName,
      replication: 1,
      isDefault: false
    });
  }
}
