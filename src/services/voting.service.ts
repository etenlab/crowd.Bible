import { GraphSecondLayerService } from './graph-second-layer.service';
import { VoteRepository } from '@/repositories/vote/vote.repository';
import { NodeRepository } from '@/repositories/node/node.repository';
import * as constants from '@/utils/constants';

export class VotingService {
  constructor(
    private readonly secondLayerService: GraphSecondLayerService,
    private readonly voteRepo: VoteRepository,
    private readonly nodeRepo: NodeRepository,
  ) {}

  async createElection(tableName: TablesName, rowId: Nanoid): Promise<Nanoid> {
    try {
      const elections = await this.listElections(tableName, rowId);

      if (elections && elections.length > 0) {
        throw new Error('Already exists the same election!');
      }

      const electionNode = await this.secondLayerService.createNodeFromObject(
        constants.ELECTION_NODE_TYPE,
        {
          [constants.TABLE_NAME]: tableName,
          [constants.ROW_ID]: rowId,
        },
      );

      return electionNode.id;
    } catch (err) {
      console.log(err);
      throw new Error('Failed to create a new election Node from object.');
    }
  }

  async listElections(tableName: TablesName, rowId: Nanoid): Promise<Nanoid[]> {
    try {
      const constrains: { key: string; value: unknown }[] = [
        {
          key: constants.TABLE_NAME,
          value: tableName,
        },
        {
          key: constants.ROW_ID,
          value: rowId,
        },
      ];

      return this.nodeRepo.getNodesByProps(
        constants.ELECTION_NODE_TYPE,
        constrains,
      );
    } catch (err) {
      throw new Error(
        `Failed to get list-elections with #table-name='${tableName}' #row-id='${rowId}'`,
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getElectionFull(electionId: Nanoid): Promise<any> {
    try {
      const election = await this.nodeRepo.repository.findOne({
        relations: ['nodeRelationships'],
        where: {
          id: electionId,
          node_type: constants.ELECTION_NODE_TYPE,
          nodeRelationships: {
            relationship_type: constants.ELECTION_TO_BALLOT_ENTRY_REL_TYPE,
          },
        },
      });

      if (!election) {
        return null;
      }

      if (!election.nodeRelationships) {
        return [];
      }

      const ballotList = election.nodeRelationships.map(
        (rel) => rel.to_node_id,
      );

      const ballotWithStatesList = [];

      for (const id of ballotList) {
        const tmp = await this.voteRepo.getVotesStats(id);
        ballotWithStatesList.push(tmp);
      }

      return ballotWithStatesList;
    } catch (err) {
      console.error(err);
      throw new Error(
        `Failed to get election list full with #election_id='${electionId}'`,
      );
    }
  }

  async addBallotEntry(
    electionId: Nanoid,
    ballotEntryTarget: BallotEntryTarget,
  ): Promise<Nanoid> {
    try {
      const constrains: { key: string; value: unknown }[] = [
        {
          key: constants.TABLE_NAME,
          value: ballotEntryTarget.tableName,
        },
        {
          key: constants.ROW_ID,
          value: ballotEntryTarget.rowId,
        },
        {
          key: constants.ELECTION_ID,
          value: electionId,
        },
      ];

      const nodes = await this.nodeRepo.getNodesByProps(
        constants.BALLOT_ENTRY_NODE_TYPE,
        constrains,
      );

      if (nodes && nodes.length > 0) {
        throw new Error('Already exists the ballot-entry at this election');
      }

      const { node } =
        await this.secondLayerService.createRelatedToNodeFromObject(
          electionId,
          constants.BALLOT_ENTRY_NODE_TYPE,
          constants.ELECTION_TO_BALLOT_ENTRY_REL_TYPE,
          {
            [constants.TABLE_NAME]: ballotEntryTarget.tableName,
            [constants.ROW_ID]: ballotEntryTarget.rowId,
            [constants.ELECTION_ID]: electionId,
          },
        );

      return node.id;
    } catch (err) {
      console.log(err);
      throw new Error('Failed addBallotEntry operation!');
    }
  }

  async addVote(
    ballotEntryId: Nanoid,
    userId: Nanoid,
    vote: boolean | null,
  ): Promise<Nanoid> {
    const newVote = await this.voteRepo.upsert({
      ballot_entry_id: ballotEntryId,
      user_id: userId,
      vote: vote,
    });

    return newVote.id;
  }
}
