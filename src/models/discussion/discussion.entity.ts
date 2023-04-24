import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { Post } from './post.entity';

@Entity({ name: 'discussions' })
export class Discussion {
  @PrimaryColumn('uuid', { type: 'varchar', length: 21, unique: true })
  id!: string;

  @Column('varchar', { nullable: true })
  table_name!: string;

  @Column('varchar', { nullable: true })
  row!: string;

  @OneToMany(() => Post, (post) => post.discussion)
  posts!: Post[];
}
