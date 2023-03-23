import { RelationshipPropertyKey } from '@/models/index';
import { RelationshipPropertyValue } from '@/models/relationship/relationship-property-value.entity';
import { type DbService } from '@/services/db.service';
import { type SyncService } from '@/services/sync.service';

export class RelationshipPropertyValueRepository {
  constructor(
    private readonly dbService: DbService,
    private readonly syncService: SyncService,
  ) {}

  private get repository() {
    return this.dbService.dataSource.getRepository(RelationshipPropertyValue);
  }

  async createRelationshipPropertyValue(
    key_id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key_value: any,
  ): Promise<string | null> {
    const rel_property_key = await this.dbService.dataSource
      .getRepository(RelationshipPropertyKey)
      .findOneBy({ id: key_id });

    if (rel_property_key == null) {
      return null;
    }

    const new_property_value_instance = this.repository.create({
      property_value: JSON.stringify({ value: key_value }),
      sync_layer: this.syncService.syncLayer,
      relationship_property_key_id: key_id,
    });

    new_property_value_instance.propertyKey = rel_property_key;

    const relationship_property_value = await this.repository.save(
      new_property_value_instance,
    );

    return relationship_property_value.id;
  }
}
