import { NodeTypeConst } from '../constants/node-type.constant';
import { NodeType } from '../models';
import { NodeRepository } from '../repositories/node/node.repository';
import { NodeService } from './node.service';

export enum DefinitionNodeKeys {
  ID = 'id',
  TEXT = 'text',
}
export type VotableContent = {
  content: string;
  upVote: number;
  downVote: number;
};

export type VotableItem = {
  title: VotableContent;
  contents: VotableContent[];
};

export class DefinitionService {
  constructor(
    private readonly nodeService: NodeService,
    private readonly nodeRepo: NodeRepository,
  ) {}

  async getFirstDefinitionNodeId(
    definitionValue: string,
    languageNodeId: TStringUUID,
  ): Promise<TStringUUID | null> {
    try {
      const [definitionNodes, count] = await this.nodeRepo.getAllByProp({
        nodeType: 'definition',
        prop: {
          propertyKey: DefinitionNodeKeys.TEXT,
          propertyValue: definitionValue,
        },
        onlyWithRelToNodeId: languageNodeId,
      });

      if (!(count > 0)) {
        return null;
      }

      return definitionNodes[0].id;
    } catch (err) {
      console.error(err);
      throw new Error(
        `Failed to get getFirstDefinitionNodeId '${definitionValue} - ${languageNodeId}'`,
      );
    }
  }

  async createDefinition(
    definitionValue: string,
    languageNodeId: TStringUUID,
  ): Promise<TStringUUID> {
    const existingDefinitionUUID = await this.getFirstDefinitionNodeId(
      definitionValue,
      languageNodeId,
    );

    if (existingDefinitionUUID) {
      return existingDefinitionUUID;
    }

    const { node } = await this.nodeService.createRelatedFromNodeFromObject(
      languageNodeId,
      'definition',
      'definition-to-language-entry',
      { [DefinitionNodeKeys.TEXT]: definitionValue },
    );

    return node.id;
  }

  async getDefinitionsAsVotableContent(
    wordNodeId: string,
  ): Promise<Array<VotableContent>> {
    const definitions = await this.nodeService.getNodesOfType(
      NodeTypeConst.DEFINITION,
      {
        to_node_id: wordNodeId,
        relationship_type: NodeTypeConst.WORD_TO_DEFINITION,
      },
    );
    const vc: VotableContent[] = definitions.map((d) => ({
      content: this.nodeService.getNodePropertyValue(
        d,
        DefinitionNodeKeys.TEXT,
      ),
      upVote: 0,
      downVote: 0,
    }));
    return vc;
  }

  async getWordsAsVotableItems(
    langNodeId: string,
  ): Promise<Array<VotableItem>> {
    const words = await this.nodeService.getWords({
      to_node_id: langNodeId,
      relationship_type: NodeTypeConst.WORD_TO_LANG,
    });
    const viPromises = words.map(async (w) => ({
      title: {
        content: this.nodeService.getNodePropertyValue(w, 'name'),
        upVote: 0, //TODO: 0 is a mocked value, replace it when voting is ready
        downVote: 0, //TODO: 0 is a mocked value, replace it when voting is ready
      } as VotableContent,
      contents: await this.getDefinitionsAsVotableContent(w.id),
    }));
    const vi = await Promise.all(viPromises);
    return vi;
  }
}
