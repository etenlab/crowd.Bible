import {
  ElectionTypeConst,
  GraphFirstLayerService,
  MainKeyName,
  NodeTypeConst,
  PropertyKeyConst,
  RelationshipTypeConst,
  VotingService,
} from '@eten-lab/core';
import { LanguageInfo } from '@eten-lab/ui-kit';
import { VotableContent, VotableItem } from '@/dtos/votable-item.dto';
import { makeFindPropsByLang } from '@/utils/langUtils';
import { TableNameConst } from '@eten-lab/models';

export class VotableItemsService {
  constructor(
    private readonly graphFirstLayerService: GraphFirstLayerService,
    private readonly votingService: VotingService,
  ) {}

  /**
   * Finds candidate entry for a given votableNodeId and given electionTargetId or creates new candidate entry if not found.
   * We vote on relations, so relation must be a candidate entry target. So if relation between
   * votable node and election target does not exist, it will be created.
   * Relation type and direction is created according to electionTargetNode.nodeType
   *
   * @param votableNodeId - nodeId (definition/word/phrase)
   * @param electionId - in case if no existing candidateEntry found, new one will be created using this electionId
   * @param electionTargetId - nodeId (word/phrase/language)
   * @returns - id of the created candidate entry
   */
  async findOrCreateCandidateId(
    votableNodeId: Nanoid,
    electionId: Nanoid,
    electionTargetId: Nanoid,
    relationshipType: RelationshipTypeConst,
  ): Promise<Nanoid> {
    let relationship = await this.graphFirstLayerService.findRelationship(
      electionTargetId,
      votableNodeId,
      relationshipType as string,
    );

    if (!relationship) {
      relationship = await this.graphFirstLayerService.createRelationship(
        electionTargetId,
        votableNodeId,
        relationshipType as string,
      );
    }

    // if candidate exists, it won't be created, Just found and returned.
    const candidate = await this.votingService.addCandidate(
      electionId,
      relationship.id,
    );

    return candidate.id;
  }

  /**
   * Finds nodes related to electionTargetId (nodes only of given votableNodesType,
   * relation direction described by fromVotableNodes).
   * Finds/creates candidateEntry for each found node using given electionId.
   * Incapsulates information and returns it as VotableContent
   *
   * @param electionTargetId - nodeId (word/phrase/language)
   * @param electionId
   * @param votableNodesType - nodeId (definition/word/phrase)
   * @param propertyKeyText - used to get text of votable content
   * @param fromVotableNodes - set direction of relations. 'true' - default - relationship  is from votable items to election target.
   * @returns
   */
  async getVotableContent({
    electionTargetId,
    electionId,
    votableNodesType,
    propertyKeyText,
    fromVotableNodes = true,
    onlyWithLangInfo,
    relationshipType,
  }: {
    electionTargetId: Nanoid;
    electionId: Nanoid;
    votableNodesType: NodeTypeConst;
    propertyKeyText: PropertyKeyConst;
    fromVotableNodes?: boolean; // = true,
    onlyWithLangInfo?: LanguageInfo;
    relationshipType: RelationshipTypeConst;
  }): Promise<Array<VotableContent>> {
    const relationDirection = fromVotableNodes ? 'from_node_id' : 'to_node_id';
    const votableNodes =
      await this.graphFirstLayerService.getNodesByTypeAndRelatedNodes({
        type: votableNodesType,
        [relationDirection]: electionTargetId,
        onlyWithProps: onlyWithLangInfo
          ? makeFindPropsByLang(onlyWithLangInfo)
          : undefined,
      });
    const vcPromises: Promise<VotableContent>[] = votableNodes.map(
      async (votableNode) => {
        const candidateId = await this.findOrCreateCandidateId(
          votableNode.id,
          electionId,
          electionTargetId,
          relationshipType,
        );
        const { upVotes, downVotes } = await this.votingService.getVotesStats(
          candidateId,
        );
        const content = (await this.graphFirstLayerService.getNodePropertyValue(
          votableNode.id,
          propertyKeyText,
        )) as string;
        return {
          content,
          upVotes,
          downVotes,
          id: votableNode.id,
          candidateId,
        };
      },
    );
    return Promise.all(vcPromises);
  }

  /**
   * Finds definitions for given node Id and election Id and returns as VotableContent
   */
  async getDefinitionsAsVotableContent(
    forNodeId: Nanoid,
    electionId: Nanoid,
    relationshipType: RelationshipTypeConst,
  ): Promise<Array<VotableContent>> {
    return this.getVotableContent({
      electionTargetId: forNodeId,
      electionId,
      votableNodesType: NodeTypeConst.DEFINITION,
      propertyKeyText: MainKeyName[NodeTypeConst.DEFINITION],
      relationshipType,
    });
  }

