import { Column, Entity, PrimaryColumn, BeforeInsert, Index } from 'typeorm';
import { nanoid } from 'nanoid';

import { Syncable } from '../Syncable';

import { TableNameConst } from '@/constants/table-name.constant';

@Entity({ name: TableNameConst.SITE_TEXT })
@Index(['app_id', 'word_ref', 'definition_ref'], { unique: true })
export class SiteText extends Syncable {
  @PrimaryColumn('uuid', { type: 'varchar', length: 21, unique: true })
  id!: string;

  @BeforeInsert()
  setId() {
    this.id = nanoid();
  }

  // TODO: looks redundant, check and delete
  @Column('text', { nullable: true })
  readonly site_text_id!: string | null;

  @Column('varchar')
  app_id!: string;

  @Column({ type: 'varchar' })
  word_ref!: string;

  @Column({ type: 'varchar' })
  definition_ref!: string;

  @Column({ type: 'varchar' })
  original_language_id!: string;
}
