import {
  ElectionTypesConst,
  NodeTypeConst,
  PropertyKeyConst,
  RelationshipTypeConst,
  TablesNameConst,
} from '../constants/graph.constant';
import { LanguageWithElecitonsDto } from '@/dtos/language.dto';
import { GraphFirstLayerService } from './graph-first-layer.service';
import { GraphSecondLayerService } from './graph-second-layer.service';
import { GraphThirdLayerService } from './graph-third-layer.service';
import { VotingService } from './voting.service';
import { VotableContent, VotableItem } from '../dtos/votable-item.dto';

export class DefinitionService {
  constructor(
    private readonly graphFirstLayerService: GraphFirstLayerService,
    private readonly graphSecondLayerService: GraphSecondLayerService,
    private readonly graphThirdLayerService: GraphThirdLayerService,
    private readonly votingService: VotingService,
  ) {}

  /**
   * Finds ballot entry for a given votableNodeId or creates new ballot entry if not found.
   *
   * @param votableNodeId - nodeId (definition/word/phrase)
   * @param electionId - in case if no existing ballotEntry found, new one will be created using this electionId
   * @param electionTargetId - nodeId (word/phrase/language)
   * @returns - id of the created ballot entry
   */
  async findBallotEntryId(
    votableNodeId: Nanoid,
    electionId: Nanoid,
    electionTargetId: Nanoid,
  ): Promise<Nanoid> {
    const electionTargetNode = await this.graphFirstLayerService.readNode(
      electionTargetId,
      ['nodeType'],
    );
    const votableNode = await this.graphFirstLayerService.readNode(
      votableNodeId,
      ['nodeType'],
    );
    let relationshipType;
    switch (electionTargetNode?.nodeType.type_name) {
      case NodeTypeConst.PHRASE:
        relationshipType = RelationshipTypeConst.PHRASE_TO_DEFINITION;
        break;
      case NodeTypeConst.WORD:
        relationshipType = RelationshipTypeConst.WORD_TO_DEFINITION;
        break;
      case NodeTypeConst.LANGUAGE:
        relationshipType =
          votableNode?.nodeType.type_name === NodeTypeConst.PHRASE
            ? RelationshipTypeConst.PHRASE_TO_LANG
            : RelationshipTypeConst.WORD_TO_LANG;

        break;
      default:
        throw new Error(
          `
            We don't know which type of Relationship we take for voting 
            if election target type is ${electionTargetNode?.nodeType.type_name} 
            And votable node type is ${votableNode?.nodeType.type_name}
          `,
        );
    }

    let relationship = await this.graphFirstLayerService.findRelationship(
      electionTargetId,
      votableNodeId,
      relationshipType,
    );

    if (!relationship) {
      relationship = await this.graphFirstLayerService.createRelationship(
        electionTargetId,
        votableNodeId,
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

  /**
   * Creates defintion for given nodeId and ballot entry for this definition.
   *
   * @param definitionText - definition text
   * @param forNodeId - node Id (word or phrase) for which definition is created
   * @param electionId - election for node Id (word or phrase). Ballot entry will be connected to this election.
   * @returns - created definition Id and ballot Id
   */

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

    const definitionNode = existingDefinitionNode
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

    const ballotEntryId = await this.findBallotEntryId(
      definitionNode.id,
      electionId,
      forNodeId,
    );

    return {
      definitionId: definitionNode.id,
      ballotEntryId,
    };
  }

  /**
   * Creates word and election of type 'definition' for this word
   *
   * @param word - word text
   * @param langId - language of this word
   * @returns - created word Id and election Id (to add definition ballots to it)
   */
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

  /**
   * Creates phrase and election of type 'definition' for this phrase
   *
   * @param word - phrase text
   * @param langId - language of this phrase
   * @returns - created phrase Id and election Id (to add definition ballots to it)
   */
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

  /**
   * Finds nodes for given electionTargetId and electionId and returns as VotableContent
   * Nodes search restricted by votableNodesType
   *
   * @param electionTargetId - nodeId (word/phrase/language)
   * @param electionId
   * @param votableNodesType - nodeId (definition/word/phrase)
   * @param propertyKeyText - used to get text of votable content
   * @returns
   */
  async getVotableContent(
    electionTargetId: Nanoid,
    electionId: Nanoid,
    votableNodesType: NodeTypeConst,
    propertyKeyText: PropertyKeyConst,
  ): Promise<Array<VotableContent>> {
    const votableNodes =
      await this.graphFirstLayerService.getNodesByTypeAndRelatedNodes({
        type: votableNodesType,
        from_node_id: electionTargetId,
      });
    const vcPromises: Promise<VotableContent>[] = votableNodes.map(
      async (votableNode) => {
        const ballotId = await this.findBallotEntryId(
          votableNode.id,
          electionId,
          electionTargetId,
        );
        const { up: upVotes, down: downVotes } =
          await this.votingService.getVotesStats(ballotId);
        return {
          content: this.graphSecondLayerService.getNodePropertyValue(
            votableNode,
            propertyKeyText,
          ),
          upVotes,
          downVotes,
          id: votableNode.id,
          ballotId,
        };
      },
    );
    return Promise.all(vcPromises);
  }

  /**
   * Finds definitions for given node Id and election Id and returns as VotableContent
   *
   * @param forNodeId
   * @param electionId
   * @returns
   */
  async getDefinitionsAsVotableContent(
    forNodeId: Nanoid,
    electionId: Nanoid,
  ): Promise<Array<VotableContent>> {
    return this.getVotableContent(
      forNodeId,
      electionId,
      NodeTypeConst.DEFINITION,
      PropertyKeyConst.TEXT,
    );
  }

  /**
   * Finds Phrases for given language Id as VotableItems
   * For now, not quite sure how vote on phrases (not phrase definitions, but phrase itself, so it is still TODO)
   *
   * @param langNodeId
   * @returns
   */
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

  /**
   * Finds Words for given language Id as VotableContent
   * For now, not quite sure how vote on phrases (not phrase definitions, but phrase itself, so it is still TODO)
   * @param langNodeId
   * @returns
   */
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

  /**
   * Gets all languges. Finds or creates for each language elections of words and phrases
   *
   * @returns
   */
  async getLanguages(): Promise<LanguageWithElecitonsDto[]> {
    const languages = await this.graphThirdLayerService.getLanguages();
    const langPromises: Promise<LanguageWithElecitonsDto>[] = languages.map(
      async (l) => {
        const electionWordsId = await this.votingService.createElection(
          TablesNameConst.NODES,
          l.id,
          ElectionTypesConst.WORD_LANGUAGE,
        );
        const electionPhrasesId = await this.votingService.createElection(
          TablesNameConst.NODES,
          l.id,
          ElectionTypesConst.PHRASE_LANGUAGE,
        );
        return {
          ...l,
          electionWordsId,
          electionPhrasesId,
        };
      },
    );
    return Promise.all(langPromises);
  }

  /**
   * Updates definition (as text property of given node Id).
   *
   * @param definitionNodeId - node Id to be updated
   * @param newDefinitionValue - new defintion value
   */

  async updateDefinitionValue(
    definitionNodeId: Nanoid,
    newDefinitionValue: string,
  ): Promise<void> {
    this.graphSecondLayerService.updateNodeObject(definitionNodeId, {
      [PropertyKeyConst.TEXT]: newDefinitionValue,
    });
  }
}
