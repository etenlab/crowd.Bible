import { Repository } from 'typeorm';
import { User } from '@/src/models/user/user.entity';
import { DbService } from '@/services/db.service';

export class UserRepository {
  repository!: Repository<User>;

  constructor(private dbService: DbService) {
    this.repository = this.dbService.dataSource.getRepository(User);
  }

  async save(user: User) {
    return this.repository.save(user);
  }

  async all() {
    return this.repository.find();
  }
}
