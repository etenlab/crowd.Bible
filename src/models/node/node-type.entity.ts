import { Entity, PrimaryColumn } from 'typeorm';
import { Syncable } from '../Syncable';

@Entity()
export class NodeType extends Syncable {
  @PrimaryColumn('varchar')
  type_name!: string;
}
