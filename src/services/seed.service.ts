import { ObjectLiteral, EntityTarget } from 'typeorm';
import {
  Node,
  NodeType,
  NodePropertyKey,
  NodePropertyValue,
  Relationship,
  RelationshipType,
  RelationshipPropertyKey,
  RelationshipPropertyValue,
  ElectionType,
  Election,
  Candidate,
  Vote,
} from '@eten-lab/models';

import {
  NodeRepository,
  NodeTypeRepository,
  NodePropertyKeyRepository,
  NodePropertyValueRepository,
  RelationshipRepository,
  RelationshipTypeRepository,
  RelationshipPropertyKeyRepository,
  RelationshipPropertyValueRepository,
  DbService,
} from '@eten-lab/core';
import { LoggerService } from '@eten-lab/core';
import { TableNameConst } from '@eten-lab/models';

const DATA_SEEDED = 'DATA_SEEDED';

interface SyncTable {
  entity: unknown;
  tableName: string;
  pkColumn: string; // since we have long column name (i.e. user.user_id) and short entiti's property name (i.e. user.id)
  pkProperty: string; // we want to distinguish them  explicitly.
}

const syncTables: SyncTable[] = [
  {
    entity: Node,
    tableName: TableNameConst.NODES,
    pkColumn: 'node_id',
    pkProperty: 'id',
  },
  {
    entity: NodeType,
    tableName: TableNameConst.NODE_TYPES,
    pkColumn: 'type_name',
    pkProperty: 'type_name',
  },
  {
    entity: NodePropertyKey,
    tableName: TableNameConst.NODE_PROPERTY_KEYS,
    pkColumn: 'node_property_key_id',
    pkProperty: 'id',
  },
  {
    entity: NodePropertyValue,
    tableName: TableNameConst.NODE_PROPERTY_VALUES,
    pkColumn: 'node_property_value_id',
    pkProperty: 'id',
  },
  {
    entity: Relationship,
    tableName: TableNameConst.RELATIONSHIPS,
    pkColumn: 'relationship_id',
    pkProperty: 'id',
  },
  {
    entity: RelationshipType,
    tableName: TableNameConst.RELATIONSHIP_TYPES,
    pkColumn: 'type_name',
    pkProperty: 'type_name',
  },
  {
    entity: RelationshipPropertyKey,
    tableName: TableNameConst.RELATIONSHIP_PROPERTY_KEYS,
    pkColumn: 'relationship_property_key_id',
    pkProperty: 'id',
  },
  {
    entity: RelationshipPropertyValue,
    tableName: TableNameConst.RELATIONSHIP_PROPERTY_VALUES,
    pkColumn: 'relationship_property_value_id',
    pkProperty: 'id',
  },
  {
    entity: ElectionType,
    tableName: TableNameConst.ELECTION_TYPES,
    pkColumn: 'type_name',
    pkProperty: 'type_name',
  },
  {
    entity: Election,
    tableName: TableNameConst.ELECTIONS,
    pkColumn: 'election_id',
    pkProperty: 'id',
  },
  {
    entity: Candidate,
    tableName: TableNameConst.CANDIDATES,
    pkColumn: 'candidate_id',
    pkProperty: 'id',
  },
  {
    entity: Vote,
    tableName: TableNameConst.VOTES,
    pkColumn: 'vote_id',
    pkProperty: 'id',
  },
];

interface SyncEntry {
  table: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[];
}

const MOCK_CROWD_BIBLE_APP: SyncEntry[] = [
  {
    table: TableNameConst.NODE_TYPES,
    rows: [
      {
        type_name: 'mock-app',
        updated_at: '2023-06-29T01:48:58.289Z',
      },
    ],
  },
  {
    table: TableNameConst.NODES,
    rows: [
      {
        node_id: '2J5pMXVR04Xv6hMJxRS07',
        node_type: 'mock-app',
        updated_at: '2023-06-28T21:51:47.223Z',
      },
    ],
  },
  {
    table: TableNameConst.NODE_PROPERTY_KEYS,
    rows: [
      {
        node_property_key_id: 'fXs5JETBcv0JZ3COzVt79',
        property_key: 'name',
        node_id: '2J5pMXVR04Xv6hMJxRS07',
        updated_at: '2023-06-28T21:51:50.405Z',
      },
      {
        node_property_key_id: 'C87vtazx0MvXzyhA7UBoA',
        property_key: 'organizationName',
        node_id: '2J5pMXVR04Xv6hMJxRS07',
        updated_at: '2023-06-28T21:51:50.405Z',
      },
      {
        node_property_key_id: 'cm1a2uISlbdsgyCvHr7r6',
        property_key: 'language',
        node_id: '2J5pMXVR04Xv6hMJxRS07',
        updated_at: '2023-06-28T21:51:50.405Z',
      },
      {
        node_property_key_id: 'iHgN8RQKTsYkj4xTMHwbA',
        property_key: 'dialect',
        node_id: '2J5pMXVR04Xv6hMJxRS07',
        updated_at: '2023-06-28T21:51:50.405Z',
      },
      {
        node_property_key_id: 'REsxrEU0wD8zsDzsCCveW',
        property_key: 'region',
        node_id: '2J5pMXVR04Xv6hMJxRS07',
        updated_at: '2023-06-28T21:51:50.405Z',
      },
    ],
  },
  {
    table: TableNameConst.NODE_PROPERTY_VALUES,
    rows: [
      {
        node_property_value_id: 'sOnSXFqAxMEtHi4V4UUm-',
        property_value: '{"value":"crowd.Bible"}',
        node_property_key_id: 'fXs5JETBcv0JZ3COzVt79',
        updated_at: '2023-06-28T21:51:58.720Z',
      },
      {
        node_property_value_id: 'dj4gSGoT_rSpLewBddv7A',
        property_value: '{"value":"ETEN Lab"}',
        node_property_key_id: 'C87vtazx0MvXzyhA7UBoA',
        updated_at: '2023-06-28T21:51:58.720Z',
      },
      {
        node_property_value_id: 'KYAzy9p_HoBKHBUDBMMKt',
        property_value: '{"value":"en"}',
        node_property_key_id: 'cm1a2uISlbdsgyCvHr7r6',
        updated_at: '2023-06-28T21:51:58.720Z',
      },
      {
        node_property_value_id: 'CIXJQEiW30JgFUmz7pD2M',
        property_value: '{}',
        node_property_key_id: 'iHgN8RQKTsYkj4xTMHwbA',
        updated_at: '2023-06-28T21:51:58.720Z',
      },
      {
        node_property_value_id: 'XSZk1MY1elDiWKQONSlfE',
        property_value: '{}',
        node_property_key_id: 'REsxrEU0wD8zsDzsCCveW',
        updated_at: '2023-06-28T21:51:58.720Z',
      },
    ],
  },
];

