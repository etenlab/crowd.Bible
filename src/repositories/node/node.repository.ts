// import { Repository } from 'typeorm';
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
    if (nodeType == null) {
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

  async readNode(node_id: string): Promise<Node> {
    const node = await this.repository.findOneBy({ id: node_id });
    if (!node) {
      throw new Error(`Failed to find node: ${node_id}`);
    }
    return node;
  }

  async getNodeByProp(
    type: string,
    prop: { key: string; value: unknown },
  ): Promise<Node | null> {
    try {
      const node = await this.repository.findOne({
        relations: ['propertyKeys', 'propertyKeys.propertyValue'],
        where: {
          node_type: type,
          propertyKeys: {
            property_key: prop.key,
            propertyValue: {
              property_value: JSON.stringify({ value: prop.value }),
            },
          },
        },
      });
      return node;
    } catch (err) {
      console.error(err);
      throw new Error(
        `Failed to get node by prop '${type} - prop: { key: ${prop.key}, value: ${prop.value} }'`,
      );
    }
  }

  async getNodesByProps(
    type: string,
    props: { key: string; value: unknown }[],
  ): Promise<NanoidType[]> {
    try {
      const conditionStr = props
        .map(
          ({ key, value }) => `(
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

      const nodes: [{ id: NanoidType }] = await this.repository.query(sqlStr);

      if (!nodes) {
        return [];
      }

      return nodes.map(({ id }) => id);
    } catch (err) {
      throw new Error(`Failed to getNodesByProps`);
    }
  }
}
