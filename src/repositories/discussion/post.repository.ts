import { DbService } from '@/services/db.service';

import { Post } from '@/models/discussion/post.entity';

export class PostRepository {
  constructor(private readonly dbService: DbService) {}

  get repository() {
    return this.dbService.dataSource.getRepository(Post);
  }
}
