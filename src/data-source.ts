import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { SqljsConnectionOptions } from 'typeorm/driver/sqljs/SqljsConnectionOptions';
import {
  Node,
  NodePropertyKey,
  NodePropertyValue,
  NodeType,
  Relationship,
  RelationshipPropertyKey,
  RelationshipPropertyValue,
  RelationshipType,
} from '@/models/index';
import initSqlJs, { SqlJsStatic } from 'sql.js';
import localforage from 'localforage';

declare global {
  interface Window {
    localforage?: LocalForage;
    SQL?: SqlJsStatic;
  }
}

let _cache: Promise<void> | null = null;
const initialize = async () => {
  if (!_cache) {
    _cache = initSqlJs({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      locateFile: (file_1: any) => `https://sql.js.org/dist/${file_1}`,
    }).then((SQL) => {
      window.SQL = SQL;
      window.localforage = localforage;
      localforage.config({
        description: 'user',
        driver: localforage.INDEXEDDB,
      });
    });
  }

  return _cache;
};

const options: SqljsConnectionOptions = {
  type: 'sqljs',
  autoSave: true,
  useLocalForage: true,
  logging: ['error', 'query', 'schema'],
  synchronize: true,
  migrationsRun: true,
  entities: [
    Node,
    NodeType,
    NodePropertyKey,
    NodePropertyValue,
    Relationship,
    RelationshipType,
    RelationshipPropertyKey,
    RelationshipPropertyValue,
  ],
  migrations: ['migrations/*.ts'],
};

export const getAppDataSource = async () => {
  await initialize();
  new DataSource({
    ...options,
    location: 'graph.db',
  });
};

export const getTestDataSource = async () => {
  await initialize();
  return new DataSource({
    ...options,
    location: 'test.db',
    dropSchema: true,
  });
};
