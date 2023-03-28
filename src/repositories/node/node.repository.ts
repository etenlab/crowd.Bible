import { FindOptionsWhere } from 'typeorm';

import { DbService } from '@/services/db.service';
import { SyncService } from '@/services/sync.service';
import { NodeType } from '@/models/index';
import { Node } from '@/models/node/node.entity';

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

  async readNode(node_id: Nanoid): Promise<Node | null> {
    const node = await this.repository.findOneBy({ id: node_id });

    return node;
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
      relationsArray.push('nodeRelationships');
      whereObj.nodeRelationships = {};

      if (relationship.relationship_type) {
        whereObj.nodeRelationships.relationship_type =
          relationship.relationship_type;
      }

      if (relationship.from_node_id) {
        whereObj.nodeRelationships.from_node_id = relationship.from_node_id;
      }

      if (relationship.to_node_id) {
        whereObj.nodeRelationships.to_node_id = relationship.to_node_id;
      }
    }

    const node = await this.repository.findOne({
      relations: relationsArray,
      where: whereObj,
    });

    return node;
  }

  async getNodesByProps(
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
          node.id
        from 
          node 
          inner join (
            select 
              pk.id, 
              pk.node_id, 
              count(pk.property_key) as property_keys
            from 
              node_property_key as pk 
              left join node_property_value as pv on pk.id = pv.node_property_key_id 
            where ${conditionStr}
            group by 
              pk.node_id 
            having 
              count(pk.property_key) = ${props.length}
          ) as npk on node.id = npk.node_id 
        where 
          node.node_type = '${type}';
      `;

    const nodes: [{ id: Nanoid }] = await this.repository.query(sqlStr);

    if (!nodes) {
      return [];
    }

    return nodes.map(({ id }) => id);
  }
}
