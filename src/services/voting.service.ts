import { GraphFirstLayerService } from './graph-first-layer.service';
import { GraphSecondLayerService } from './graph-second-layer.service';
import { VoteRepository } from '@/repositories/vote/vote.repository';
import * as constants from '@/utils/constants';

export class VotingService {
  constructor(
    private readonly firstLayerService: GraphFirstLayerService,
    private readonly secondLayerService: GraphSecondLayerService,
    private readonly voteRepo: VoteRepository,
  ) {}

  async createElection(tableName: TablesName, rowId: Nanoid): Promise<Nanoid> {
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
  }

  async listElections(tableName: TablesName, rowId: Nanoid): Promise<Nanoid[]> {
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

    return this.firstLayerService.getNodesByProps(
      constants.ELECTION_NODE_TYPE,
      constrains,
    );
  }

  async getElectionFull(electionId: Nanoid): Promise<VotesStatsRow[]> {
    const election = await this.firstLayerService.readNode(
      electionId,
      ['nodeRelationships'],
      {
        id: electionId,
        nodeRelationships: {
          relationship_type: constants.ELECTION_TO_BALLOT_ENTRY_REL_TYPE,
        },
      },
    );

    if (!election) {
      return [];
    }

    if (!election.nodeRelationships) {
      return [];
    }

    const ballotList = election.nodeRelationships.map((rel) => rel.to_node_id);

    const ballotWithStatesList = [];

    for (const id of ballotList) {
      const tmp = await this.voteRepo.getVotesStats(id);
      ballotWithStatesList.push(tmp);
    }

    return ballotWithStatesList;
  }

  async addBallotEntry(
    electionId: Nanoid,
    ballotEntryTarget: BallotEntryTarget,
  ): Promise<Nanoid> {
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

    const nodes = await this.firstLayerService.getNodesByProps(
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
