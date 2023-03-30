import {
  NodeTypeConst,
  PropertyKeyConst,
  RelationshipTypeConst,
} from '../constants/graph.constant';
import { LanguageDto } from '../dtos/lang.dto';
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

  async getDefinitionIdByText(definitionText: string): Promise<Nanoid | null> {
    try {
      const existingDefinitionNode =
        await this.graphFirstLayerService.getNodeByProp(
          NodeTypeConst.DEFINITION,
          {
            key: PropertyKeyConst.TEXT,
            value: definitionText,
          },
        );

      if (!existingDefinitionNode) {
        return null;
      }

      return existingDefinitionNode.id;
    } catch (err) {
      console.error(err);
      throw new Error(
        `Failed to get getFirstDefinitionByText '${definitionText}'`,
      );
    }
  }

  async createDefinition(
    definitionText: string,
    wordId: string,
  ): Promise<Nanoid> {
    const existingDefinitionId = await this.getDefinitionIdByText(
      definitionText,
    );

    if (existingDefinitionId) {
      return existingDefinitionId;
    }

    const { node } =
      await this.graphSecondLayerService.createRelatedToNodeFromObject(
        RelationshipTypeConst.WORD_TO_DEFINITION,
        {},
        wordId,
        NodeTypeConst.DEFINITION,
        { [PropertyKeyConst.TEXT]: definitionText },
      );

    return node.id;
  }

  async createWord(word: string, langId: Nanoid): Promise<Nanoid> {
    return this.graphThirdLayerService.createWord(word, langId);
  }

  async getDefinitionsAsVotableContent(
    wordNodeId: string,
  ): Promise<Array<VotableContent>> {
    const definitionNodes = await this.graphFirstLayerService.getNodesOfType(
      NodeTypeConst.DEFINITION,
      {
        to_node_id: wordNodeId,
        relationship_type: RelationshipTypeConst.WORD_TO_DEFINITION,
      },
    );
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

  async getWordsAsVotableItems(
    langNodeId: string,
  ): Promise<Array<VotableItem>> {
    const words = await this.graphThirdLayerService.getWords({
      to_node_id: langNodeId,
      relationship_type: RelationshipTypeConst.WORD_TO_LANG,
    });
    const viPromises = words.map(async (w) => ({
      title: {
        content: this.graphSecondLayerService.getNodePropertyValue(w, 'name'),
        upVote: 0, //TODO: 0 is a mocked value, replace it when voting is ready
        downVote: 0, //TODO: 0 is a mocked value, replace it when voting is ready
      } as VotableContent,
      contents: await this.getDefinitionsAsVotableContent(w.id),
    }));
    const vi = await Promise.all(viPromises);
    return vi;
  }

  async getLanguages(): Promise<LanguageDto[]> {
    return this.graphThirdLayerService.getLanguages();
  }
}
