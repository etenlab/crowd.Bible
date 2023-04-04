import {
  ElectionTypesConst,
  NodeTypeConst,
  PropertyKeyConst,
  RelationshipTypeConst,
  TablesNameConst,
} from '../constants/graph.constant';
import { LanguageDto } from '@/dtos/language.dto';
import { GraphFirstLayerService } from './graph-first-layer.service';
import { GraphSecondLayerService } from './graph-second-layer.service';
import { GraphThirdLayerService } from './graph-third-layer.service';
import { VotingService } from './voting.service';

export type VotableContent = {
  content: string;
  upVotes: number;
  downVotes: number;
  id: Nanoid | null;
  ballotId: Nanoid | null;
};

export type VotableItem = {
  title: VotableContent;
  contents: VotableContent[];
  contentElectionId: Nanoid | null;
};

export class DefinitionService {
  constructor(
    private readonly graphFirstLayerService: GraphFirstLayerService,
    private readonly graphSecondLayerService: GraphSecondLayerService,
    private readonly graphThirdLayerService: GraphThirdLayerService,
    private readonly votingService: VotingService,
  ) {}

  /**
   * Finds ballot entry for a give definitionId or creates new ballot entry if not found.
   *
   * @param definitionId
   * @param electionId - in case if no existing ballotEntry found, new one will be created using this electionId
   * @param forNodeId - nodeId (with type word or phrase) for which definition will be found or created
   * @returns - id of the created ballot entry
   */
  async findBallotEntryIdForDefinition(
    definitionId: Nanoid,
    electionId: Nanoid,
    forNodeId: Nanoid,
  ): Promise<Nanoid> {
    const node = await this.graphFirstLayerService.readNode(forNodeId, [
      'nodeType',
    ]);
    let relationshipType = RelationshipTypeConst.WORD_TO_DEFINITION;
    if (node?.nodeType.type_name === NodeTypeConst.PHRASE) {
      relationshipType = RelationshipTypeConst.PHRASE_TO_DEFINITION;
    }

    let relationship = await this.graphFirstLayerService.findRelationship(
      forNodeId,
      definitionId,
      relationshipType,
    );

    if (!relationship) {
      relationship = await this.graphFirstLayerService.createRelationship(
        forNodeId,
        definitionId,
        relationshipType,
      );
    }

    // if ballot entry exists, it won't be created, Just found and returned.
    const ballotEntryId = await this.votingService.addBallotEntry(electionId, {
      tableName: TablesNameConst.RELATIONSHIPS,
      rowId: relationship.id,
    });

    return ballotEntryId;
  }

  async createDefinition(
    definitionText: string,
    forNodeId: Nanoid,
    electionId: Nanoid,
  ): Promise<{
    definitionId: Nanoid;
    ballotEntryId: Nanoid;
  }> {
    const existingDefinitionNode =
      await this.graphFirstLayerService.getNodeByProp(
        NodeTypeConst.DEFINITION,
        {
          key: PropertyKeyConst.TEXT,
          value: definitionText,
        },
        { from_node_id: forNodeId },
      );

    const node = existingDefinitionNode
      ? existingDefinitionNode
      : (
          await this.graphSecondLayerService.createRelatedToNodeFromObject(
            RelationshipTypeConst.WORD_TO_DEFINITION,
            {},
            forNodeId,
            NodeTypeConst.DEFINITION,
            { [PropertyKeyConst.TEXT]: definitionText },
          )
        ).node;

    const ballotEntryId = await this.findBallotEntryIdForDefinition(
      forNodeId,
      electionId,
      node.id,
    );

    return {
      definitionId: node.id,
      ballotEntryId,
    };
  }

  async createWordAndDefinitionsElection(
    word: string,
    langId: Nanoid,
  ): Promise<{ wordId: Nanoid; electionId: Nanoid }> {
    const wordId = await this.graphThirdLayerService.createWord(word, langId);
    const electionId = await this.votingService.createElection(
      TablesNameConst.NODES,
      wordId,
      ElectionTypesConst.DEFINITION,
    );
    return { wordId, electionId };
  }

