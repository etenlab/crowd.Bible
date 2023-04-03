import { Entity, PrimaryColumn } from 'typeorm';
import { Syncable } from '../Syncable';

@Entity({ name: 'node_types' })
export class NodeType extends Syncable {
  @PrimaryColumn('varchar')
  type_name!: string;
}
