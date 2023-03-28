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

const asyncMemoize = <T>(f: () => Promise<T>): (() => Promise<T>) => {
  let _cache: Promise<T> | null = null;

  return () => {
    if (!_cache) {
      _cache = f();
    }

    return _cache;
  };
};

const initialize = asyncMemoize(async () => {
  return initSqlJs({
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
});

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

const getDataSource = (opts: SqljsConnectionOptions) => async () => {
  await initialize();
  return new DataSource(opts);
};

export const getAppDataSource = asyncMemoize(
  getDataSource({
    ...options,
    location: 'graph.db',
  }),
);

export const getTestDataSource = asyncMemoize(
  getDataSource({
    ...options,
    location: 'test.db',
    dropSchema: true,
  }),
);
