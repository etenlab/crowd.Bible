import { Entity, PrimaryColumn } from 'typeorm';
import { Syncable } from '../Syncable';

@Entity({ name: 'relationship_types' })
export class RelationshipType extends Syncable {
  @PrimaryColumn('varchar')
  type_name!: string;
}
