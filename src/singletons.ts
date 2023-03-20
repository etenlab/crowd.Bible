import 'reflect-metadata';
import { DbService } from './services/db.service';
import { SyncService } from './services/sync.service';
import { SeedService } from './services/seed.service';
import { NodeRepository } from './repositories/node/node.repository';
import { NodePropertyKeyRepository } from './repositories/node/node-property-key.repository';
import { NodePropertyValueRepository } from './repositories/node/node-property-value.repository';
import { NodeTypeRepository } from './repositories/node/node-type.repository';
import { RelationshipTypeRepository } from './repositories/relationship/relationship-type.repository';
import { RelationshipPropertyValueRepository } from './repositories/relationship/relationship-property-value.repository';
import { RelationshipPropertyKeyRepository } from './repositories/relationship/relationship-property-key.repository';
import { RelationshipRepository } from './repositories/relationship/relationship.repository';
import { SyncSessionRepository } from './repositories/sync-session.repository';
import { AppDataSource } from './data-source';

// singletons
export const dbService = new DbService(AppDataSource);
export const syncSessionRepository = new SyncSessionRepository(dbService);
export const syncService = new SyncService(dbService, syncSessionRepository);
export const nodeRepository = new NodeRepository(dbService, syncService);
export const nodePropertyKeyRepository = new NodePropertyKeyRepository(
  dbService,
  syncService,
);
export const nodePropertyValueRepository = new NodePropertyValueRepository(
  dbService,
  syncService,
);
export const nodeTypeRepository = new NodeTypeRepository(
  dbService,
  syncService,
);
export const relationshipRepository = new RelationshipRepository(
  dbService,
  syncService,
);
export const relationshipProperyKeyRepository =
  new RelationshipPropertyKeyRepository(dbService, syncService);
export const relationshipPropertyValueRepository =
  new RelationshipPropertyValueRepository(dbService, syncService);
export const relationshipTypeRepository = new RelationshipTypeRepository(
  dbService,
  syncService,
);

export const seedService = new SeedService(
  nodeRepository,
  nodeTypeRepository,
  nodePropertyKeyRepository,
  nodePropertyValueRepository,
  relationshipRepository,
  relationshipTypeRepository,
  relationshipProperyKeyRepository,
  relationshipPropertyValueRepository,
);
