import { FindOptionsWhere } from 'typeorm';

import {
  GraphFirstLayerService,
  GraphSecondLayerService,
  NodeRepository,
} from '@eten-lab/core';

import {
  PropertyKeyConst,
  NodeTypeConst,
  RelationshipTypeConst,
  MainKeyName,
  LoggerService,
} from '@eten-lab/core';

import { Node, Relationship } from '@/src/models';

import { WordDto } from '@/dtos/word.dto';
import { WordMapper } from '@/mappers/word.mapper';

import { LanguageInfo } from '@eten-lab/ui-kit';

import { makeFindPropsByLang } from '@/utils/langUtils';

const logger = new LoggerService();
export class WordService {
  constructor(
    private readonly graphFirstLayerService: GraphFirstLayerService,
    private readonly graphSecondLayerService: GraphSecondLayerService,
    private readonly nodeRepo: NodeRepository,
  ) {}

  /**
   * @todo make this function more simple, don't directly call repository functions
   * Use graphFirstLayerService
   */
  async getWords(
    relQuery?:
      | FindOptionsWhere<Relationship>
      | FindOptionsWhere<Relationship>[],
    additionalRelations: string[] = [],
  ): Promise<Node[]> {
    const wordNodes = await this.nodeRepo.repository.find({
      relations: [
        'propertyKeys',
        'propertyKeys.propertyValue',
        'toNodeRelationships',
        ...additionalRelations,
      ],
      where: {
        node_type: NodeTypeConst.WORD,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toNodeRelationships: relQuery as any,
      },
    });

    return wordNodes;
  }

  async getWordById(wordId: Nanoid): Promise<WordDto | null> {
    const nodeEntity = await this.graphFirstLayerService.readNode(wordId, [
      'propertyKeys',
      'propertyKeys.propertyValue',
      'toNodeRelationships',
      'toNodeRelationships.toNode',
    ]);

    if (!nodeEntity) {
      return null;
    }

    return WordMapper.entityToDto(nodeEntity);
  }

  async createWordTranslationRelationship(
    from: Nanoid,
    to: Nanoid,
  ): Promise<Nanoid> {
    const translation = await this.graphFirstLayerService.findRelationship(
      from,
      to,
      RelationshipTypeConst.WORD_TO_TRANSLATION,
    );

    if (translation) {
      return translation.id;
    }

    const new_translation =
      await this.graphSecondLayerService.createRelationshipFromObject(
        RelationshipTypeConst.WORD_TO_TRANSLATION,
        {},
        from,
        to,
      );

    return new_translation.id;
  }

  async createWordsWithLang(
    words: string[],
    langInfo: LanguageInfo,
  ): Promise<Nanoid[]> {
    const wordNodes = await this.createWordsOrPhrasesWithLang(
      words,
      langInfo,
      NodeTypeConst.WORD,
    );
    return wordNodes;
  }

  async createWordsWithLangForMap(
    words: string[],
    langInfo: LanguageInfo,
    mapId: Nanoid,
  ): Promise<Nanoid[]> {
    const wordsAsPropValues = words.map((w) => JSON.stringify({ value: w }));
    const langRestricions = [
      {
        key: PropertyKeyConst.LANGUAGE_TAG,
        value: JSON.stringify({ value: langInfo.lang.tag }),
      },
    ];
    if (langInfo.dialect?.tag) {
      langRestricions.push({
        key: PropertyKeyConst.DIALECT_TAG,
        value: JSON.stringify({ value: langInfo.dialect.tag }),
      });
    }
    if (langInfo.region?.tag) {
      langRestricions.push({
        key: PropertyKeyConst.REGION_TAG,
        value: JSON.stringify({ value: langInfo.region.tag }),
      });
    }
    const time10 = performance.now();
    logger.trace({ time10 }, ' time10:', time10);
    const existingWordsInfo: Array<{ value: string; nodeId: Nanoid }> =
      await this.graphFirstLayerService.findExistingNodesWithProps(
        NodeTypeConst.WORD,
        MainKeyName[NodeTypeConst.WORD],
        wordsAsPropValues,
        langRestricions,
      );
    const existingWordNodeIds: Nanoid[] = [];
    const existingWords: string[] = [];
    for (const wordInfo of existingWordsInfo) {
      existingWordNodeIds.push(wordInfo.nodeId);
      existingWords.push(JSON.parse(wordInfo.value).value);
    }

    const unexistingWords = wordsAsPropValues
      .map((w) => JSON.parse(w).value)
      .filter((w) => !existingWords.includes(w));

    const newWordNodeIds = await this.createWordsWithLang(
      unexistingWords,
      langInfo,
    );

    const time20 = performance.now();
    logger.trace({ time20 }, ' time20-time10:', time20 - time10);
    await this.graphFirstLayerService.createFromManyRelsNoChecks(
      [...newWordNodeIds, ...existingWordNodeIds],
      mapId,
      RelationshipTypeConst.WORD_MAP,
    );
    const time30 = performance.now();
    logger.trace({ time30 }, ' time30-time20:', time30 - time20);

    return newWordNodeIds;
  }

