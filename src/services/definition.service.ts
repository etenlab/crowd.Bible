import { NodeRepository } from '../repositories/node/node.repository';
import { NodeService } from './node.service';

const PROP_KEY_FOR_DEFINITION_TEXT = 'text';

export class DefinitionService {
  constructor(
    private readonly nodeService: NodeService,
    private readonly nodeRepo: NodeRepository,
  ) {}

  async getFirstDefinitionNodeID(
    definitionValue: string,
    languageNodeId: TStringUUID,
  ): Promise<TStringUUID | null> {
    try {
      const [definitionNodes, count] = await this.nodeRepo.getAllByProp({
        nodeType: 'definition',
        prop: {
          propertyKey: PROP_KEY_FOR_DEFINITION_TEXT,
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
        `Failed to get getFirstDefinitionNodeID '${definitionValue} - ${languageNodeId}'`,
      );
    }
  }

  async createDefinition(
    definitionValue: string,
    languageNodeId: TStringUUID,
  ): Promise<TStringUUID> {
    const existingDefinitionUUID = await this.getFirstDefinitionNodeID(
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
      { [PROP_KEY_FOR_DEFINITION_TEXT]: definitionValue },
    );

    return node.id;
  }
}
