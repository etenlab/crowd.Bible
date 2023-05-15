import { FindOptionsWhere, In } from 'typeorm';

import { DbService } from '@/services/db.service';
import { SyncService } from '@/services/sync.service';
import { NodeType } from '@/src/models';
import { Node } from '@/src/models';

import {
  PropertyKeyConst,
  RelationshipTypeConst,
} from '@/constants/graph.constant';

export class NodeRepository {
  constructor(
    private readonly dbService: DbService,
    private readonly syncService: SyncService,
  ) {}

  get repository() {
    return this.dbService.dataSource.getRepository(Node);
  }

  async createNode(type_name: string): Promise<Node> {
    let nodeType = await this.dbService.dataSource
      .getRepository(NodeType)
      .findOneBy({ type_name });

    if (nodeType === null) {
      nodeType = await this.dbService.dataSource
        .getRepository(NodeType)
        .save({ type_name });
    }

    const new_node = this.repository.create({
      nodeType,
      node_type: type_name,
      sync_layer: this.syncService.syncLayer,
    });
    const node = await this.repository.save(new_node);

    return node;
  }

  async listAllNodesByType(type_name: string): Promise<Node[]> {
    const nodes = await this.repository.find({
      relations: ['propertyKeys', 'propertyKeys.propertyValue'],
      select: {
        propertyKeys: {
          property_key: true,
          propertyValue: {
            property_value: true,
          },
        },
      },
      where: {
        node_type: type_name,
      },
    });
    return nodes;
  }

  async readNode(
    node_id: Nanoid,
    relations?: string[],
    whereObj?: FindOptionsWhere<Node>,
  ): Promise<Node | null> {
    if (relations) {
      if (whereObj) {
        return this.repository.findOne({
          relations,
          where: whereObj,
        });
      } else {
        return this.repository.findOne({
          relations,
          where: {
            id: node_id,
          },
        });
      }
    } else {
      return this.repository.findOne({
        where: {
          id: node_id,
        },
      });
    }
  }

  async findOne(
    relations: string[],
    whereObj: FindOptionsWhere<Node>,
  ): Promise<Node | null> {
    return this.repository.findOne({
      relations,
      where: whereObj,
    });
  }

  async find(
    relations: string[],
    whereObj: FindOptionsWhere<Node>,
  ): Promise<Node[]> {
    return this.repository.find({
      relations,
      where: whereObj,
    });
  }

  async getNodeByProp(
    type: string,
    prop: { key: string; value: unknown },
    relationship?: {
      relationship_type?: string;
      from_node_id?: Nanoid;
      to_node_id?: Nanoid;
    },
  ): Promise<Node | null> {
    const relationsArray = ['propertyKeys', 'propertyKeys.propertyValue'];
    const whereObj: FindOptionsWhere<Node> = {
      node_type: type,
      propertyKeys: {
        property_key: prop.key,
        propertyValue: {
          property_value: JSON.stringify({ value: prop.value }),
        },
      },
    };

    if (relationship) {
      if (relationship.from_node_id) {
        relationsArray.push('toNodeRelationships');
        whereObj.fromNodeRelationships = {};
        whereObj.fromNodeRelationships.from_node_id = relationship.from_node_id;
        if (relationship.relationship_type) {
          whereObj.fromNodeRelationships.relationship_type =
            relationship.relationship_type;
        }
      }

      if (relationship.to_node_id) {
        relationsArray.push('toNodeRelationships');
        whereObj.toNodeRelationships = {};
        whereObj.toNodeRelationships.to_node_id = relationship.to_node_id;
        if (relationship.relationship_type) {
          whereObj.toNodeRelationships.relationship_type =
            relationship.relationship_type;
        }
      }
    }

    const node = await this.repository.findOne({
      relations: relationsArray,
      where: whereObj,
    });

    return node;
  }

  async getNodesByPropAndRelTypes(
    nodeType: string,
    prop: { key: string; value: string }[],
    relationshipTypes: RelationshipTypeConst[],
  ): Promise<Node[] | null> {
    const relationsArray = [
      'propertyKeys',
      'propertyKeys.propertyValue',
      'toNodeRelationships',
      'toNodeRelationships.relationshipType',
      'fromNodeRelationships',
      'fromNodeRelationships.relationshipType',
    ];

    const propertyKeyValueArray = prop.map(({ key, value }) => ({
      property_key: key,
      propertyValue: {
        property_value: JSON.stringify({ value }),
      },
    }));

    const nodes = await this.repository.find({
      relations: relationsArray,
      where: [
        {
          node_type: nodeType,
          propertyKeys: propertyKeyValueArray,
          toNodeRelationships: {
            relationshipType: In(relationshipTypes),
          },
        },
        {
          node_type: nodeType,
          propertyKeys: propertyKeyValueArray,
          fromNodeRelationships: {
            relationshipType: In(relationshipTypes),
          },
        },
      ],
    });

    return nodes;
  }

  async getNodeIdsByProps(
    type: string,
    props: { key: string; value: unknown }[],
  ): Promise<Nanoid[]> {
    const conditionStr = props
      .map(
        ({ key, value }) =>
          `(
              pk.property_key = '${key}' 
              and pv.property_value = '${JSON.stringify({
                value: value,
              })}'
            )`,
      )
      .join(' or ');

    const sqlStr = `
        select 
          nodes.node_id
        from 
          nodes 
          inner join (
            select 
              pk.node_property_key_id, 
              pk.node_id, 
              count(pk.property_key) as property_keys
            from 
              node_property_keys as pk 
              left join node_property_values as pv on pk.node_property_key_id = pv.node_property_key_id 
            where ${conditionStr}
            group by 
              pk.node_id 
            having 
              count(pk.property_key) = ${props.length}
          ) as npk on nodes.node_id = npk.node_id 
        where 
          nodes.node_type = '${type}';
      `;

    const nodes: [{ node_id: Nanoid }] = await this.repository.query(sqlStr);

    if (!nodes) {
      return [];
    }

    return nodes.map(({ node_id }) => node_id);
  }

  async getNodesByIds(ids: Array<string>): Promise<Node[]> {
    return this.repository.find({
      where: { id: In(ids) },
      relations: ['propertyKeys', 'propertyKeys.propertyValue'],
      select: {
        propertyKeys: {
          property_key: true,
          propertyValue: {
            property_value: true,
          },
        },
      },
    });
  }

  async getNodePropertyValue(
    nodeId: Nanoid,
    propertyName: PropertyKeyConst,
  ): Promise<unknown> {
    const nodeEntity = await this.readNode(nodeId, [
      'propertyKeys',
      'propertyKeys.propertyValue',
    ]);

    if (!nodeEntity) {
      return null;
    }

    if (
      !nodeEntity.propertyKeys?.length ||
      nodeEntity.propertyKeys?.length < 1
    ) {
      return null;
    }

    const propertyIdx = nodeEntity.propertyKeys.findIndex(
      (pk) => pk.property_key === propertyName,
    );

    const resJson =
      nodeEntity.propertyKeys[propertyIdx].propertyValue.property_value;
    const res = JSON.parse(resJson).value;

    return res;
  }
}
