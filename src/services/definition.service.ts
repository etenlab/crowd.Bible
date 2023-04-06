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
   * We vote on relations, so relation must be a ballot entry target. So if relation between
   * votable node and election target does not exist, it will be created.
   * Relation type and direction is created according to electionTargetNode.nodeType
   *
   * @param votableNodeId - nodeId (definition/word/phrase)
   * @param electionId - in case if no existing ballotEntry found, new one will be created using this electionId
   * @param electionTargetId - nodeId (word/phrase/language)
   * @returns - id of the created ballot entry
   */
  async findOrCreateBallotEntryId(
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
    let relationshipType: RelationshipTypeConst;
    let isDirectionToVotable: boolean;
    switch (electionTargetNode?.nodeType.type_name) {
      case NodeTypeConst.PHRASE:
        relationshipType = RelationshipTypeConst.PHRASE_TO_DEFINITION;
        isDirectionToVotable = true; //relatinos are directed as from phrase to definition, voting is on definition
        break;
      case NodeTypeConst.WORD:
        relationshipType = RelationshipTypeConst.WORD_TO_DEFINITION;
        isDirectionToVotable = true; //relatinos  are directed as from word to definition, voting is on definition
        break;
      case NodeTypeConst.LANGUAGE:
        relationshipType =
          votableNode?.nodeType.type_name === NodeTypeConst.PHRASE
            ? RelationshipTypeConst.PHRASE_TO_LANG
            : RelationshipTypeConst.WORD_TO_LANG;
        isDirectionToVotable = false; //relatinos  are directed as  from phrase/word to language, voting is on phrase/word

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
    const fromNode = isDirectionToVotable ? electionTargetId : votableNodeId;
    const toNode = isDirectionToVotable ? votableNodeId : electionTargetId;
    let relationship = await this.graphFirstLayerService.findRelationship(
      fromNode,
      toNode,
      relationshipType as string,
    );

    if (!relationship) {
      relationship = await this.graphFirstLayerService.createRelationship(
        fromNode,
        toNode,
        relationshipType as string,
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

    const ballotEntryId = await this.findOrCreateBallotEntryId(
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
   * Creates word (as votable node for language) and election of type 'definition' for this word
   *
   * @param word - word text
   * @param langId - language of this word
   * @returns - created word Id and election Id (to add definition ballots to it)
   */
  async createWordAndDefinitionsElection(
    word: string,
    langId: Nanoid,
    langElectionId: Nanoid,
  ): Promise<{ wordId: Nanoid; electionId: Nanoid; wordBallotId: Nanoid }> {
    const wordId = await this.graphThirdLayerService.createWord(word, langId);
    const wordBallotId = await this.findOrCreateBallotEntryId(
      wordId,
      langElectionId,
      langId,
    );
    const definitionEelectionId = await this.votingService.createElection(
      TablesNameConst.NODES,
      wordId,
      ElectionTypesConst.DEFINITION,
    );
    return { wordId, electionId: definitionEelectionId, wordBallotId };
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
    langElectionId: Nanoid,
  ): Promise<{ phraseId: Nanoid; electionId: Nanoid; phraseBallotId: Nanoid }> {
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

    const phraseBallotId = await this.findOrCreateBallotEntryId(
      node.id,
      langElectionId,
      langId,
    );

    const electionId = await this.votingService.createElection(
      TablesNameConst.NODES,
      node.id,
      ElectionTypesConst.DEFINITION,
    );
    return { phraseId: node.id, electionId, phraseBallotId };
  }

  /**
   * Finds nodes related to electionTargetId (nodes only of given votableNodesType,
   * relation direction described by fromVotableNodes).
   * Finds/creates ballotEntry for each found node using given electionId.
   * Incapsulates information and returns it as VotableContent
   *
   * @param electionTargetId - nodeId (word/phrase/language)
   * @param electionId
   * @param votableNodesType - nodeId (definition/word/phrase)
   * @param propertyKeyText - used to get text of votable content
   * @param fromVotableNodes - set direction of relations. 'true' - default - relationship  is from votable items to election target.
   * @returns
   */

  async getVotableContent(
    electionTargetId: Nanoid,
    electionId: Nanoid,
    votableNodesType: NodeTypeConst,
    propertyKeyText: PropertyKeyConst,
    fromVotableNodes = true,
  ): Promise<Array<VotableContent>> {
    const relationDirection = fromVotableNodes ? 'from_node_id' : 'to_node_id';
    const votableNodes =
      await this.graphFirstLayerService.getNodesByTypeAndRelatedNodes({
        type: votableNodesType,
        [relationDirection]: electionTargetId,
      });
    const vcPromises: Promise<VotableContent>[] = votableNodes.map(
      async (votableNode) => {
        const ballotId = await this.findOrCreateBallotEntryId(
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
    langElectionId: Nanoid,
  ): Promise<Array<VotableItem>> {
    const phrasesContents = await this.getVotableContent(
      langNodeId,
      langElectionId,
      NodeTypeConst.PHRASE,
      PropertyKeyConst.NAME,
      false,
    );

    const viPromises = phrasesContents.map(async (pc) => {
      if (!pc.id) {
        throw new Error(`phrase ${pc.content} desn't have an id`);
      }
      // if electionId exists, it won't be created, Just found and returned.
      const electionId = await this.votingService.createElection(
        TablesNameConst.NODES,
        pc.id,
        ElectionTypesConst.DEFINITION,
      );
      return {
        title: pc,
        contents: await this.getDefinitionsAsVotableContent(pc.id, electionId),
        contentElectionId: electionId,
      } as VotableItem;
    });
    const vi = await Promise.all(viPromises);
    return vi;
  }

  /**
   * Finds Words for given language Id as VotableItems
   * For now, not quite sure how vote on phrases (not phrase definitions, but phrase itself, so it is still TODO)
   * @param langNodeId
   * @returns
   */
  async getWordsAsVotableItems(
    langNodeId: Nanoid,
    langElectionId: Nanoid,
  ): Promise<Array<VotableItem>> {
    const wordsContents = await this.getVotableContent(
      langNodeId,
      langElectionId,
      NodeTypeConst.WORD,
      PropertyKeyConst.NAME,
      false,
    );

    const viPromises = wordsContents.map(async (wc) => {
      if (!wc.id) {
        throw new Error(`word ${wc.content} desn't have an id`);
      }
      // if electionId exists, it won't be created, Just found and returned.
      const electionId = await this.votingService.createElection(
        TablesNameConst.NODES,
        wc.id,
        ElectionTypesConst.DEFINITION,
      );

      return {
        title: wc,
        contents: await this.getDefinitionsAsVotableContent(wc.id, electionId),
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
