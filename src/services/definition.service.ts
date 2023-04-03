import {
  NodeTypeConst,
  PropertyKeyConst,
  RelationshipTypeConst,
} from '../constants/graph.constant';
import { LanguageDto } from '@/dtos/language.dto';
import { GraphFirstLayerService } from './graph-first-layer.service';
import { GraphSecondLayerService } from './graph-second-layer.service';
import { GraphThirdLayerService } from './graph-third-layer.service';

export type VotableContent = {
  content: string;
  upVote: number;
  downVote: number;
  id: Nanoid | null;
};

export type VotableItem = {
  title: VotableContent;
  contents: VotableContent[];
};

export class DefinitionService {
  constructor(
    private readonly graphFirstLayerService: GraphFirstLayerService,
    private readonly graphSecondLayerService: GraphSecondLayerService,
    private readonly graphThirdLayerService: GraphThirdLayerService,
  ) {}

  async createDefinition(
    definitionText: string,
    forNodeId: Nanoid,
  ): Promise<Nanoid> {
    const existingDefinitionNode =
      await this.graphFirstLayerService.getNodeByProp(
        NodeTypeConst.DEFINITION,
        {
          key: PropertyKeyConst.TEXT,
          value: definitionText,
        },
        { from_node_id: forNodeId },
      );

    if (existingDefinitionNode?.id) {
      return existingDefinitionNode.id;
    }

    const { node } =
      await this.graphSecondLayerService.createRelatedToNodeFromObject(
        RelationshipTypeConst.WORD_TO_DEFINITION,
        {},
        forNodeId,
        NodeTypeConst.DEFINITION,
        { [PropertyKeyConst.TEXT]: definitionText },
      );

    return node.id;
  }

  async createWord(word: string, langId: Nanoid): Promise<Nanoid> {
    return this.graphThirdLayerService.createWord(word, langId);
  }

  async createPhrase(phrase: string, langId: Nanoid): Promise<Nanoid> {
    const existingPhraseNode = await this.graphFirstLayerService.getNodeByProp(
      NodeTypeConst.PHRASE,
      {
        key: PropertyKeyConst.TEXT,
        value: phrase,
      },
    );
    if (existingPhraseNode?.id) {
      return existingPhraseNode.id;
    }

    const { node } =
      await this.graphSecondLayerService.createRelatedFromNodeFromObject(
        RelationshipTypeConst.PHRASE_TO_LANG,
        {},
        NodeTypeConst.PHRASE,
        { name: phrase },
        langId,
      );
    return node.id;
  }

  async getDefinitionsAsVotableContent(
    wordNodeId: string,
  ): Promise<Array<VotableContent>> {
    const definitionNodes =
      await this.graphFirstLayerService.getNodesByTypeAndRelatedNodes({
        type: NodeTypeConst.DEFINITION,
        from_node_id: wordNodeId,
      });
    const vc: VotableContent[] = definitionNodes.map((definitionNode) => ({
      content: this.graphSecondLayerService.getNodePropertyValue(
        definitionNode,
        PropertyKeyConst.TEXT,
      ),
      upVote: 0,
      downVote: 0,
      id: definitionNode.id,
    }));
    return vc;
  }

  async getPhrasesAsVotableItems(
    langNodeId: string,
  ): Promise<Array<VotableItem>> {
    const phraseNodes =
      await this.graphFirstLayerService.getNodesByTypeAndRelatedNodes({
        type: NodeTypeConst.PHRASE,
        to_node_id: langNodeId,
      });

    const viPromises = phraseNodes.map(async (pn) => ({
      title: {
        content: this.graphSecondLayerService.getNodePropertyValue(pn, 'name'),
        upVote: 0, //TODO: 0 is a mocked value, replace it when voting is ready
        downVote: 0, //TODO: 0 is a mocked value, replace it when voting is ready
        id: pn.id,
      } as VotableContent,
      contents: await this.getDefinitionsAsVotableContent(pn.id),
    }));
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
    const viPromises = wordNodes.map(async (wn) => ({
      title: {
        content: this.graphSecondLayerService.getNodePropertyValue(wn, 'name'),
        upVote: 0, //TODO: 0 is a mocked value, replace it when voting is ready
        downVote: 0, //TODO: 0 is a mocked value, replace it when voting is ready
        id: wn.id,
      } as VotableContent,
      contents: await this.getDefinitionsAsVotableContent(wn.id),
    }));
    const vi = await Promise.all(viPromises);
    return vi;
  }

  async getLanguages(): Promise<LanguageDto[]> {
    return this.graphThirdLayerService.getLanguages();
  }

  async updateDefinition(
    definitionNodeId: Nanoid,
    newDefinitionValue: string,
  ): Promise<void> {
    this.graphSecondLayerService.updateNodeObject(definitionNodeId, {
      [PropertyKeyConst.TEXT]: newDefinitionValue,
    });
  }
}
