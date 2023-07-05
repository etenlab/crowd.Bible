import {
  NodeTypeConst,
  PropertyKeyConst,
  RelationshipTypeConst,
} from '@/constants/graph.constant';
import { ElectionTypeConst } from '@eten-lab/core';
import { TableNameConst } from '@/constants/table-name.constant';

import { DefinitionDto } from '@/dtos/definition.dto';

import {
  GraphFirstLayerService,
  GraphSecondLayerService,
  VotingService,
} from '@eten-lab/core';
import { WordService } from './word.service';

import { VotableContent } from '@/src/dtos/votable-item.dto';
import { LanguageInfo } from '@eten-lab/ui-kit';
import { LanguageMapper } from '@/mappers/language.mapper';
import { VotableItemsService } from './votable-items.service';

export class DefinitionService {
  constructor(
    private readonly graphFirstLayerService: GraphFirstLayerService,
    private readonly graphSecondLayerService: GraphSecondLayerService,
    private readonly votingService: VotingService,
    private readonly wordService: WordService,
    private readonly votableItemsService: VotableItemsService,
  ) {}

  /**
   * Creates defintion for given nodeId and candidate entry for this definition.
   *
   * @param definitionText - definition text
   * @param forNodeId - node Id (word or phrase) for which definition is created
   * @param electionId - election for node Id (word or phrase). Candidate entry will be connected to this election.
   * @returns - created definition Id and candidate Id
   */
  async createDefinition(
    definitionText: string,
    forNodeId: Nanoid,
  ): Promise<{
    definitionId: Nanoid;
    candidateId: Nanoid;
  }> {
    const existingDefinitionNode =
      await this.graphFirstLayerService.getNodeByProp(
        NodeTypeConst.DEFINITION,
        {
          key: PropertyKeyConst.DEFINITION,
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
            { [PropertyKeyConst.DEFINITION]: definitionText },
          )
        ).node;

    const { electionId } = await this.createDefinitionsElection(forNodeId);

    const candidateId = await this.votableItemsService.findOrCreateCandidateId(
      definitionNode.id,
      electionId,
      forNodeId,
    );

    return {
      definitionId: definitionNode.id,
      candidateId: candidateId,
    };
  }

  /**
   * Creates election of type 'definition' for given item (word/phrase/etc..)
   *
   * @param itemId - Nanoid of the word/phrase/etc node
   * @returns - created election Id (to add definition candidates to it)
   */
  async createDefinitionsElection(
    itemId: string,
  ): Promise<{ electionId: Nanoid }> {
    const definitionEelection = await this.votingService.createOrFindElection(
      ElectionTypeConst.DEFINITION,
      itemId,
      TableNameConst.NODES,
      TableNameConst.RELATIONSHIPS,
    );
    return { electionId: definitionEelection.id };
  }

  /**
   * @deprecated
   * This is invalid function, graph-schema data is immutable, never update.
   *
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
      [PropertyKeyConst.DEFINITION]: newDefinitionValue,
    });
  }

  /**
   * Get Definition Dto from word-to-definition relationship.
   *
   * @param rel - rel Id
   */
  async getDefinitionWithRel(rel: Nanoid): Promise<DefinitionDto | null> {
    const relEntity = await this.graphFirstLayerService.readRelationship(rel, [
      'fromNode',
      'fromNode.propertyKeys',
      'fromNode.propertyKeys.propertyValue',
    ]);

    if (!relEntity) {
      return null;
    }

    const { electionId } = await this.createDefinitionsElection(
      relEntity.from_node_id,
    );

    const candidate = await this.votingService.addCandidate(
      electionId,
      relEntity.id,
    );
    const { upVotes, downVotes, candidateId } =
      await this.votingService.getVotesStats(candidate.id);

    const wordText: string =
      (await this.graphFirstLayerService.getNodePropertyValue(
        relEntity.from_node_id,
        PropertyKeyConst.WORD,
      )) as string;
    const definitionText: string =
      (await this.graphFirstLayerService.getNodePropertyValue(
        relEntity.to_node_id,
        PropertyKeyConst.DEFINITION,
      )) as string;

    const languageInfo = LanguageMapper.entityToDto(relEntity.fromNode);

    return {
      wordId: relEntity.from_node_id,
      wordText: wordText,
      definitionId: relEntity.to_node_id,
      definitionText: definitionText,
      languageInfo: languageInfo!,
      relationshipId: relEntity.id,
      upVotes,
      downVotes,
      candidateId,
    };
  }

  /**
   * Finds definitions for given word, and languageInfo.
   *
   * @param word
   * @param languageInfo
   * @returns
   */
  async getDefinitionsAsVotableContentByWord(
    word: string,
    languageInfo: LanguageInfo,
  ): Promise<VotableContent[]> {
    const wordNodeId = await this.wordService.getWordOrPhraseWithLang(
      word,
      languageInfo,
    );

    if (!wordNodeId) {
      return [];
    }

    const { electionId } = await this.createDefinitionsElection(wordNodeId);

    return this.votableItemsService.getDefinitionsAsVotableContent(
      wordNodeId,
      electionId,
    );
  }
}
