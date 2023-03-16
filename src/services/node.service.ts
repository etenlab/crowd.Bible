import { NodePropertyKeyRepository } from '../repositories/node/node-property-key.repository';
import { NodePropertyValueRepository } from '../repositories/node/node-property-value.repository';
import { NodeRepository } from '../repositories/node/node.repository';
import { RelationshipPropertyKeyRepository } from '../repositories/relationship/relationship-property-key.repository';
import { RelationshipPropertyValueRepository } from '../repositories/relationship/relationship-property-value.repository';
import { RelationshipRepository } from '../repositories/relationship/relationship.repository';
import { type DbService } from './db.service';
import { type Node } from '../models/node/node.entity';
import { type Relationship } from '../models/relationship/relationship.entity';
import { tableNodeToTable } from '../utils/table';
import { type SyncService } from './sync.service';

export class NodeService {
  nodeRepo!: NodeRepository;
  nodePropertyKeyRepo!: NodePropertyKeyRepository;
  nodePropertyValueRepo!: NodePropertyValueRepository;

  relationshipRepo!: RelationshipRepository;
  relationshipPropertyKeyRepo!: RelationshipPropertyKeyRepository;
  relationshipPropertyValueRepo!: RelationshipPropertyValueRepository;

  constructor(dbService: DbService, syncService: SyncService) {
    this.nodeRepo = new NodeRepository(dbService, syncService);
    this.nodePropertyKeyRepo = new NodePropertyKeyRepository(
      dbService,
      syncService,
    );
    this.nodePropertyValueRepo = new NodePropertyValueRepository(
      dbService,
      syncService,
    );
    this.relationshipRepo = new RelationshipRepository(dbService, syncService);
    this.relationshipPropertyKeyRepo = new RelationshipPropertyKeyRepository(
      dbService,
      syncService,
    );
    this.relationshipPropertyValueRepo =
      new RelationshipPropertyValueRepository(dbService, syncService);
  }

  // Layer 2
  async createNodeFromObject(type_name: string, obj: object): Promise<Node> {
    try {
      const node = await this.nodeRepo.createNode(type_name);
      for (const [key, value] of Object.entries(obj)) {
        const property_key_id =
          await this.nodePropertyKeyRepo.createNodePropertyKey(node.id, key);
        if (property_key_id) {
          await this.nodePropertyValueRepo.createNodePropertyValue(
            property_key_id,
            value,
          );
        }
      }

      return node;
    } catch (err) {
      console.log(err);
      throw new Error('Failed to create a new Node from object.');
    }
  }

