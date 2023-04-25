import { GraphFirstLayerService } from './graph-first-layer.service';
import { GraphSecondLayerService } from './graph-second-layer.service';

import {
  PropertyKeyConst,
  NodeTypeConst,
  RelationshipTypeConst,
} from '@/constants/graph.constant';

export class PhraseService {
  constructor(
    private readonly graphFirstLayerService: GraphFirstLayerService,
    private readonly graphSecondLayerService: GraphSecondLayerService,
  ) {}

  async createOrFindPhrase({
    phrase,
    languageId,
    siteText,
  }: {
    phrase: string;
    languageId: Nanoid;
    siteText?: boolean;
  }): Promise<Nanoid> {
    const phraseId = await this.getPhrase(phrase, languageId);

    if (phraseId) {
      return phraseId;
    }

    const { node } =
      await this.graphSecondLayerService.createRelatedFromNodeFromObject(
        RelationshipTypeConst.PHRASE_TO_LANG,
        {},
        NodeTypeConst.PHRASE,
        {
          [PropertyKeyConst.PHRASE]: phrase,
          [PropertyKeyConst.SITE_TEXT]: siteText,
        },
        languageId,
      );

    return node.id;
  }

  async getPhrase(phrase: string, languageId: Nanoid): Promise<Nanoid | null> {
    const phraseNode = await this.graphFirstLayerService.getNodeByProp(
      NodeTypeConst.PHRASE,
      {
        key: PropertyKeyConst.PHRASE,
        value: phrase,
      },
      {
        to_node_id: languageId,
      },
    );

    if (!phraseNode) {
      return null;
    }

    return phraseNode.id;
  }
}
