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
    (nodePropertyKey) => nodePropertyKey.property_value,
  )
  @JoinColumn({
    name: 'id',
    referencedColumnName: 'id',
  })
  property_key!: NodePropertyKey;

  @Column('varchar')
  node_property_key_id!: string;

  // @Index("idx_node_property_values_key_id")
  // @RelationId((node_property_key: NodePropertyKey) => node_property_key.node_property_key_id)
  // node_property_key_id!: string
}
