import { DbService } from '@/services/db.service';
import { SyncService } from '@/services/sync.service';
import { Vote } from '@/models/vote/vote.entity';

export interface IVoteInput {
  ballot_entry_id: string;
  user_id: string;
  vote: boolean | null;
}

export interface IUpdateVote {
  vote_id: string;
  user_id: string;
  vote: boolean | null;
}

export class VoteRepository {
  constructor(
    private readonly dbService: DbService,
    private readonly syncService: SyncService,
  ) {}

  get repository() {
    return this.dbService.dataSource.getRepository(Vote);
  }

  async upsert(input: IVoteInput): Promise<Vote> {
    const sameVote = await this.repository.findOneBy({
      ballot_entry_id: input.ballot_entry_id,
      user_id: input.user_id,
    });

    if (sameVote) {
      return this.update({
        vote_id: sameVote.id,
        user_id: input.user_id,
        vote: input.vote,
      });
    }

    const newVote = this.repository.create({
      ...input,
      sync_layer: this.syncService.syncLayer,
    });

    return this.repository.save(newVote);
  }

  async readVote(vote_id: string): Promise<Vote> {
    const vote = await this.repository.findOne({
      where: { id: vote_id },
    });

    if (!vote) {
      throw new Error(`Vote ${vote_id} was not found`);
    }

    return vote;
  }

  async readVoteByBallotEntry(ballot_entry_id: string): Promise<Vote> {
    const vote = await this.repository.findOne({
      where: {
        ballot_entry_id: ballot_entry_id,
      },
    });

    if (!vote) {
      throw new Error(`Vote was not found`);
    }

    return vote;
  }

  async listVotes(): Promise<Vote[]> {
    const votes = await this.repository.find();
    return votes;
  }

  //TODO: define VoteStat
  async getVotesStats(ballot_entry_id: Nanoid): Promise<VotesStatsRow> {
    const result: VotesStatsRow[] = await this.repository.query(`
    SELECT 
      v.ballot_entry_id, 
      COUNT(
        CASE WHEN v.vote = true THEN 1 ELSE null END
      ) as up, 
      COUNT(
        CASE WHEN v.vote = false THEN 1 ELSE null END
      ) as down 
    FROM 
      votes AS v 
    WHERE 
      v.ballot_entry_id = '${ballot_entry_id}'
    GROUP BY 
      v.ballot_entry_id 
    ORDER BY 
      COUNT(
        CASE WHEN v.vote = true THEN 1 WHEN v.vote = false THEN 0 ELSE null END
      ) desc;`);

    if (result.length === 0) {
      return {
        ballot_entry_id: ballot_entry_id,
        up: 0,
        down: 0,
      };
    }

    return result[0];
  }

  async update(input: IUpdateVote): Promise<Vote> {
    const vote = await this.repository.findOne({
      where: { id: input.vote_id, user_id: input.user_id },
    });

    if (!vote) {
      throw new Error(`Vote ${input.vote_id} was not found`);
    }

    try {
      return this.repository.save({
        ...vote,
        vote: input.vote,
        sync_layer: this.syncService.syncLayer,
      });
    } catch (e) {
      throw new Error(`Could not update vote ${input.vote_id}`);
    }
  }

  async delete(vote_id: string): Promise<boolean> {
    const vote = await this.readVote(vote_id);
    await this.repository.remove(vote);
    return true;
  }
}
