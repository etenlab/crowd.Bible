import { DbService } from '@/services/db.service';

import { Post } from '@/src/models';

export class PostRepository {
  constructor(private readonly dbService: DbService) {}

  get repository() {
    return this.dbService.dataSource.getRepository(Post);
  }
}
