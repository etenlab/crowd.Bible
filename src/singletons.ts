import { DataSource } from 'typeorm';
import { NodePropertyKeyRepository } from '@/repositories/node/node-property-key.repository';
import { NodePropertyValueRepository } from '@/repositories/node/node-property-value.repository';
import { NodeTypeRepository } from '@/repositories/node/node-type.repository';
import { NodeRepository } from '@/repositories/node/node.repository';
import { RelationshipPropertyKeyRepository } from '@/repositories/relationship/relationship-property-key.repository';
import { RelationshipPropertyValueRepository } from '@/repositories/relationship/relationship-property-value.repository';
import { RelationshipTypeRepository } from '@/repositories/relationship/relationship-type.repository';
import { RelationshipRepository } from '@/repositories/relationship/relationship.repository';
import { SyncSessionRepository } from '@/repositories/sync-session.repository';
import { DiscussionRepository } from '@/repositories/discussion/discussion.repository';
import { UserRepository } from '@/repositories/user.repository';
import { DbService } from '@/services/db.service';
import LexiconService from '@/services/lexicon.service';
import { NodeService } from '@/services/node.service';
import { SeedService } from '@/services/seed.service';
import { SyncService } from '@/services/sync.service';

export interface ISingletons {
  dbService: DbService;
  syncService: SyncService;
  nodeService: NodeService;
  lexiconService: LexiconService;
  seedService: SeedService;

  nodeRepo: NodeRepository;
  nodeTypeRepo: NodeTypeRepository;
  nodePropertyKeyRepo: NodePropertyKeyRepository;
  nodePropertyValueRepo: NodePropertyValueRepository;
  relationshipRepo: RelationshipRepository;
  relationshipTypeRepo: RelationshipTypeRepository;
  relationshipPropertyKeyRepo: RelationshipPropertyKeyRepository;
  relationshipPropertyValueRepo: RelationshipPropertyValueRepository;
  discussionRepo: DiscussionRepository;
  userRepo: UserRepository;
}

const _cache = new Map<DataSource, Promise<ISingletons>>();
const initialize = async (dataSource: DataSource): Promise<ISingletons> => {
  const ds = await dataSource.initialize();
  const dbService = new DbService(ds);

  const syncSessionRepository = new SyncSessionRepository(dbService);

  const syncService = new SyncService(dbService, syncSessionRepository);

  const nodeRepo = new NodeRepository(dbService, syncService);
  const nodeTypeRepo = new NodeTypeRepository(dbService, syncService);
  const nodePropertyKeyRepo = new NodePropertyKeyRepository(
    dbService,
    syncService,
  );
  const nodePropertyValueRepo = new NodePropertyValueRepository(
    dbService,
    syncService,
  );
  const relationshipRepo = new RelationshipRepository(dbService, syncService);
  const relationshipTypeRepo = new RelationshipTypeRepository(
    dbService,
    syncService,
  );
  const relationshipPropertyKeyRepo = new RelationshipPropertyKeyRepository(
    dbService,
    syncService,
  );
  const relationshipPropertyValueRepo = new RelationshipPropertyValueRepository(
    dbService,
    syncService,
  );
  const discussionRepo = new DiscussionRepository(dbService);
  const userRepo = new UserRepository(dbService);

  const nodeService = new NodeService(
    nodeRepo,
    nodePropertyKeyRepo,
    nodePropertyValueRepo,
    relationshipRepo,
    relationshipPropertyKeyRepo,
    relationshipPropertyValueRepo,
  );

  const seedService = new SeedService(
    nodeRepo,
    nodeTypeRepo,
    nodePropertyKeyRepo,
    nodePropertyValueRepo,
    relationshipRepo,
    relationshipTypeRepo,
    relationshipPropertyKeyRepo,
    relationshipPropertyValueRepo,
  );

  const lexiconService = new LexiconService(nodeService, nodeRepo);

  return {
    dbService,
    syncService,
    nodeService,
    lexiconService,
    seedService,

    nodeRepo,
    nodeTypeRepo,
    nodePropertyKeyRepo,
    nodePropertyValueRepo,
    relationshipRepo,
    relationshipTypeRepo,
    relationshipPropertyKeyRepo,
    relationshipPropertyValueRepo,
    discussionRepo,
    userRepo,
  };
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (dataSource: DataSource): Promise<ISingletons> => {
  let result = _cache.get(dataSource);
  if (!result) {
    result = initialize(dataSource);
    _cache.set(dataSource, result);
  }
  return result;
};
