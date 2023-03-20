import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { SqljsConnectionOptions } from 'typeorm/driver/sqljs/SqljsConnectionOptions';

const options: SqljsConnectionOptions = {
  type: 'sqljs',
  autoSave: true,
  useLocalForage: true,
  logging: ['error', 'query', 'schema'],
  synchronize: true,
  migrationsRun: true,
  entities: ['models/**/*.entities.ts'],
  migrations: ['migrations/*.ts'],
};

export const AppDataSource = new DataSource({
  ...options,
  location: 'graph.db',
});

export const TestDataSource = new DataSource({
  ...options,
  location: 'test.db',
  dropSchema: true,
});
