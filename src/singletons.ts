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

import { ElectionTypeRepository } from '@/repositories/voting/election-type.repository';
import { ElectionRepository } from '@/repositories/voting/election.repository';
import { CandidateRepository } from '@/repositories/voting/candidate.repository';
import { VoteRepository } from '@/src/repositories/voting/vote.repository';
import { UserRepository } from '@/src/repositories/user.repository';

import { DbService } from '@/services/db.service';
import { SeedService } from '@/services/seed.service';
import { SyncService } from '@/services/sync.service';
import { DefinitionService } from './services/definition.service';

import { GraphFirstLayerService } from '@/services/graph-first-layer.service';
import { GraphSecondLayerService } from '@/src/services/graph-second-layer.service';
import { GraphThirdLayerService } from './services/graph-third-layer.service';
import { TableService } from '@/services/table.service';
import { VotingService } from '@/services/voting.service';
import { LexiconService } from '@/services/lexicon.service';
import { MaterializerService } from '@/services/materializer.service';

export interface ISingletons {
  dbService: DbService;
  syncService: SyncService;
  seedService: SeedService;
  definitionService: DefinitionService;

  graphFirstLayerService: GraphFirstLayerService;
  graphSecondLayerService: GraphSecondLayerService;
  graphThirdLayerService: GraphThirdLayerService;
  tableService: TableService;
  votingService: VotingService;
  lexiconService: LexiconService;
  materializerService: MaterializerService;

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

  electionTypeRepo: ElectionTypeRepository;
  electionRepo: ElectionRepository;
  candidateRepo: CandidateRepository;
  voteRepo: VoteRepository;
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

  const electionRepo = new ElectionRepository(dbService, syncService);
  const electionTypeRepo = new ElectionTypeRepository(dbService, syncService);
  const candidateRepo = new CandidateRepository(dbService, syncService);
  const voteRepo = new VoteRepository(dbService, syncService);

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

  const graphFirstLayerService = new GraphFirstLayerService(
    nodeTypeRepo,
    nodeRepo,
    nodePropertyKeyRepo,
    nodePropertyValueRepo,
    relationshipTypeRepo,
    relationshipRepo,
    relationshipPropertyKeyRepo,
    relationshipPropertyValueRepo,
  );

  const graphSecondLayerService = new GraphSecondLayerService(
    graphFirstLayerService,
  );

  const graphThirdLayerService = new GraphThirdLayerService(
    graphFirstLayerService,
    graphSecondLayerService,
    nodeRepo,
    nodePropertyKeyRepo,
    nodePropertyValueRepo,
    relationshipRepo,
    syncService,
  );

  const tableService = new TableService(
    graphSecondLayerService,
    nodeRepo,
    nodePropertyValueRepo,
  );

  const votingService = new VotingService(
    electionRepo,
    candidateRepo,
    voteRepo,
  );

  const definitionService = new DefinitionService(
    graphFirstLayerService,
    graphSecondLayerService,
    graphThirdLayerService,
    votingService,
  );

  const lexiconService = new LexiconService(graphSecondLayerService, nodeRepo);

  const materializerService = new MaterializerService(
    graphFirstLayerService,
    graphSecondLayerService,
    graphThirdLayerService,
    tableService,
  );

  return {
    dbService,
    syncService,
    seedService,
    definitionService,

    graphFirstLayerService,
    graphSecondLayerService,
    graphThirdLayerService,
    tableService,
    votingService,
    lexiconService,
    materializerService,

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

    electionRepo,
    electionTypeRepo,
    candidateRepo,
    voteRepo,
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
