import { NodeRepository } from '../repositories/node/node.repository';
import { NodeService } from './node.service';

export enum DefinitionNodeKeys {
  ID = 'id',
  TEXT = 'text',
}

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
}
