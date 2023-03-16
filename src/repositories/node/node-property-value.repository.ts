import { NodePropertyKey } from '../../models';
import { NodePropertyValue } from '../../models/node/node-property-value.entity';
import { type DbService } from '../../services/db.service';
import { type SyncService } from '../../services/sync.service';

export class NodePropertyValueRepository {
  constructor(
    private readonly dbService: DbService,
    private readonly syncService: SyncService,
  ) {}

  private get repository() {
    return this.dbService.dataSource.getRepository(NodePropertyValue);
  }

  async createNodePropertyValue(
    key_id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key_value: any,
  ): Promise<string | null> {
    const node_property_key = await this.dbService.dataSource
      .getRepository(NodePropertyKey)
      .findOneBy({ id: key_id });

    if (node_property_key == null) {
      return null;
    }

    const new_property_value_instance = this.repository.create({
      property_value: JSON.stringify({ value: key_value }),
      node_property_key_id: key_id,
      sync_layer: this.syncService.syncLayer,
    } as NodePropertyValue);

    new_property_value_instance.propertyKey = node_property_key;

    const node_property_value = await this.repository.save(
      new_property_value_instance,
    );

    return node_property_value.id;
  }
}
