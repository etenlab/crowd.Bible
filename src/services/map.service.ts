import {
  GraphFirstLayerService,
  GraphSecondLayerService,
  LoggerService,
  NodeTypeConst,
  PropertyKeyConst,
  RelationshipTypeConst,
} from '@eten-lab/core';
import { parseSync as readSvg } from 'svgson';

import { WordService } from './word.service';

import { MapDto } from '@/dtos/map.dto';
import { MapMapper } from '@/mappers/map.mapper';
import { LanguageInfo } from '@eten-lab/ui-kit';

import { makeFindPropsByLang } from '@/utils/langUtils';

import { type INode } from 'svgson';

const TEXTY_INODE_NAMES = ['text', 'textPath']; // Final nodes of text. All children nodes' values will be gathered and concatenated into one value
const SKIP_INODE_NAMES = ['rect', 'style', 'clipPath', 'image', 'rect']; // Nodes that definitenly don't contain any text. skipped for a performance purposes.

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
      [PropertyKeyConst.NAME]: string;
      [PropertyKeyConst.MAP_FILE_ID]: string;
      [PropertyKeyConst.EXT]: string;
      [PropertyKeyConst.IS_PROCESSING_FINISHED]: boolean;
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

  /** creates words and links them with map (or add links to existing words) */
  async processMapWords(
    words: string[],
    langInfo: LanguageInfo,
    mapId: string,
  ): Promise<void> {
    if (!words.length || !langInfo) return;
    const start = performance.now();
    let hasNextBatch = true;
    let batchNumber = 0;
    const batchItemCount = 1000;
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
    this.logger.info('total created or re-linked words ', createdWords.length);
    const end = performance.now();
    this.logger.trace(
      { at: 'map.service#processMapWords' },
      `processing has taken, ms: ${end - start}`,
    );
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

  /**
   * Since we must concatenate word if it is divided into several subtags inside some texty tag,
   * we also have transformed file with replaced (concatenated) each texty tag.
   */
  parseSvgMapString(originalSvgString: string): {
    transformedSvgINode: INode;
    foundWords: string[];
  } {
    const svgAsINode = readSvg(originalSvgString);
    const foundWords: string[] = [];
    this.iterateOverINode(svgAsINode, SKIP_INODE_NAMES, (node) => {
      if (TEXTY_INODE_NAMES.includes(node.name)) {
        let currNodeAllText = node.value || '';
        if (node.children && node.children.length > 0) {
          this.iterateOverINode(node, [], (subNode) => {
            currNodeAllText += subNode.value;
          });
          node.children = [
            {
              value: currNodeAllText,
              type: 'text',
              name: '',
              children: [],
              attributes: {},
            },
          ]; // mutate svgAsINode, if node is texty and has children nodes, make it text with concatanated value from children's balues
        }

        if (!currNodeAllText) return;
        if (currNodeAllText.trim().length <= 1) return;
        if (!isNaN(Number(currNodeAllText))) return;
        const isExist = foundWords.findIndex((w) => w === currNodeAllText);
        if (isExist < 0) {
          foundWords.push(currNodeAllText);
        }
      }
    });
    return {
      transformedSvgINode: svgAsINode,
      foundWords,
    };
  }

  /**
   * Mutetes INode sturcture - replaces subnodes' values using provided valuesToReplace
   * @param iNodeStructure INode structure to replace values inside it.
   * @param valuesToReplace
   */
  replaceINodeTagValues(
    iNodeStructure: INode,
    valuesToReplace: { source: string; translation: string }[],
  ): void {
    this.iterateOverINode(iNodeStructure, SKIP_INODE_NAMES, (node) => {
      const idx = valuesToReplace.findIndex(
        ({ source }) => source === node.value,
      );
      if (idx < 0) return;
      node.value = valuesToReplace[idx].translation;
    });
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
