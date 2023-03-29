import { GraphFirstLayerService } from './graph-first-layer.service';
import { GraphSecondLayerService } from './graph-second-layer.service';
import { VoteRepository } from '@/repositories/vote/vote.repository';
import {
  NodeTypeConst,
  RelationshipTypeConst,
  PropertyKeyConst,
} from '@/constants/graph.constant';

export class VotingService {
  constructor(
    private readonly firstLayerService: GraphFirstLayerService,
    private readonly secondLayerService: GraphSecondLayerService,
    private readonly voteRepo: VoteRepository,
  ) {}

  async createElection(tableName: TablesName, rowId: Nanoid): Promise<Nanoid> {
    const elections = await this.listElections(tableName, rowId);

    if (elections && elections.length > 0) {
      return elections[0];
    }

    const electionNode = await this.secondLayerService.createNodeFromObject(
      NodeTypeConst.ELECTION,
      {
        [PropertyKeyConst.TABLE_NAME]: tableName,
        [PropertyKeyConst.ROW_ID]: rowId,
      },
    );

    return electionNode.id;
  }

  async listElections(tableName: TablesName, rowId: Nanoid): Promise<Nanoid[]> {
    const constrains: { key: string; value: unknown }[] = [
      {
        key: PropertyKeyConst.TABLE_NAME,
        value: tableName,
      },
      {
        key: PropertyKeyConst.ROW_ID,
        value: rowId,
      },
    ];

    return this.firstLayerService.getNodesByProps(
      NodeTypeConst.ELECTION,
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
          relationship_type: RelationshipTypeConst.ELECTION_TO_BALLOT_ENTRY,
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
        key: PropertyKeyConst.TABLE_NAME,
        value: ballotEntryTarget.tableName,
      },
      {
        key: PropertyKeyConst.ROW_ID,
        value: ballotEntryTarget.rowId,
      },
      {
        key: PropertyKeyConst.ELECTION_ID,
        value: electionId,
      },
    ];

    const nodes = await this.firstLayerService.getNodesByProps(
      NodeTypeConst.BALLOT_ENTRY,
      constrains,
    );

    if (nodes && nodes.length > 0) {
      return nodes[0];
    }

    const { node } =
      await this.secondLayerService.createRelatedToNodeFromObject(
        RelationshipTypeConst.ELECTION_TO_BALLOT_ENTRY,
        {},
        electionId,
        NodeTypeConst.BALLOT_ENTRY,
        {
          [PropertyKeyConst.TABLE_NAME]: ballotEntryTarget.tableName,
          [PropertyKeyConst.ROW_ID]: ballotEntryTarget.rowId,
          [PropertyKeyConst.ELECTION_ID]: electionId,
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
