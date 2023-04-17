import { Column, Entity, PrimaryColumn, BeforeInsert, Index } from 'typeorm';

import { nanoid } from 'nanoid';

import { Syncable } from '../Syncable';

import { TableNameConst } from '@/constants/table-name.constant';

@Entity({ name: TableNameConst.SITE_TEXT_TRANSLATION })
@Index(['site_text_id', 'word_ref', 'definition_ref', 'language_id'], {
  unique: true,
})
export class SiteTextTranslation extends Syncable {
  @PrimaryColumn('uuid', { type: 'varchar', length: 21, unique: true })
  id!: string;

  @BeforeInsert()
  setId() {
    this.id = nanoid();
  }

  // TODO: looks redundant, check and delete
  @Column('text', { nullable: true })
  readonly site_text_translation_id!: string | null;

  @Column('varchar')
  site_text_id!: string;

  @Column({ type: 'varchar' })
  word_ref!: string;

  @Column({ type: 'varchar' })
  definition_ref!: string;

  @Column({ type: 'varchar' })
  language_id!: string;

  @Column({ type: 'boolean', default: false })
  is_selected!: boolean;
}
