import { GraphFirstLayerService } from './graph-first-layer.service';
import { GraphSecondLayerService } from './graph-second-layer.service';

import { WordService } from './word.service';

import {
  NodeTypeConst,
  PropertyKeyConst,
  RelationshipTypeConst,
} from '@/constants/graph.constant';

import { MapDto } from '@/dtos/map.dto';
import { MapMapper } from '@/mappers/map.mapper';
import { LanguageInfo } from '@eten-lab/ui-kit';

import { makeFindPropsByLang } from '@/utils/langUtils';
export class MapService {
  constructor(
    private readonly graphFirstLayerService: GraphFirstLayerService,
    private readonly graphSecondLayerService: GraphSecondLayerService,

    private readonly wordService: WordService,
  ) {}

  async saveMap(
    langInfo: LanguageInfo,
    mapInfo: {
      name: string;
      mapFileId: string;
      ext: string;
    },
  ): Promise<Nanoid | null> {
    const langProps: { [key: string]: string } = {
      [PropertyKeyConst.LANGUAGE_TAG]: langInfo.lang.tag,
    };
    if (langInfo?.dialect?.tag) {
      langProps[PropertyKeyConst.DIALECT_TAG] = langInfo.dialect.tag;
    }
    if (langInfo?.region?.tag) {
      langProps[PropertyKeyConst.REGION_TAG] = langInfo.region.tag;
    }

    const mapNode = await this.graphSecondLayerService.createNodeFromObject(
      NodeTypeConst.MAP,
      {
        ...mapInfo,
        ...langProps,
      },
    );
    return mapNode.id;
  }

  async getMap(mapId: Nanoid): Promise<MapDto | null> {
    const langNode = await this.graphFirstLayerService.readNode(mapId, [
      'propertyKeys',
      'propertyKeys.propertyValue',
    ]);

    if (!langNode) {
      return null;
    }

    return MapMapper.entityToDto(langNode);
  }

  async getMaps(langInfo: LanguageInfo): Promise<MapDto[]> {
    const mapNodeIds = await this.graphFirstLayerService.getNodeIdsByProps(
      NodeTypeConst.MAP,
      makeFindPropsByLang(langInfo),
    );
    const mapNodes = await this.graphFirstLayerService.getNodesByIds(
      mapNodeIds,
    );
    const dtos = mapNodes.map((node) => MapMapper.entityToDto(node));
    return dtos;
  }

  async getMapWords(mapId: Nanoid) {
    return this.wordService.getWords({
      to_node_id: mapId,
      relationship_type: RelationshipTypeConst.WORD_MAP,
    });
  }
}
