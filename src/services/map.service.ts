import {
  GraphFirstLayerService,
  GraphSecondLayerService,
  LoggerService,
} from '@eten-lab/core';

import { WordService } from './word.service';

import {
  NodeTypeConst,
  PropertyKeyConst,
  RelationshipTypeConst,
} from '@eten-lab/core';

import { MapDto } from '@/dtos/map.dto';
import { MapMapper } from '@/mappers/map.mapper';
import { LanguageInfo } from '@eten-lab/ui-kit';

import { makeFindPropsByLang } from '@/utils/langUtils';

import { type INode } from 'svgson';
export class MapService {
  constructor(
    private readonly graphFirstLayerService: GraphFirstLayerService,
    private readonly graphSecondLayerService: GraphSecondLayerService,
    private readonly wordService: WordService,
    private readonly logger: LoggerService,
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

  async getMaps(langInfo?: LanguageInfo): Promise<MapDto[]> {
    let mapNodeIds: Nanoid[];
    if (langInfo) {
      mapNodeIds = await this.graphFirstLayerService.getNodeIdsByProps(
        NodeTypeConst.MAP,
        makeFindPropsByLang(langInfo),
      );
    } else {
      mapNodeIds = (
        await this.graphFirstLayerService.listAllNodesByType(NodeTypeConst.MAP)
      ).map((n) => n.id);
    }
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

  async processMapWords(
    words: string[],
    langInfo: LanguageInfo,
    mapId: string,
  ) {
    if (!words.length || !langInfo) return;
    let hasNextBatch = true;
    let batchNumber = 0;
    const batchItemCount = 100;
    const createdWords = [];
    while (hasNextBatch) {
      const startIdx = batchNumber * batchItemCount;
      const endIdx = startIdx + batchItemCount;
      const batchWords = words.slice(startIdx, endIdx);
      createdWords.push(
        ...(await this.wordService.createWordsWithLangForMap(
          batchWords.map((w) => w.trim()).filter((w) => w !== ''),
          langInfo,
          mapId,
        )),
      );
      if (batchWords.length !== batchItemCount) {
        hasNextBatch = false;
      }
      batchNumber++;
    }
    this.logger.info('total created words', createdWords);
  }

  async doesExistMapWithProps(
    props: Array<{
      key: string;
      value: unknown;
    }>,
  ): Promise<boolean> {
    const foundNodeIds = await this.graphFirstLayerService.getNodeIdsByProps(
      NodeTypeConst.MAP,
      props,
    );
    return !!foundNodeIds[0];
  }

  iterateOverINode(
    node: INode,
    skipNodeNames: string[],
    cb: (node: INode) => void,
  ) {
    if (skipNodeNames.includes(node.name)) return;
    cb(node);
    for (const child of node.children || []) {
      this.iterateOverINode(child, skipNodeNames, cb);
    }
  }
}
