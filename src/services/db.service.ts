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

  constructor() {
    // todo
    this.initLocalForage().then(() => {
      initSqlJs({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        locateFile: (file: any) => `https://sql.js.org/dist/${file}`,
      }).then(async (SQL) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).SQL = SQL;
        this.dataSource = this.configureConnection();
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
  }

  private configureConnection() {
    this.localForage.config({
      description: 'user',
      driver: this.localForage.INDEXEDDB,
    });

    return new DataSource({
      type: 'sqljs',
      autoSave: true,
      location: 'user',
      useLocalForage: true,
      logging: ['error', 'query', 'schema'],
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

  status() {
    console.log('//todo');
  }
}

// export class UserRepository {
//   repository!: Repository<User>;

//   constructor(private dbService: DbService) {
//     this.repository = this.dbService.dataSource.getRepository(User);
//   }

//   async save(user: User) {
//     return this.repository.save(user);
//   }

//   async all() {
//     return this.repository.find();
//   }
// }
