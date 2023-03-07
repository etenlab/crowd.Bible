import { NodePropertyKeyRepository } from '../repositories/node/node-property-key.repository';
import { NodePropertyValueRepository } from '../repositories/node/node-property-value.repository';
import { NodeRepository } from '../repositories/node/node.repository';
import { RelationshipPropertyKeyRepository } from '../repositories/relationship/relationship-property-key.repository';
import { RelationshipPropertyValueRepository } from '../repositories/relationship/relationship-property-value.repository';
import { RelationshipRepository } from '../repositories/relationship/relationship.repository';
import { DbService } from './db.service';
import { Node } from '../models/node/node.entity';
import { Relationship } from '../models/relationship/relationship.entity';
import { tableNodeToTable } from '../utils/table';
import { SyncService } from './sync.service';

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
  async createNodeFromObject(type_name: string, obj: Object): Promise<Node> {
    const node = await this.nodeRepo.createNode(type_name);
    Object.entries(obj).forEach(async ([key, value]) => {
      const property_key_id =
        await this.nodePropertyKeyRepo.createNodePropertyKey(node.id, key);
      if (property_key_id) {
        await this.nodePropertyValueRepo.createNodePropertyValue(
          property_key_id,
          value,
        );
      }
    });

    return node;
  }

  async createRelationshipFromObject(
    type_name: string,
    obj: Object,
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
      if (!relationship) {
        return null;
      }

      Object.entries(obj).forEach(async ([key, value]) => {
        const property_key_uuid =
          await this.relationshipPropertyKeyRepo.createRelationshipPropertyKey(
            relationship.id,
            key,
          );
        if (property_key_uuid) {
          await this.relationshipPropertyValueRepo.createRelationshipPropertyValue(
            property_key_uuid,
            value,
          );
        }
      });

      return relationship.id;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async createRelatedFromNodeToObject(
    id: string,
    node_type_name: string,
    rel_type_name: string,
    obj: {},
  ) {
    const to_node = await this.nodeRepo.readNode(id);
    if (!to_node) {
      return null;
    }

    const from_node = await this.createNodeFromObject(node_type_name, obj);
    const relationship = await this.relationshipRepo.createRelationship(
      from_node.id,
      id,
      rel_type_name,
    );

    return {
      relationship: relationship,
      node: from_node,
    };
  }

  async createRelatedToNodeFromObject(
    id: string,
    node_type_name: string,
    rel_type_name: string,
    obj: {},
  ) {
    const from_node = await this.nodeRepo.readNode(id);
    if (!from_node) {
      return null;
    }

    const to_node = await this.createNodeFromObject(node_type_name, obj);
    const relationship = await this.relationshipRepo.createRelationship(
      id,
      to_node.id,
      rel_type_name,
    );

    return {
      relationship: relationship,
      node: to_node,
    };
  }

  async upsertNodeObject(id: string, obj: Object): Promise<Node | null> {
    try {
      const node = await this.nodeRepo.readNode(id);
      if (!node) {
        return null;
      }

      Object.entries(obj).forEach(async ([key, value]) => {
        const property_key_uuid =
          await this.nodePropertyKeyRepo.createNodePropertyKey(node.id, key);
        if (property_key_uuid) {
          await this.nodePropertyValueRepo.createNodePropertyValue(
            property_key_uuid,
            value,
          );
        }
      });

      return node;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async upsertRelationshipObject(
    rel_id: string,
    obj: Object,
  ): Promise<Relationship | null> {
    try {
      const rel = await this.relationshipRepo.readRelationship(rel_id);
      if (!rel) {
        return null;
      }
      Object.entries(obj).forEach(async ([key, value]) => {
        const property_key_uuid =
          await this.relationshipPropertyKeyRepo.createRelationshipPropertyKey(
            rel.id,
            key,
          );
        if (property_key_uuid) {
          await this.relationshipPropertyValueRepo.createRelationshipPropertyValue(
            property_key_uuid,
            value,
          );
        }
      });

      return rel;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  // Layer 3

  // -------- Table --------- //

  async createTable(name: string): Promise<Table> {
    try {
      const table = await this.createNodeFromObject("table", {
        name,
      });

      return tableNodeToTable(table);
    } catch (err) {
      console.log(err);
      throw new Error("Failed to create a new table.");
    }
  }

  async getTable(name: string): Promise<Table | null> {
    try {
      const table: Node | null = await this.nodeRepo.repository.findOne({
        relations: [
          'nodeType',
          'property_keys',
          'property_keys.property_value',
          'node_relationships',
          'node_relationships.toNode',
          'node_relationships.toNode.property_keys',
          'node_relationships.toNode.property_keys.property_value',
        ],
        select: {
          node_relationships: true,
        },
        where: {
          nodeType: {
            type_name: 'table',
          },
          property_keys: {
            property_key: 'name',
            property_value: {
              property_value: name,
            },
          },
        },
      });
      if (!table) {
        return null;
      }
      return tableNodeToTable(table);
    } catch (err) {
      console.log(err);
      throw new Error("Failed to get table.");
    }
  }

  async addTableData(
    table_name: string,
    column_name: string,
    row_id: string,
    cell_data: any
  ): Promise<TableCell> {
    try {
      const table = await this.getTable(table_name);
      const table_cell = await this.createNodeFromObject('table-cell', {
        column: column_name,
        row: row_id,
        data: cell_data,
      });

      await this.createRelationshipFromObject(
        'table-to-table-cell',
        {},
        table?.id,
        table_cell.id,
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const new_cell: TableCell = {};
      table_cell?.property_keys.forEach((key) => {
        (new_cell as any)[key.property_key] = key.property_value.property_value;
      });

      return new_cell;
    } catch (err) {
      console.log(err);
      throw new Error("Failed to add table data.");
    }
  }

  // -------- Document --------- //

  async createDocument(name: string): Promise<Document> {
    try {
      const document = await this.createNodeFromObject("document", {
        name,
      });

      return {
        id: document.id,
        name: name,
      };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to create a new document.");
    }
  }

  async getDocument(name: string): Promise<Document | null> {
    try {
      const document = await this.nodeRepo.getNodeByProp("document", {
        key: "name",
        val: name,
      });

      if (!document) {
        return null;
      }

      return {
        id: document.id,
        name: name,
      };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to get document.");
    }
  }

  // -------- Document --------- //

  async createWord(name: string): Promise<Word> {
    try {
      const word = await this.createNodeFromObject("word", {
        name,
      });

      return {
        id: word.id,
        name: name,
      };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to create a new word.");
    }
  }

  async getWord(name: string): Promise<Word | null> {
    try {
      const word = await this.nodeRepo.getNodeByProp("word", {
        key: "name",
        val: name,
      });

      if (!word) {
        return null;
      }

      return {
        id: word.id,
        name: name,
      };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to get word.");
    }
  }
}

interface Document {
  id?: string;
  name: string;
}