export class SeedService {
  private get dataSeeded() {
    return localStorage.getItem(DATA_SEEDED) === 'true';
  }
  private set dataSeeded(val: boolean) {
    localStorage.setItem(DATA_SEEDED, val + '');
  }

  constructor(
    private readonly dbService: DbService,
    private readonly nodeRepository: NodeRepository,
    private readonly nodeTypeRepository: NodeTypeRepository,
    private readonly nodePropertyKeyRepository: NodePropertyKeyRepository,
    private readonly nodePropertyValueRepository: NodePropertyValueRepository,
    private readonly relationshipRepository: RelationshipRepository,
    private readonly relationshipTypeRepository: RelationshipTypeRepository,
    private readonly relationshipPropertyKeyRepository: RelationshipPropertyKeyRepository,
    private readonly relationshipPropertyValueRepository: RelationshipPropertyValueRepository,
    private readonly logger: LoggerService,
  ) {
    this.init();
  }

  async init() {
    try {
      await this.saveSyncEntries(MOCK_CROWD_BIBLE_APP);
      if (this.dataSeeded) return;
      this.logger.info('*** data seeding started ***');
      this.logger.info('*** data seeding completed ***');
      this.dataSeeded = true;
    } catch (error) {
      this.logger.error('seeding failed::', error);
    }
  }

  private async saveSyncEntries(entries: SyncEntry[]) {
    if (entries.length < 1) {
      this.logger.info('Nothing to sync in');
    } else {
      this.logger.info('Saving sync entries...');
    }

    for (const entry of entries) {
      const table = entry.table;
      const rows = entry.rows;

      const syncTable = syncTables.find((t) => t.tableName === table);

      if (syncTable == null) {
        throw new Error(`Unknown table ${table}`);
      }

      const { entity, pkColumn, pkProperty } = syncTable;

      for (const row of rows) {
        const pkValue = row[pkColumn];
        // eslint-disable-next-line @typescript-eslint/dot-notation

        delete row[pkColumn];

        const existing = await this.dbService.dataSource
          .getRepository(entity as EntityTarget<ObjectLiteral>)
          .find({
            where: {
              [pkProperty]: pkValue,
            },
          });

        if (existing.length) {
          this.dbService.dataSource
            .getRepository(entity as EntityTarget<ObjectLiteral>)
            .update(
              { [pkProperty]: pkValue },
              { ...row, [pkProperty]: pkValue },
            );
        } else {
          this.dbService.dataSource
            .getRepository(entity as EntityTarget<ObjectLiteral>)
            .insert({ ...row, [pkProperty]: pkValue });
        }
      }
    }

    this.logger.info('Sync entries saved');
  }

  async createNodesAndRelationship() {
    // random string of length 10
    const nodeType1 = await this.nodeTypeRepository.createNodeType(
      Math.random().toString(36).substring(2, 10),
    );
    const nodeType2 = await this.nodeTypeRepository.createNodeType(
      Math.random().toString(36).substring(2, 10),
    );
    const node1 = await this.nodeRepository.createNode(nodeType1);
    const node2 = await this.nodeRepository.createNode(nodeType2);

    const relationshipType =
      await this.relationshipTypeRepository.createRelationshipType(
        Math.random().toString(36).substring(2, 10),
      );

    const relationship = await this.relationshipRepository.createRelationship(
      node1.id,
      node2.id,
      relationshipType,
    );

    const nodePropKey =
      await this.nodePropertyKeyRepository.createNodePropertyKey(
        node1.id,
        Math.random().toString(36).substring(2, 10),
      );

    await this.nodePropertyValueRepository.setNodePropertyValue(
      nodePropKey,
      Math.random().toString(36).substring(2, 10),
    );

    const relationshipPropKey =
      await this.relationshipPropertyKeyRepository.createRelationshipPropertyKey(
        relationship!.id,
        Math.random().toString(36).substring(2, 10),
      );

    await this.relationshipPropertyValueRepository.setRelationshipPropertyValue(
      relationshipPropKey!,
      Math.random().toString(36).substring(2, 10),
    );
  }
}