  /**
   * Finds words for given node Id and election Id and returns as VotableContent
   */
  async getWordsAsVotableContent(
    forNodeId: Nanoid,
    electionId: Nanoid,
    relationshipType: RelationshipTypeConst,
    langInfo?: LanguageInfo,
  ): Promise<Array<VotableContent>> {
    return this.getVotableContent({
      electionTargetId: forNodeId,
      electionId,
      votableNodesType: NodeTypeConst.WORD,
      propertyKeyText: MainKeyName[NodeTypeConst.WORD],
      onlyWithLangInfo: langInfo,
      relationshipType,
    });
  }

  /**
   * Find nodes by votableNodesType and landgInfo (sic!: without filtering by ElectionId)
   * and use propertyKeyText as key to find content property in these nodes
   * Return these nodes as VotableContent.
   * Candidates are found nodes by itself (sic!: not a relation nodes)
   * Node: made for words and phrases, because they are elected without any context
   * @param votableNodesType
   * @param langInfo
   * @param propertyKeyText
   * @param customPropValues - optional addtitional clauses to filter result nodes array by properties
   * @returns
   */
  async getSelfVotableContentByLang(
    votableNodesType: NodeTypeConst,
    langInfo: LanguageInfo,
    propertyKeyText: PropertyKeyConst,
    customPropValues?: [{ key: string; value: string }],
  ): Promise<Array<VotableContent>> {
    const findProps = makeFindPropsByLang(langInfo);
    customPropValues && findProps.push(...customPropValues);
    const votableNodesIds = await this.graphFirstLayerService.getNodeIdsByProps(
      votableNodesType as string,
      findProps,
    );

    const vcPromises: Promise<VotableContent>[] = votableNodesIds.map(
      async (votableNodeId) => {
        const candidateSelfId = votableNodeId;
        const { upVotes, downVotes } = await this.votingService.getVotesStats(
          candidateSelfId,
        );
        const content = (await this.graphFirstLayerService.getNodePropertyValue(
          votableNodeId,
          propertyKeyText,
        )) as string;
        return {
          content,
          upVotes,
          downVotes,
          id: votableNodeId,
          candidateId: candidateSelfId,
        };
      },
    );
    return Promise.all(vcPromises);
  }

  /**
   * Finds nodes with given languageInfo as VotableItems (e.g .VotableItem = word,  with some contents=definitions or translation words to be voted)
   * These contents (e.g. definitions/translation words) are related to VotebleItem (e.g. word) through ElectionId which connects VotableItem and each of its votable contents
   * Note: Also we vote not on votable contents(defintions) directly, but we vote on relevant relations.
   *
   * From the other hand, VotableItem have own content(not contents!) witch represent item's own value(i.e. word by itself)
   * this item's own content also can be voted, but it isn't connected to anything, we dont care if they have any relation to any ElectionId.
   * Note: Here we vote on word by itself (not relation)
   * @param languageInfo
   * @param type: NodeTypeConst.WORD | NodeTypeConst.PHRASE, you can add other NodeTypeConst's if you specify for them MainKeyName
   * @returns
   */
  async getVotableItems(
    languageInfo: LanguageInfo,
    type: NodeTypeConst.WORD | NodeTypeConst.PHRASE,
    customPropValues?: [{ key: string; value: string }],
    forElectionType:
      | ElectionTypeConst.DEFINITION
      | ElectionTypeConst.TRANSLATION = ElectionTypeConst.DEFINITION,
    contentLangInfo?: LanguageInfo,
  ): Promise<Array<VotableItem>> {
    const itemContents = await this.getSelfVotableContentByLang(
      type,
      languageInfo,
      MainKeyName[type],
      customPropValues,
    );

    const votableItems: VotableItem[] = [];
    for (const vc of itemContents) {
      if (!vc.id) {
        throw new Error(`word ${vc.content} desn't have an id`);
      }
      // election for word to elect definitions.
      // if electionId exists, it won't be created, Just found and returned.
      const election = await this.votingService.createOrFindElection(
        forElectionType,
        vc.id,
        TableNameConst.NODES,
        TableNameConst.RELATIONSHIPS,
      );

      let contents: VotableContent[] = [];
      switch (forElectionType) {
        case ElectionTypeConst.DEFINITION:
          contents = await this.getDefinitionsAsVotableContent(
            vc.id,
            election.id,
            type === NodeTypeConst.WORD
              ? RelationshipTypeConst.WORD_TO_DEFINITION
              : RelationshipTypeConst.PHRASE_TO_DEFINITION,
          );
          break;
        case ElectionTypeConst.TRANSLATION:
          contents = await this.getWordsAsVotableContent(
            vc.id,
            election.id,
            type === NodeTypeConst.WORD
              ? RelationshipTypeConst.WORD_TO_TRANSLATION
              : RelationshipTypeConst.PHRASE_TO_TRANSLATION,
            contentLangInfo,
          );
          break;
        default:
          throw new Error(
            `Don't know how to find contents fro  Election Type ${forElectionType}`,
          );
      }

      votableItems.push({
        title: vc,
        contents,
        contentElectionId: election.id,
      } as VotableItem);
    }
    return votableItems;
  }
}
