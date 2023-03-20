import {
  Node,
  NodeType,
  NodePropertyKey,
  NodePropertyValue,
  Relationship,
  RelationshipType,
  RelationshipPropertyKey,
  RelationshipPropertyValue,
} from '../models';
import initSqlJs from 'sql.js';
import { DataSource } from 'typeorm';
import { SyncSession } from '../models/Sync';

export class DbService {
  // todo
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  localForage: any;
  dataSource!: DataSource;
  // eslint-disable-next-line @typescript-eslint/ban-types
  private readonly startupSubscriptions: Function[] = [];

  constructor(dataSource: DataSource) {
    // todo
    this.initLocalForage().then(() => {
      initSqlJs({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        locateFile: (file: any) => `https://sql.js.org/dist/${file}`,
      }).then(async (SQL) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).SQL = SQL;
        this.dataSource = dataSource;
        this.dataSource.initialize();
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  onStartup(fn: Function) {
    this.startupSubscriptions.push(fn);
  }

  private async initLocalForage() {
    const localForageImport = await import('localforage');
    this.localForage = localForageImport.default;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).localforage = this.localForage;
    this.localForage.config({
      description: 'user',
      driver: this.localForage.INDEXEDDB,
    });

    return new DataSource({
      type: 'sqljs',
      autoSave: true,
      location: 'user',
      useLocalForage: true,
      logging: false,
      synchronize: true,
      entities: [
        SyncSession,
        Node,
        NodeType,
        NodePropertyKey,
        NodePropertyValue,
        Relationship,
        RelationshipType,
        RelationshipPropertyKey,
        RelationshipPropertyValue,
      ],
    });
  }

  status() {}
}
