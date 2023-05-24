import { FindOptionsWhere } from 'typeorm';

import { GraphFirstLayerService } from './graph-first-layer.service';
import { GraphSecondLayerService } from './graph-second-layer.service';

import {
  PropertyKeyConst,
  NodeTypeConst,
  RelationshipTypeConst,
  MainKeyName,
} from '@/constants/graph.constant';

import { Node, Relationship } from '@/src/models';

import { WordDto } from '@/dtos/word.dto';
import { WordMapper } from '@/mappers/word.mapper';

import { LanguageInfo } from '@eten-lab/ui-kit';

import { NodeRepository } from '@/repositories/node/node.repository';
import { makeFindPropsByLang } from '@/utils/langUtils';
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
        toNodeRelationships: relQuery,
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
    mapId?: Nanoid,
  ): Promise<Nanoid[]> {
    const wordNodesPromises = words.map((word) => {
      return this.createWordOrPhraseWithLang(
        word,
        langInfo,
        NodeTypeConst.WORD,
      );
    });
    return Promise.all(wordNodesPromises);
  }

  async createWordsWithLangForMap(
    words: string[],
    langInfo: LanguageInfo,
    mapId: Nanoid,
  ): Promise<Nanoid[]> {
    const wordNodeIds = await this.createWordsWithLang(words, langInfo);
    for (const wordNodeId of wordNodeIds) {
      await this.graphSecondLayerService.createRelationshipFromObject(
        RelationshipTypeConst.WORD_MAP,
        {},
        wordNodeId,
        mapId,
      );
    }
    return wordNodeIds;
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

  async createWordOrPhraseWithLang(
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
