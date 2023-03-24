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
  Discussion,
  File,
  Post,
  Reaction,
  RelationshipPostFile,
  User,
} from '@/models/index';

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
    Discussion,
    File,
    Post,
    Reaction,
    RelationshipPostFile,
    User,
  ],
  migrations: ['migrations/*.ts'],
};

export const getAppDataSource = () =>
  new DataSource({
    ...options,
    location: 'graph.db',
  });
export const getTestDataSource = () =>
  new DataSource({
    ...options,
    location: 'test.db',
    dropSchema: true,
  });
