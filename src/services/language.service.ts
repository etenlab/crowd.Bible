import { GraphFirstLayerService } from './graph-first-layer.service';
import { GraphSecondLayerService } from './graph-second-layer.service';

import { PropertyKeyConst, NodeTypeConst } from '@/constants/graph.constant';

import { LanguageDto } from '@/dtos/language.dto';

import { LanguageMapper } from '@/mappers/language.mapper';

export class LanguageService {
  constructor(
    private readonly graphFirstLayerService: GraphFirstLayerService,
    private readonly graphSecondLayerService: GraphSecondLayerService,
  ) {}

  async createOrFindLanguage(language: string): Promise<Nanoid> {
    const lang_id = await this.getLanguage(language);

    if (lang_id) {
      return lang_id;
    }

    const node = await this.graphSecondLayerService.createNodeFromObject(
      NodeTypeConst.LANGUAGE,
      {
        name: language,
      },
    );

    return node.id;
  }

  async getLanguage(name: string): Promise<Nanoid | null> {
    const langNode = await this.graphFirstLayerService.getNodeByProp(
      NodeTypeConst.LANGUAGE,
      { key: PropertyKeyConst.NAME, value: name },
    );

    if (!langNode) {
      return null;
    }

    return langNode.id;
  }

  async getLanguages(): Promise<LanguageDto[]> {
    const langNodes = await this.graphFirstLayerService.listAllNodesByType(
      NodeTypeConst.LANGUAGE,
    );

    return langNodes.map(LanguageMapper.entityToDto);
  }
}