  async createRelationshipFromObject(
    type_name: string,
    obj: object,
    from_node: string | undefined,
    to_node: string | undefined,
  ): Promise<string | null> {
    if (from_node === undefined || to_node === undefined) {
      return null;
    }
    try {
      const relationship = await this.relationshipRepo.createRelationship(
        from_node,
        to_node,
        type_name,
      );
      if (relationship == null) {
        return null;
      }

      for (const [key, value] of Object.entries(obj)) {
        const property_key_id =
          await this.relationshipPropertyKeyRepo.createRelationshipPropertyKey(
            relationship.id,
            key,
          );
        if (property_key_id) {
          await this.relationshipPropertyValueRepo.createRelationshipPropertyValue(
            property_key_id,
            value,
          );
        }
      }

      return relationship.id;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async createRelatedFromNodeFromObject(
    id: string,
    node_type_name: string,
    rel_type_name: string,
    obj: object,
  ) {
    const to_node = await this.nodeRepo.readNode(id);
    if (to_node == null) {
      return null;
    }

    const from_node = await this.createNodeFromObject(node_type_name, obj);
    const relationship = await this.relationshipRepo.createRelationship(
      from_node.id,
      id,
      rel_type_name,
    );

    return {
      relationship,
      node: from_node,
    };
  }

  async createRelatedToNodeFromObject(
    id: string,
    node_type_name: string,
    rel_type_name: string,
    obj: object,
  ) {
    const to_node = await this.createNodeFromObject(node_type_name, obj);
    const relationship = await this.relationshipRepo.createRelationship(
      id,
      to_node.id,
      rel_type_name,
    );

    return {
      relationship,
      node: to_node,
    };
  }

  async upsertNodeObject(id: string, obj: object): Promise<Node | null> {
    try {
      const node = await this.nodeRepo.readNode(id);

      for (const [key, value] of Object.entries(obj)) {
        const property_key_id =
          await this.nodePropertyKeyRepo.createNodePropertyKey(node.id, key);
        if (property_key_id) {
          await this.nodePropertyValueRepo.createNodePropertyValue(
            property_key_id,
            value,
          );
        }
      }

      return node;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async upsertRelationshipObject(
    rel_id: string,
    obj: object,
  ): Promise<Relationship | null> {
    try {
      const rel = await this.relationshipRepo.readRelationship(rel_id);
      if (rel == null) {
        return null;
      }
      for (const [key, value] of Object.entries(obj)) {
        const property_key_id =
          await this.relationshipPropertyKeyRepo.createRelationshipPropertyKey(
            rel.id,
            key,
          );
        if (property_key_id) {
          await this.relationshipPropertyValueRepo.createRelationshipPropertyValue(
            property_key_id,
            value,
          );
        }
      }

      return rel;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  // Layer 3

  // --------- Table --------- //

  async createTable(name: string): Promise<string> {
    try {
      const table_id = await this.getTable(name);
      if (table_id) {
        return table_id;
      }

      const new_table = await this.createNodeFromObject('table', {
        name,
      });

      return new_table.id;
    } catch (err) {
      console.log(err);
      throw new Error(`Failed to create new table '${name}'`);
    }
  }

  async getTable(name: string): Promise<string | null> {
    try {
      const table: Node | null = await this.nodeRepo.repository.findOne({
        relations: ['nodeType', 'propertyKeys', 'propertyKeys.propertyValue'],
        where: {
          nodeType: {
            type_name: 'table',
          },
          propertyKeys: {
            property_key: 'name',
            propertyValue: {
              property_value: JSON.stringify({ value: name }),
            },
          },
        },
      });

      if (!table) {
        return null;
      }

      return table.id;
    } catch (err) {
      console.log(err);
      throw new Error(`Failed to get table '${name}'`);
    }
  }

  async createColumn(table: string, column_name: string): Promise<string> {
    try {
      const column_id = await this.getColumn(table, column_name);
      if (column_id) {
        return column_id;
      }

      const { node } = await this.createRelatedToNodeFromObject(
        table,
        'table-column',
        'table-to-column',
        { name: column_name },
      );

      return node.id;
    } catch (err) {
      console.log(err);
      throw new Error(
        `Failed to create new table-column '${table} - ${column_name}'`,
      );
    }
  }

  async getColumn(table: string, column_name: string): Promise<string | null> {
    try {
      const column = await this.nodeRepo.repository.findOne({
        relations: [
          'nodeType',
          'propertyKeys',
          'propertyKeys.propertyValue',
          'nodeRelationships',
        ],
        where: {
          nodeType: {
            type_name: 'table-column',
          },
          propertyKeys: {
            property_key: 'name',
            propertyValue: {
              property_value: JSON.stringify({ value: column_name }),
            },
          },
          nodeRelationships: {
            from_node_id: table,
          },
        },
      });

      if (!column) {
        return null;
      }

      return column.id;
    } catch (err) {
      console.log(err);
      throw new Error(`Failed to get table-column '${table} - ${column_name}'`);
    }
  }

  async createRow(table: string): Promise<string> {
    try {
      const { node } = await this.createRelatedToNodeFromObject(
        table,
        'table-row',
        'table-to-row',
        {},
      );
      return node.id;
    } catch (err) {
      console.log(err);
      throw new Error(`Failed to create new table-row '${table}'`);
    }
  }

  // async getRow(table: string, finder: (table: string) => string): Promise<string | null> {

  // }

  async createCell(column: string, row: string, value: any): Promise<string> {
    try {
      const cell = await this.createNodeFromObject('table-cell', {
        data: value,
      });

      await this.createRelationshipFromObject(
        'table-column-to-cell',
        {},
        column,
        cell.id,
      );
      await this.createRelationshipFromObject(
        'table-row-to-cell',
        {},
        row,
        cell.id,
      );

      return cell.id;
    } catch (err) {
      console.log(err);
      throw new Error(`Failed to create new table-cell '${column} - ${row}'`);
    }
  }

  async readCell(column: string, row: string): Promise<any> {
    try {
      const cell = await this.nodeRepo.repository.findOne({
        relations: [
          'nodeType',
          'propertyKeys',
          'propertyKeys.propertyValue',
          'nodeRelationships',
          'nodeRelationships.fromNode',
        ],
        select: {
          propertyKeys: true,
        },
        where: {
          nodeType: {
            type_name: 'table-cell',
          },
          nodeRelationships: [{ from_node_id: column }, { from_node_id: row }],
        },
      });

      if (!cell) {
        return null;
      }

      return JSON.parse(cell.propertyKeys[0].propertyValue.property_value)
        .value;
    } catch (err) {
      console.log(err);
      throw new Error(`Failed to read table-cell '${column} - ${row}'`);
    }
  }

  async updateCell(column: string, row: string, value: any): Promise<any> {
    try {
      const cell = await this.nodeRepo.repository.findOne({
        relations: [
          'nodeType',
          'propertyKeys',
          'propertyKeys.propertyValue',
          'nodeRelationships',
          'nodeRelationships.fromNode',
        ],
        select: {
          propertyKeys: true,
        },
        where: {
          nodeType: {
            type_name: 'table-cell',
          },
          nodeRelationships: [{ from_node_id: column }, { from_node_id: row }],
        },
      });

      if (!cell) {
        return null;
      }
      cell.propertyKeys[0].propertyValue;

      const updated_cell = await this.nodePropertyValueRepo.repository.save({
        ...cell.propertyKeys[0].propertyValue,
        property_value: JSON.stringify(value),
      });

      return updated_cell.id;
    } catch (err) {
      console.log(err);
      throw new Error(`Failed to update table-cell '${column} - ${row}'`);
    }
  }

  // -------- Document --------- //

  async createDocument(name: string): Promise<Document> {
    try {
      const document = await this.createNodeFromObject('document', {
        name,
      });

      return {
        id: document.id,
        name,
      };
    } catch (err) {
      console.log(err);
      throw new Error('Failed to create a new document.');
    }
  }

  async getDocument(name: string): Promise<Document | null> {
    try {
      const document = await this.nodeRepo.getNodeByProp('document', {
        key: 'name',
        val: name,
      });

      if (document == null) {
        return null;
      }

      return {
        id: document.id,
        name,
      };
    } catch (err) {
      console.log(err);
      throw new Error('Failed to get document.');
    }
  }

  // --------- Word --------- //

  async createWord(name: string): Promise<Word | null> {
    try {
      if ((await this.getWord(name)) != null) {
        console.log('conflict: ', name);
        return null;
      }
      console.log('no conflict: ', name);
      const word = await this.createNodeFromObject('word', {
        name: {
          value: name,
        },
      });

      return {
        id: word.id,
        name,
      };
    } catch (err) {
      console.log(err);
      throw new Error('Failed to create a new word.');
    }
  }

  async getWord(name: string): Promise<Word | null> {
    try {
      const word = await this.nodeRepo.getNodeByProp('word', {
        key: 'name',
        val: {
          value: name,
        },
      });

      if (word == null) {
        return null;
      }

      return {
        id: word.id,
        name,
      };
    } catch (err) {
      console.log(err);
      throw new Error('Failed to get word.');
    }
  }

  // --------- Word-Sequence --------- //

  async createWordSequence(
    text: string,
    document: string,
    creator: string,
    import_uid: string,
  ): Promise<Node> {
    const word_sequence = await this.createNodeFromObject('word-sequence', {
      'import-uid': import_uid,
    });

    const words = text.split(' ');
    for (const [i, word] of words.entries()) {
      const new_word = await this.createWord(word);
      await this.createRelationshipFromObject(
        'word-sequence-to-word',
        { position: i + 1 },
        word_sequence.id,
        new_word?.id,
      );
    }

    await this.createRelationshipFromObject(
      'word-sequence-to-document',
      {},
      word_sequence.id,
      document,
    );
    await this.createRelationshipFromObject(
      'word-sequence-to-creator',
      {},
      word_sequence.id,
      creator,
    );

    return word_sequence;
  }

  async getText(word_sequence_id: string): Promise<string | null> {
    const word_sequence = await this.nodeRepo.repository.findOne({
      relations: [
        'nodeRelationships',
        'nodeRelationships.toNode',
        'nodeRelationships.toNode.propertyKeys',
        'nodeRelationships.toNode.propertyKeys.propertyValue',
      ],
      where: {
        node_id: word_sequence_id,
      },
    });

    if (word_sequence == null || word_sequence.nodeRelationships == null) {
      return null;
    }

    const words: string[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    word_sequence.nodeRelationships.forEach((rel: any) => {
      if (rel.relationship_type === 'word-sequence-to-word') {
        words.push(
          JSON.parse(
            rel.toNode.propertyKeys.find(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (key: any) => key.property_key === 'word',
            )?.propertyValue.property_value,
          ).value,
        );
      }
    });

    return words.join(' ');
  }

  // --------- Word-Sequence-Connection --------- //

  async appendWordSequence(from: string, to: string): Promise<string | null> {
    const word_sequence_connection = await this.createRelationshipFromObject(
      'word-sequence-to-word-sequence',
      {},
      from,
      to,
    );

    return word_sequence_connection;
  }

  async getWordSequence(text: string): Promise<string[]> {
    const word_sequences = await this.nodeRepo.listAllNodesByType(
      'word-sequence',
    );
    const filtered_word_sequences = await Promise.all(
      word_sequences.filter(async (word_sequence) => {
        const word_sequence_text = await this.getText(word_sequence.id);
        return word_sequence_text === text;
      }),
    );

    return filtered_word_sequences.map((sequence) => sequence.id);
  }
}

interface Document {
  id?: string;
  name: string;
}
