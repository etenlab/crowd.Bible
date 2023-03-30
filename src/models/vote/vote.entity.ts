import { Column, Entity, PrimaryColumn, Index, BeforeInsert } from 'typeorm';
import { nanoid } from 'nanoid';

import { Syncable } from '../Syncable';

@Entity({ name: 'votes' })
@Index(['ballot_entry_id', 'user_id'], { unique: true })
export class Vote extends Syncable {
  @PrimaryColumn('uuid', { type: 'varchar', length: 21, unique: true })
  id!: string;

  @BeforeInsert()
  setId() {
    this.id = nanoid();
  }

  @Column('text', { nullable: true })
  readonly vote_id!: string | null;

  @Column({ type: 'varchar' })
  ballot_entry_id!: string;

  @Column({ type: 'varchar', length: 512 })
  user_id!: string;

  @Column({ type: 'boolean', nullable: true, default: null })
  vote!: boolean | null;
}
