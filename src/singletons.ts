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
import { VoteRepository } from '@/repositories/voting/vote.repository';

import { UserRepository } from '@/repositories/user.repository';

import { SiteTextRepository } from '@/repositories/site-text/site-text.repository';
import { SiteTextTranslationRepository } from '@/repositories/site-text/site-text-translation.repository';

import { DbService } from '@/services/db.service';
import { SeedService } from '@/services/seed.service';
import { SyncService } from '@/services/sync.service';

import { GraphFirstLayerService } from '@/services/graph-first-layer.service';
import { GraphSecondLayerService } from '@/services/graph-second-layer.service';
import { GraphThirdLayerService } from './services/graph-third-layer.service';

import { VotingService } from '@/services/voting.service';

import { DefinitionService } from '@/services/definition.service';
import { SiteTextService } from '@/services/site-text.service';
import { TableService } from '@/services/table.service';
import { LexiconService } from '@/services/lexicon.service';
import { MaterializerService } from '@/services/materializer.service';

export interface ISingletons {
  dbService: DbService;
  syncService: SyncService;
  seedService: SeedService;

  graphFirstLayerService: GraphFirstLayerService;
  graphSecondLayerService: GraphSecondLayerService;
  graphThirdLayerService: GraphThirdLayerService;
  votingService: VotingService;
  tableService: TableService;
  definitionService: DefinitionService;
  siteTextService: SiteTextService;
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
  siteTextRepo: SiteTextRepository;
  siteTextTranslationRepo: SiteTextTranslationRepository;

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

  const siteTextRepo = new SiteTextRepository(dbService, syncService);
  const siteTextTranslationRepo = new SiteTextTranslationRepository(
    dbService,
    syncService,
  );

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

  const votingService = new VotingService(
    electionRepo,
    candidateRepo,
    voteRepo,
  );

  const tableService = new TableService(
    graphSecondLayerService,
    nodeRepo,
    nodePropertyValueRepo,
    votingService,
  );

  const definitionService = new DefinitionService(
    graphFirstLayerService,
    graphSecondLayerService,
    graphThirdLayerService,
    votingService,
  );

  const siteTextService = new SiteTextService(
    graphFirstLayerService,
    graphThirdLayerService,
    votingService,
    definitionService,
    siteTextRepo,
    siteTextTranslationRepo,
  );

  const lexiconService = new LexiconService(graphSecondLayerService, nodeRepo);

  const materializerService = new MaterializerService(tableService, dbService);

  return {
    dbService,
    syncService,
    seedService,

    graphFirstLayerService,
    graphSecondLayerService,
    graphThirdLayerService,
    votingService,
    tableService,
    definitionService,
    siteTextService,
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
    siteTextRepo,
    siteTextTranslationRepo,

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
