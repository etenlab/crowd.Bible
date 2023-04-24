import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Discussion } from './discussion.entity';
import { Reaction } from './reaction.entity';
import { RelationshipPostFile } from './relationship-post-file.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryColumn('uuid', { type: 'varchar', length: 21, unique: true })
  id!: string;

  @Column('text')
  discussion_id!: string;

  @ManyToOne(() => Discussion, (discussion) => discussion.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'discussion_id' })
  discussion!: Discussion;

  @Column('bigint')
  user_id!: number;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  @Column('varchar')
  quill_text!: string;

  @Column('varchar')
  plain_text!: string;

  @Column({ default: false, type: 'tinyint' })
  is_edited!: boolean;

  @Column({ type: 'bigint', nullable: true })
  reply_id?: number;

  @ManyToOne(() => Post, (post) => post.id, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  @JoinColumn({
    name: 'reply_id',
  })
  reply?: Post;

  @CreateDateColumn()
  created_at?: Date;

  @OneToMany(() => Reaction, (reaction) => reaction.post)
  reactions?: Reaction[];

  @OneToMany(() => RelationshipPostFile, (file) => file.post)
  files?: RelationshipPostFile[];
}
