import { Relationship } from '@/models/index';
import { RelationshipPropertyKey } from '@/models/relationship/relationship-property-key.entity';
import { type DbService } from '@/services/db.service';
import { type SyncService } from '@/services/sync.service';

export class RelationshipPropertyKeyRepository {
  constructor(
    private readonly dbService: DbService,
    private readonly syncService: SyncService,
  ) {}

  private get repository() {
    return this.dbService.dataSource.getRepository(RelationshipPropertyKey);
  }

  async createRelationshipPropertyKey(
    rel_id: string,
    key_name: string,
  ): Promise<string | null> {
    const property_key = await this.repository
      .createQueryBuilder('relPropertyKey')
      .where('relPropertyKey.id = :rel_id', { rel_id })
      .andWhere('relPropertyKey.property_key = :key_name', { key_name })
      .getOne();

    if (property_key != null) {
      return property_key.id;
    }

    const relationship = await this.dbService.dataSource
      .getRepository(Relationship)
      .findOneBy({
        id: rel_id,
      });

    if (relationship == null) {
      return null;
    }

    const new_property_key_instance = this.repository.create({
      property_key: key_name,
      sync_layer: this.syncService.syncLayer,
      relationship_id: rel_id,
    } as RelationshipPropertyKey);

    new_property_key_instance.relationship = relationship;

    const new_property_key = await this.repository.save(
      new_property_key_instance,
    );

    return new_property_key.id;
  }
}
