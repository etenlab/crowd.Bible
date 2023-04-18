import { ElectionType } from '@/models/voting/election-type.entity';
import { type DbService } from '@/services/db.service';
import { type SyncService } from '@/services/sync.service';

import { ElectionTypeConst } from '@/constants/voting.constant';

export class ElectionTypeRepository {
  constructor(
    private readonly dbService: DbService,
    private readonly syncService: SyncService,
  ) {}

  private get repository() {
    return this.dbService.dataSource.getRepository(ElectionType);
  }

  async createElectionType(
    type_name: ElectionTypeConst,
  ): Promise<ElectionTypeConst> {
    const electionType = await this.repository.save({
      type_name,
      sync_layer: this.syncService.syncLayer,
    });

    return electionType.type_name;
  }

  async listElectionTypes(): Promise<ElectionType[]> {
    const electionTypes = await this.repository.find({ select: ['type_name'] });

    return electionTypes;
  }
}
