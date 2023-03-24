import { NodePropertyKeyRepository } from '@/repositories/node/node-property-key.repository';
import { NodePropertyValueRepository } from '@/repositories/node/node-property-value.repository';
import { NodeRepository } from '@/repositories/node/node.repository';
import { RelationshipPropertyKeyRepository } from '@/repositories/relationship/relationship-property-key.repository';
import { RelationshipPropertyValueRepository } from '@/repositories/relationship/relationship-property-value.repository';
import { RelationshipRepository } from '@/repositories/relationship/relationship.repository';
import { type DbService } from './db.service';
import { type Node } from '@/models/node/node.entity';
import { type Relationship } from '@/models/relationship/relationship.entity';
import { type SyncService } from './sync.service';
import { NodeTypeConst } from '../constants/node-type.constant';
import { MapDto } from '../dtos/map.dto';
import { LanguageDto } from '../dtos/lang.dto';

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
      console.error(err);
      throw new Error('Failed to create a new Node from object.');
    }
  }

  async createRelationshipFromObject(
    type_name: string,
    obj: object,
    from_node: string,
    to_node: string,
  ): Promise<string> {
    try {
      const relationship = await this.relationshipRepo.createRelationship(
        from_node,
        to_node,
        type_name,
      );

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
      console.error(err);
      throw new Error(`Failed to create new relationship '${type_name}'`);
    }
  }

  async createRelatedFromNodeFromObject(
    id: string,
    node_type_name: string,
    rel_type_name: string,
    obj: object,
  ): Promise<{
    relationship: Relationship | null;
    node: Node;
  }> {
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
  ): Promise<{
    relationship: Relationship | null;
    node: Node;
  }> {
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
      console.error(err);
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
      console.error(err);
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
      console.error(err);
      throw new Error(`Failed to create new table '${name}'`);
    }
  }

  async getTable(name: string): Promise<string | null> {
    try {
      const table = await this.nodeRepo.getNodeByProp('table', {
        key: 'name',
        value: name,
      });

      if (!table) {
        return null;
      }

      return table.id;
    } catch (err) {
      console.error(err);
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
      console.error(err);
      throw new Error(
        `Failed to create new table-column '${table} - ${column_name}'`,
      );
    }
  }

  async getColumn(table: string, column_name: string): Promise<string | null> {
    try {
      const column = await this.nodeRepo.repository.findOne({
        relations: [
          'propertyKeys',
          'propertyKeys.propertyValue',
          'nodeRelationships',
        ],
        where: {
          node_type: 'table-column',
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
      console.error(err);
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
      console.error(err);
      throw new Error(`Failed to create new table-row '${table}'`);
    }
  }

  // async getRow(table: string, finder: (table: string) => string): Promise<string | null> {

  // }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      console.error(err);
      throw new Error(`Failed to create new table-cell '${column} - ${row}'`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async readCell(column: string, row: string): Promise<any> {
    try {
      const cell = await this.nodeRepo.repository.findOne({
        relations: [
          'propertyKeys',
          'propertyKeys.propertyValue',
          'nodeRelationships',
        ],
        select: {
          propertyKeys: true,
        },
        where: {
          node_type: 'table-cell',
          nodeRelationships: [{ from_node_id: column }, { from_node_id: row }],
        },
      });

      if (!cell) {
        return null;
      }

      return JSON.parse(cell.propertyKeys[0].propertyValue.property_value)
        .value;
    } catch (err) {
      console.error(err);
      throw new Error(`Failed to read table-cell '${column} - ${row}'`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateCell(column: string, row: string, value: any): Promise<any> {
    try {
      const cell = await this.nodeRepo.repository.findOne({
        relations: [
          'propertyKeys',
          'propertyKeys.propertyValue',
          'nodeRelationships',
        ],
        select: {
          propertyKeys: true,
        },
        where: {
          node_type: 'table-cell',
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
      console.error(err);
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
      console.error(err);
      throw new Error('Failed to create a new document.');
    }
  }

  async getDocument(name: string): Promise<Document | null> {
    try {
      const document = await this.nodeRepo.getNodeByProp('document', {
        key: 'name',
        value: name,
      });

      if (document == null) {
        return null;
      }

      return {
        id: document.id,
        name,
      };
    } catch (err) {
      console.error(err);
      throw new Error('Failed to get document.');
    }
  }

  // --------- Word --------- //

  async createWord(word: string, langId: string): Promise<string> {
    try {
      const word_id = await this.getWord(word, langId);
      if (word_id) {
        return word_id;
      }

      const { node } = await this.createRelatedFromNodeFromObject(
        langId,
        'word',
        'word-to-language-entry',
        { name: word },
      );

      return node.id;
    } catch (err) {
      console.error(err);
      throw new Error(`Failed to create new word '${word} - ${langId}'`);
    }
  }

  async getWord(word: string, language: string): Promise<string | null> {
    try {
      const wordNode = await this.nodeRepo.repository.findOne({
        relations: [
          'propertyKeys',
          'propertyKeys.propertyValue',
          'nodeRelationships',
        ],
        where: {
          node_type: 'word',
          propertyKeys: {
            property_key: 'name',
            propertyValue: {
              property_value: JSON.stringify({ value: word }),
            },
          },
          nodeRelationships: {
            to_node_id: language,
          },
        },
      });

      if (!wordNode) {
        return null;
      }

      return wordNode.id;
    } catch (err) {
      console.error(err);
      throw new Error(`Failed to get word '${word} - ${language}'`);
    }
  }

  async getWords(): Promise<Node[]> {
    try {
      const wordNodes = await this.nodeRepo.repository.find({
        relations: [
          'propertyKeys',
          'propertyKeys.propertyValue',
          'nodeRelationships',
        ],
        where: {
          node_type: 'word',
        },
      });
      return wordNodes;
    } catch (err) {
      console.error(err);
      throw new Error(`Failed to get words`);
    }
  }

  // --------- Word-Translation --------- //

  async createWordTranslationRelationship(
    from: string,
    to: string,
  ): Promise<string> {
    try {
      const translation = await this.relationshipRepo.repository.findOne({
        where: {
          relationship_type: 'word-to-translation',
          from_node_id: from,
          to_node_id: to,
        },
      });

      if (translation) {
        return translation.id;
      }

      const new_translation_id = await this.createRelationshipFromObject(
        'word-to-translation',
        {},
        from,
        to,
      );
      return new_translation_id;
    } catch (err) {
      console.error(err);
      throw new Error(`Failed to create word-to-translation '${from} - ${to}'`);
    }
  }

  // --------- Word-Sequence --------- //

  async createWordSequence(
    text: string,
    document: string,
    creator: string,
    import_uid: string,
    language: string,
  ): Promise<Node> {
    try {
      const word_sequence = await this.createNodeFromObject('word-sequence', {
        'import-uid': import_uid,
      });

      const words = text.split(' ');
      for (const [i, word] of words.entries()) {
        const new_word_id = await this.createWord(word, language);
        await this.createRelationshipFromObject(
          'word-sequence-to-word',
          { position: i + 1 },
          word_sequence.id,
          new_word_id,
        );
      }
      await this.createRelationshipFromObject(
        'word-sequenece-to-language-entry',
        {},
        word_sequence.id,
        language,
      );
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
    } catch (err) {
      console.error(err);
      throw new Error(`Failed to create new word-sequence '${text}'`);
    }
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

    word_sequence.nodeRelationships.forEach((rel) => {
      if (rel.relationship_type === 'word-sequence-to-word') {
        words.push(
          JSON.parse(
            rel.toNode.propertyKeys.find((key) => key.property_key === 'word')
              ?.propertyValue.property_value ?? '',
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

  // --------- Word-Sequence-Translation --------- //

  async createWordSequenceTranslationRelationship(
    from: string,
    to: string,
  ): Promise<string> {
    try {
      const translation = await this.relationshipRepo.repository.findOne({
        where: {
          relationship_type: 'word-sequence-to-translation',
          from_node_id: from,
          to_node_id: to,
        },
      });

      if (translation) {
        return translation.id;
      }

      const new_translation_id = await this.createRelationshipFromObject(
        'word-sequence-to-translation',
        {},
        from,
        to,
      );
      return new_translation_id;
    } catch (err) {
      console.error(err);
      throw new Error(
        `Failed to create word-sequence-to-translation '${from} - ${to}'`,
      );
    }
  }

  //#region language node
  async createLanguage(language: string): Promise<string> {
    try {
      const lang_id = await this.getLanguage(language);
      if (lang_id) {
        return lang_id;
      }

      const node = await this.createNodeFromObject(NodeTypeConst.LANGUAGE, {
        name: language,
      });

      return node.id;
    } catch (err) {
      console.error(err);
      throw new Error(`Failed to create new language '${language}'`);
    }
  }
  async getLanguage(language: string): Promise<string | null> {
    try {
      const langNode = await this.nodeRepo.repository.findOne({
        relations: ['propertyKeys', 'propertyKeys.propertyValue'],
        where: {
          node_type: 'language',
          propertyKeys: {
            property_key: 'name',
            propertyValue: {
              property_value: JSON.stringify({ value: language }),
            },
          },
        },
      });

      if (!langNode) {
        return null;
      }

      return langNode.id;
    } catch (err) {
      console.error(err);
      throw new Error(`Failed to get language '${language}'`);
    }
  }
  async getLanguages(): Promise<LanguageDto[]> {
    try {
      const langNodes = await this.nodeRepo.repository.find({
        relations: ['propertyKeys', 'propertyKeys.propertyValue'],
        where: {
          node_type: 'language',
        },
      });
      const dtos: LanguageDto[] = [];
      for (const node of langNodes) {
        const strJson = node.propertyKeys.at(0)?.propertyValue?.property_value;
        if (strJson) {
          const valObj = JSON.parse(strJson);
          if (valObj.value) dtos.push({ id: node.id, name: valObj.value });
        }
      }
      return dtos;
    } catch (err) {
      console.error('failed to get language list::', err);
      return [];
    }
  }
  //#endregion

  //#region map node
  async saveMap(
    langId: string,
    mapInfo: {
      name: string;
      map: string;
      ext: string;
    },
  ): Promise<string | null> {
    try {
      const res = await this.createRelatedFromNodeFromObject(
        langId,
        NodeTypeConst.MAP,
        NodeTypeConst.MAP_LANG,
        mapInfo,
      );
      return res.node.id;
    } catch (error) {
      console.error('failed to save map::', error);
      return null;
    }
  }
  async getMaps(langId?: string) {
    try {
      const mapNodes = await this.nodeRepo.repository.find({
        relations: [
          'propertyKeys',
          'propertyKeys.propertyValue',
          'nodeRelationships',
        ],
        where: {
          node_type: NodeTypeConst.MAP,
          nodeRelationships: {
            relationship_type: NodeTypeConst.MAP_LANG,
            to_node_id: langId,
          },
        },
      });

      const dtos: MapDto[] = [];
      for (const mapNode of mapNodes) {
        const dto: MapDto = Object.create(null);
        dto.id = mapNode.id;
        for (const propertyKey of mapNode.propertyKeys) {
          dto[propertyKey.property_key] = JSON.parse(
            propertyKey.propertyValue?.property_value,
          ).value;
        }
        dto.langId = mapNode.nodeRelationships?.at(0)?.to_node_id as string;
        dtos.push(dto);
      }
      return dtos;
    } catch (error) {
      console.error('failed to get maps::', error);
      return [];
    }
  }
  //#endregion
}

interface Document {
  id?: string;
  name: string;
}
