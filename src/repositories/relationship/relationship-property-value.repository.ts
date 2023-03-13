import { RelationshipPropertyKey } from '../../models';
import { RelationshipPropertyValue } from '../../models/relationship/relationship-property-value.entity';
import { DbService } from '../../services/db.service';
import { SyncService } from '../../services/sync.service';

export class RelationshipPropertyValueRepository {
  constructor(private dbService: DbService, private syncService: SyncService) {}

  private get repository() {
    return this.dbService.dataSource.getRepository(RelationshipPropertyValue);
  }

  async createRelationshipPropertyValue(
    key_id: string,
    key_value: any,
  ): Promise<string | null> {
    const rel_property_key = await this.dbService.dataSource
      .getRepository(RelationshipPropertyKey)
      .findOneBy({ id: key_id });

    if (!rel_property_key) {
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