  async createPhraseAndDefinitionsElection(
    phrase: string,
    langId: Nanoid,
  ): Promise<{ phraseId: Nanoid; electionId: Nanoid }> {
    const existingPhraseNode = await this.graphFirstLayerService.getNodeByProp(
      NodeTypeConst.PHRASE,
      {
        key: PropertyKeyConst.TEXT,
        value: phrase,
      },
    );
    const node = existingPhraseNode
      ? existingPhraseNode
      : (
          await this.graphSecondLayerService.createRelatedFromNodeFromObject(
            RelationshipTypeConst.PHRASE_TO_LANG,
            {},
            NodeTypeConst.PHRASE,
            { name: phrase },
            langId,
          )
        ).node;

    const electionId = await this.votingService.createElection(
      TablesNameConst.NODES,
      node.id,
      ElectionTypesConst.DEFINITION,
    );
    return { phraseId: node.id, electionId };
  }

  async getDefinitionsAsVotableContent(
    forNodeId: Nanoid,
    electionId: Nanoid,
  ): Promise<Array<VotableContent>> {
    const definitionNodes =
      await this.graphFirstLayerService.getNodesByTypeAndRelatedNodes({
        type: NodeTypeConst.DEFINITION,
        from_node_id: forNodeId,
      });
    const vcPromises: Promise<VotableContent>[] = definitionNodes.map(
      async (definitionNode) => {
        const ballotId = await this.findBallotEntryIdForDefinition(
          definitionNode.id,
          electionId,
          forNodeId,
        );

        const { up: upVotes, down: downVotes } =
          await this.votingService.getVotesStats(ballotId);
        return {
          content: this.graphSecondLayerService.getNodePropertyValue(
            definitionNode,
            PropertyKeyConst.TEXT,
          ),
          upVotes,
          downVotes,
          id: definitionNode.id,
          ballotId,
        };
      },
    );
    return Promise.all(vcPromises);
  }

  async getPhrasesAsVotableItems(
    langNodeId: string,
  ): Promise<Array<VotableItem>> {
    const phraseNodes =
      await this.graphFirstLayerService.getNodesByTypeAndRelatedNodes({
        type: NodeTypeConst.PHRASE,
        to_node_id: langNodeId,
      });

    const viPromises = phraseNodes.map(async (pn) => {
      // if electionId exists, it won't be created, Just found and returned.
      const electionId = await this.votingService.createElection(
        TablesNameConst.NODES,
        pn.id,
        ElectionTypesConst.DEFINITION,
      );
      return {
        title: {
          content: this.graphSecondLayerService.getNodePropertyValue(
            pn,
            'name',
          ),
          upVotes: 0, //TODO: 0 is a mocked value, replace it when voting is ready
          downVotes: 0, //TODO: 0 is a mocked value, replace it when voting is ready
          id: pn.id,
        } as VotableContent,
        contents: await this.getDefinitionsAsVotableContent(pn.id, electionId),
        contentElectionId: electionId,
      } as VotableItem;
    });
    const vi = await Promise.all(viPromises);
    return vi;
  }

  async getWordsAsVotableItems(
    langNodeId: string,
  ): Promise<Array<VotableItem>> {
    const wordNodes = await this.graphThirdLayerService.getWords({
      to_node_id: langNodeId,
      relationship_type: RelationshipTypeConst.WORD_TO_LANG,
    });
    const viPromises = wordNodes.map(async (wn) => {
      // if electionId exists, it won't be created, Just found and returned.
      const electionId = await this.votingService.createElection(
        TablesNameConst.NODES,
        wn.id,
        ElectionTypesConst.DEFINITION,
      );
      return {
        title: {
          content: this.graphSecondLayerService.getNodePropertyValue(
            wn,
            'name',
          ),
          upVotes: 0, //TODO: 0 is a mocked value, replace it when voting is ready
          downVotes: 0, //TODO: 0 is a mocked value, replace it when voting is ready
          id: wn.id,
        } as VotableContent,
        contents: await this.getDefinitionsAsVotableContent(wn.id, electionId),
        contentElectionId: electionId,
      } as VotableItem;
    });
    const vi = await Promise.all(viPromises);
    return vi;
  }

  async getLanguages(): Promise<LanguageDto[]> {
    return this.graphThirdLayerService.getLanguages();
  }

  async updateDefinitionValue(
    definitionNodeId: Nanoid,
    newDefinitionValue: string,
  ): Promise<void> {
    this.graphSecondLayerService.updateNodeObject(definitionNodeId, {
      [PropertyKeyConst.TEXT]: newDefinitionValue,
    });
  }
}
