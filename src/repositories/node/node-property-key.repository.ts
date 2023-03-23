// import { Repository } from 'typeorm';
import { Node } from '@/models/index';
import { NodePropertyKey } from '@/models/node/node-property-key.entity';
import { type DbService } from '@/services/db.service';
import { type SyncService } from '@/services/sync.service';

export class NodePropertyKeyRepository {
  constructor(
    private readonly dbService: DbService,
    private readonly syncService: SyncService,
  ) {}

  private get repository() {
    return this.dbService.dataSource.getRepository(NodePropertyKey);
  }

  async createNodePropertyKey(
    node_id: string,
    key_name: string,
  ): Promise<string | null> {
    const propertyKey = await this.repository
      .createQueryBuilder('nodePropertyKey')
      .where('nodePropertyKey.id = :node_id', { node_id })
      .andWhere('nodePropertyKey.property_key = :key_name', { key_name })
      .getOne();

    if (propertyKey != null) {
      return propertyKey.id;
    }

    const node = await this.dbService.dataSource
      .getRepository(Node)
      .findOneBy({ id: node_id });

    if (node == null) {
      return null;
    }

    const new_property_key_instance = this.repository.create({
      property_key: key_name,
      node_id,
      sync_layer: this.syncService.syncLayer,
    });

    new_property_key_instance.node = node;

    const new_property_key = await this.repository.save(
      new_property_key_instance,
    );

    return new_property_key.id;
  }
}