  async getWordsWithLang(langInfo: LanguageInfo): Promise<Node[] | null> {
    const langSearchProps = makeFindPropsByLang(langInfo);
    const nodes = await this.graphFirstLayerService.getNodesByProps(
      NodeTypeConst.WORD,
      langSearchProps,
    );
    return nodes;
  }

  async getWordsWithLangAndRelationships(
    langInfo: LanguageInfo,
    relationships: Array<RelationshipTypeConst>,
  ): Promise<Node[] | null> {
    const langSearchProps = makeFindPropsByLang(langInfo);
    const nodesIds = await this.nodeRepo.getNodesIdsByPropAndRelTypes(
      NodeTypeConst.WORD,
      langSearchProps,
      relationships,
    );
    const nodes =
      await this.graphFirstLayerService.getNodesWithRelationshipsByIds(
        nodesIds,
      );
    return nodes;
  }

  async createOrFindWordOrPhraseWithLang(
    value: string,
    langInfo: LanguageInfo,
    nodeType: NodeTypeConst.WORD | NodeTypeConst.PHRASE = NodeTypeConst.WORD,
  ): Promise<Nanoid> {
    const word_id = await this.getWordOrPhraseWithLang(value, langInfo);
    if (word_id) {
      return word_id;
    }
    const nodeObj = {
      [MainKeyName[nodeType]]: value,
      [PropertyKeyConst.LANGUAGE_TAG]: langInfo.lang.tag,
    };
    if (langInfo.dialect?.tag) {
      nodeObj[PropertyKeyConst.DIALECT_TAG] = langInfo.dialect?.tag;
    }
    if (langInfo.region?.tag) {
      nodeObj[PropertyKeyConst.REGION_TAG] = langInfo.region?.tag;
    }

    const node = await this.graphSecondLayerService.createNodeFromObject(
      nodeType as string,
      nodeObj,
    );
    return node.id;
  }

  /**
   * Doesn't check if word/phrase already exists. So prepare data before passing.
   */
  async createWordsOrPhrasesWithLang(
    values: string[],
    langInfo: LanguageInfo,
    nodeType: NodeTypeConst.WORD | NodeTypeConst.PHRASE = NodeTypeConst.WORD,
  ): Promise<Array<Nanoid>> {
    const nodeObjs = values.map((value) => {
      const nodeObj = {
        [MainKeyName[nodeType]]: value,
        [PropertyKeyConst.LANGUAGE_TAG]: langInfo.lang.tag,
      };
      if (langInfo.dialect?.tag) {
        nodeObj[PropertyKeyConst.DIALECT_TAG] = langInfo.dialect?.tag;
      }
      if (langInfo.region?.tag) {
        nodeObj[PropertyKeyConst.REGION_TAG] = langInfo.region?.tag;
      }
      return nodeObj;
    });

    const nodeIds = await this.graphSecondLayerService.createNodesFromObjects(
      nodeType as string,
      nodeObjs,
    );
    return nodeIds;
  }

  async getWordOrPhraseWithLang(
    word: string,
    languageInfo: LanguageInfo,
    nodeType: NodeTypeConst.WORD | NodeTypeConst.PHRASE = NodeTypeConst.WORD,
  ): Promise<Nanoid | null> {
    const wordSearchProps = [
      {
        key: MainKeyName[nodeType],
        value: word,
      },
      {
        key: PropertyKeyConst.LANGUAGE_TAG,
        value: languageInfo.lang.tag,
      },
    ];
    if (languageInfo.dialect?.tag) {
      wordSearchProps.push({
        key: PropertyKeyConst.DIALECT_TAG,
        value: languageInfo.dialect.tag,
      });
    }
    if (languageInfo.region?.tag) {
      wordSearchProps.push({
        key: PropertyKeyConst.REGION_TAG,
        value: languageInfo.region.tag,
      });
    }

    const foundNodeIds = await this.graphFirstLayerService.getNodeIdsByProps(
      nodeType as string,
      wordSearchProps,
    );
    if (foundNodeIds.length === 0) {
      return null;
    }
    return foundNodeIds[0];
  }
}
