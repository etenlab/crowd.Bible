import { DataSource } from 'typeorm';
import { SqljsDriver } from 'typeorm/driver/sqljs/SqljsDriver';

import {
  NodeRepository,
  NodeTypeRepository,
  NodePropertyKeyRepository,
  NodePropertyValueRepository,
  RelationshipRepository,
  RelationshipTypeRepository,
  RelationshipPropertyKeyRepository,
  RelationshipPropertyValueRepository,
  SyncSessionRepository,
  ElectionRepository,
  ElectionTypeRepository,
  CandidateRepository,
  VoteRepository,
  UserRepository,
} from '@eten-lab/core';

import {
  DbService,
  SyncService,
  GraphFirstLayerService,
  GraphSecondLayerService,
  VotingService,
  TableService,
  MaterializerService,
  LoggerService,
} from '@eten-lab/core';

import { SeedService } from '@/services/seed.service';

import { DefinitionService } from '@/services/definition.service';
import { SiteTextService } from '@/services/site-text.service';
import { LexiconService } from '@/services/lexicon.service';
import { TranslationService } from '@/services/translation.service';
import { UserService } from '@/services/user.service';
import { DocumentService } from '@/services/document.service';
import { WordService } from '@/services/word.service';
import { WordSequenceService } from '@/services/word-sequence.service';
import { MapService } from '@/services/map.service';
import { VotableItemsService } from './services/votable-items.service';

export interface ISingletons {
  driver: SqljsDriver;

  loggerService: LoggerService;
  dbService: DbService;
  syncService: SyncService;
  seedService: SeedService;

  graphFirstLayerService: GraphFirstLayerService;
  graphSecondLayerService: GraphSecondLayerService;

  votingService: VotingService;
  tableService: TableService;
  votableItemsService: VotableItemsService;
  definitionService: DefinitionService;
  siteTextService: SiteTextService;
  lexiconService: LexiconService;
  materializerService: MaterializerService;
  translationService: TranslationService;
  userService: UserService;
  documentService: DocumentService;
  wordService: WordService;
  wordSequenceService: WordSequenceService;
  mapService: MapService;

  nodeRepo: NodeRepository;
  nodeTypeRepo: NodeTypeRepository;
  nodePropertyKeyRepo: NodePropertyKeyRepository;
  nodePropertyValueRepo: NodePropertyValueRepository;
  relationshipRepo: RelationshipRepository;
  relationshipTypeRepo: RelationshipTypeRepository;
  relationshipPropertyKeyRepo: RelationshipPropertyKeyRepository;
  relationshipPropertyValueRepo: RelationshipPropertyValueRepository;
  userRepo: UserRepository;

  electionTypeRepo: ElectionTypeRepository;
  electionRepo: ElectionRepository;
  candidateRepo: CandidateRepository;
  voteRepo: VoteRepository;
}

const _cache = new Map<DataSource, Promise<ISingletons>>();
const initialize = async (dataSource: DataSource): Promise<ISingletons> => {
  const loggerService = new LoggerService();
  const ds = await dataSource.initialize();

  const driver = ds.driver as SqljsDriver;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbService = new DbService(ds as any);

  const syncSessionRepository = new SyncSessionRepository(dbService);

  const syncService = new SyncService(
    dbService,
    syncSessionRepository,
    loggerService,
  );

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

  const userRepo = new UserRepository(dbService);

  const electionRepo = new ElectionRepository(dbService, syncService);
  const electionTypeRepo = new ElectionTypeRepository(dbService, syncService);
  const candidateRepo = new CandidateRepository(dbService, syncService);
  const voteRepo = new VoteRepository(dbService, syncService);

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

  const userService = new UserService(
    graphFirstLayerService,
    graphSecondLayerService,
  );

  const documentService = new DocumentService(
    graphFirstLayerService,
    graphSecondLayerService,
  );

  const wordService = new WordService(
    graphFirstLayerService,
    graphSecondLayerService,
    nodeRepo,
  );

  const wordSequenceService = new WordSequenceService(
    graphFirstLayerService,
    graphSecondLayerService,
    wordService,
  );

  const mapService = new MapService(
    graphFirstLayerService,
    graphSecondLayerService,
    wordService,
    loggerService,
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
    loggerService,
  );

  const votableItemsService = new VotableItemsService(
    graphFirstLayerService,
    votingService,
  );

  const definitionService = new DefinitionService(
    graphFirstLayerService,
    graphSecondLayerService,
    votingService,
    wordService,
    votableItemsService,
  );

  const translationService = new TranslationService(
    graphFirstLayerService,
    graphSecondLayerService,
    wordService,
    wordSequenceService,
    votingService,
  );

  const siteTextService = new SiteTextService(
    graphFirstLayerService,
    graphSecondLayerService,
    votingService,
    definitionService,
    translationService,
    wordService,
    votableItemsService,
  );

  const seedService = new SeedService(
    dbService,
    nodeRepo,
    nodeTypeRepo,
    nodePropertyKeyRepo,
    nodePropertyValueRepo,
    relationshipRepo,
    relationshipTypeRepo,
    relationshipPropertyKeyRepo,
    relationshipPropertyValueRepo,
    loggerService,
  );

  const lexiconService = new LexiconService(graphSecondLayerService, nodeRepo);

  const materializerService = new MaterializerService(tableService, dbService);

  return {
    driver,
    loggerService,
    dbService,
    syncService,
    seedService,

    graphFirstLayerService,
    graphSecondLayerService,
    votingService,
    tableService,
    votableItemsService,
    definitionService,
    siteTextService,
    lexiconService,
    materializerService,
    translationService,
    userService,
    documentService,
    wordService,
    wordSequenceService,
    mapService,

    nodeRepo,
    nodeTypeRepo,
    nodePropertyKeyRepo,
    nodePropertyValueRepo,
    relationshipRepo,
    relationshipTypeRepo,
    relationshipPropertyKeyRepo,
    relationshipPropertyValueRepo,
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
