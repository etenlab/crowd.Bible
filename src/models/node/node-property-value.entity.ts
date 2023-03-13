import {
  Entity,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { nanoid } from 'nanoid';
import { NodePropertyKey } from './node-property-key.entity';
import { Syncable } from '../Syncable';

@Entity()
export class NodePropertyValue extends Syncable {
  @PrimaryColumn('uuid', { type: 'varchar', length: 21, unique: true })
  id!: string;

  @BeforeInsert()
  setId() {
    this.id = nanoid();
  }

  @Column('text', { nullable: true })
  readonly node_property_value_id!: string | null;

  @Column('varchar')
  property_value!: any;

  @OneToOne(
    () => NodePropertyKey,
    (nodePropertyKey) => nodePropertyKey.propertyValue,
  )
  @JoinColumn({
    name: 'node_property_key_id',
    referencedColumnName: 'id',
  })
  propertyKey!: NodePropertyKey;

  @Column('varchar')
  node_property_key_id!: string;
}
