// import { Repository } from 'typeorm';
import { NodeType } from '../../models';
import { Node } from '../../models/node/node.entity';
import { type DbService } from '../../services/db.service';
import { type SyncService } from '../../services/sync.service';

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
      relations: ['nodeType', 'propertyKeys', 'propertyKeys.propertyValue'],
      select: {
        propertyKeys: {
          property_key: true,
          propertyValue: {
            property_value: true,
          },
        },
      },
      where: {
        nodeType: {
          type_name,
        },
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prop: { key: string; val: any },
  ): Promise<Node | null> {
    const node = await this.repository.findOne({
      relations: ['nodeType', 'propertyKeys', 'propertyKeys.propertyValue'],
      where: {
        nodeType: {
          type_name: type,
        },
        propertyKeys: {
          property_key: prop.key,
          propertyValue: {
            property_value: prop.val,
          },
        },
      },
    });
    return node;
  }
}
