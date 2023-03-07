import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { nanoid } from 'nanoid';
import { Node } from './node.entity';
import { NodePropertyValue } from './node-property-value.entity';
import { Syncable } from '../Syncable';

@Entity()
export class NodePropertyKey extends Syncable {
  @PrimaryColumn('uuid', { type: 'varchar', length: 21, unique: true })
  id!: string;

  @BeforeInsert()
  setId() {
    this.id = nanoid();
  }

  @Column('text', { nullable: true })
  readonly node_property_key_id!: string | null;

  @Column('varchar')
  property_key!: string;

  @ManyToOne(() => Node, (node) => node.property_keys, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  node!: Node;

  // @Index("idx_node_property_keys_node_id_key")
  // @RelationId((node: Node) => node.node_id)
  // node_id!: string

  @Column('varchar')
  node_id!: string;

  @OneToOne(
    () => NodePropertyValue,
    (nodePropertyValue) => nodePropertyValue.property_key,
  )
  property_value!: NodePropertyValue;
}
