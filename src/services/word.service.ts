import { FindOptionsWhere, In } from 'typeorm';

import { SyncService } from './sync.service';

import { GraphFirstLayerService } from './graph-first-layer.service';
import { GraphSecondLayerService } from './graph-second-layer.service';

import {
  PropertyKeyConst,
  NodeTypeConst,
  RelationshipTypeConst,
} from '@/constants/graph.constant';

import {
  Node,
  Relationship,
  NodePropertyKey,
  NodePropertyValue,
} from '@/src/models';

import { WordDto } from '@/dtos/word.dto';
import { WordMapper } from '@/mappers/word.mapper';

import { CreateWordDto } from '@/dtos/create-word.dto';
import { LanguageInfo } from '@eten-lab/ui-kit/dist/LangSelector/LangSelector';

import { NodeRepository } from '@/repositories/node/node.repository';
import { NodePropertyKeyRepository } from '@/repositories/node/node-property-key.repository';
import { NodePropertyValueRepository } from '@/repositories/node/node-property-value.repository';
import { RelationshipRepository } from '@/repositories/relationship/relationship.repository';
export class WordService {
  constructor(
    private readonly graphFirstLayerService: GraphFirstLayerService,
    private readonly graphSecondLayerService: GraphSecondLayerService,

    private readonly nodeRepo: NodeRepository,
    private readonly pkRepo: NodePropertyKeyRepository,
    private readonly pvRepo: NodePropertyValueRepository,
    private readonly relRepo: RelationshipRepository,

    private readonly syncService: SyncService,
  ) {}

  /**
   * @deprecated
   * never use this function
   */
  async wordsExist(
    words: string[],
    langId: Nanoid,
  ): Promise<{ [key: string]: string }> {
    const nodes = await this.nodeRepo.repository.find({
      relations: [
        'propertyKeys',
        'propertyKeys.propertyValue',
        'toNodeRelationships',
      ],
      where: {
        node_type: NodeTypeConst.WORD,
        propertyKeys: {
          property_key: PropertyKeyConst.NAME,
          propertyValue: {
            property_value: In(words.map((w) => JSON.stringify({ value: w }))),
          },
        },
        toNodeRelationships: {
          to_node_id: langId,
          relationship_type: RelationshipTypeConst.WORD_TO_LANG,
        },
      },
    });
    const storedWordStatus: { [key: string]: string } = {};
    for (const node of nodes) {
      const storedWord = JSON.parse(
        node.propertyKeys?.at(0)?.propertyValue?.property_value || '{}',
      )?.value;
      const idx = words.findIndex((w) => w === storedWord);
      if (idx > -1) {
        storedWordStatus[storedWord] = node.id;
      }
    }
    return storedWordStatus;
  }

  /**
   * @deprecated
   * Use createWordsWithLang() instead.
   */
  async createWord(
    word: string,
    langId: Nanoid,
    mapId?: Nanoid,
  ): Promise<Nanoid> {
    const word_id = await this.getWord(word, langId);

    if (word_id) {
      return word_id;
    }

    const { node } =
      await this.graphSecondLayerService.createRelatedFromNodeFromObject(
        RelationshipTypeConst.WORD_TO_LANG,
        {},
        NodeTypeConst.WORD,
        { [PropertyKeyConst.NAME]: word },
        langId,
      );

    if (mapId) {
      await this.graphSecondLayerService.createRelationshipFromObject(
        RelationshipTypeConst.WORD_MAP,
        {},
        node.id,
        mapId,
      );
    }

    return node.id;
  }

  /**
   * @deprecated
   * Use createWordsWithLang() instead.
   */
  async createWords(
    words: string[],
    langId: Nanoid,
    mapId?: Nanoid,
  ): Promise<Nanoid[]> {
    const storedWords = await this.wordsExist(words, langId);
    const syncLayer = this.syncService.syncLayer;
    const wordNodes: Node[] = [];
    const storableWords: string[] = [];
    for (const word of words) {
      if (storedWords[word]) continue;
      const node = new Node();
      node.node_type = NodeTypeConst.WORD;
      node.sync_layer = syncLayer;
      wordNodes.push(node);
      storableWords.push(word);
    }
    const wordNodeEntities = await this.nodeRepo.repository.save(wordNodes, {
      transaction: true,
    });

    const pkNodes: NodePropertyKey[] = [];
    for (const entity of wordNodeEntities) {
      const node = new NodePropertyKey();
      node.node_id = entity.id;
      node.property_key = PropertyKeyConst.NAME;
      node.sync_layer = syncLayer;
      pkNodes.push(node);
    }
    const pkNodeEntities = await this.pkRepo.bulkSave(pkNodes);

    const pvNodes: NodePropertyValue[] = [];
    let idx = 0;
    for (const entity of pkNodeEntities) {
      const node = new NodePropertyValue();
      node.node_property_key_id = entity.id;
      node.property_value = JSON.stringify({ value: storableWords[idx++] });
      node.sync_layer = syncLayer;
      pvNodes.push(node);
    }
    await this.pvRepo.repository.save(pvNodes, {
      transaction: true,
    });

    const relEntities: Relationship[] = [];
    for (const entity of wordNodeEntities) {
      const rel1 = new Relationship();
      rel1.from_node_id = entity.id;
      rel1.to_node_id = langId;
      rel1.relationship_type = RelationshipTypeConst.WORD_TO_LANG;
      rel1.sync_layer = syncLayer;
      relEntities.push(rel1);

      if (mapId) {
        const rel2 = new Relationship();
        rel2.from_node_id = entity.id;
        rel2.to_node_id = mapId;
        rel2.relationship_type = RelationshipTypeConst.WORD_MAP;
        rel2.sync_layer = syncLayer;
        relEntities.push(rel2);
      }
    }
    await this.relRepo.repository.save(relEntities, { transaction: true });

    const wordIds = [];
    idx = 0;
    for (const w of words) {
      if (storedWords[w]) wordIds.push(storedWords[w]);
      else wordIds.push(wordNodes[idx++]?.id);
    }
    return wordIds;
  }

  /**
   * @todo
   * Need to refactor.
   */
  async getWord(word: string, language: Nanoid): Promise<Nanoid | null> {
    const wordNode = await this.graphFirstLayerService.getNodeByProp(
      NodeTypeConst.WORD,
      {
        key: PropertyKeyConst.WORD,
        value: word,
      },
      {
        to_node_id: language,
      },
    );

    if (!wordNode) {
      return null;
    }

    return wordNode.id;
  }

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

  async getUnTranslatedWords() {
    return this.getWords(
      [
        {
          relationship_type: In([RelationshipTypeConst.WORD_MAP]),
        },
      ],
      [
        'toNodeRelationships.fromNode',
        'toNodeRelationships.fromNode.toNodeRelationships',
        'toNodeRelationships.fromNode.toNodeRelationships.toNode',
        'toNodeRelationships.fromNode.toNodeRelationships.toNode.propertyKeys',
        'toNodeRelationships.fromNode.toNodeRelationships.toNode.propertyKeys.propertyValue',
        'toNodeRelationships.fromNode.toNodeRelationships.toNode.toNodeRelationships',
      ],
    );
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
        mapId,
        NodeTypeConst.WORD,
      );
    });
    return Promise.all(wordNodesPromises);
  }

  async createWordOrPhraseWithLang(
    word: string,
    langInfo: LanguageInfo,
    mapId?: Nanoid,
    nodeType: NodeTypeConst = NodeTypeConst.WORD,
  ): Promise<Nanoid> {
    const word_id = await this.getWordOrPhraseWithLang(word, langInfo);
    if (word_id) {
      return word_id;
    }
    const wordNodeObject: CreateWordDto = {
      [PropertyKeyConst.NAME]: word,
      [PropertyKeyConst.LANGUAGE_TAG]: langInfo.lang.tag,
    };
    if (langInfo.dialect?.tag) {
      wordNodeObject[PropertyKeyConst.DIALECT_TAG] = langInfo.dialect?.tag;
    }
    if (langInfo.region?.tag) {
      wordNodeObject[PropertyKeyConst.REGION_TAG] = langInfo.region?.tag;
    }

    const node = await this.graphSecondLayerService.createNodeFromObject(
      nodeType as string,
      wordNodeObject,
    );
    if (mapId) {
      await this.graphSecondLayerService.createRelationshipFromObject(
        RelationshipTypeConst.WORD_MAP,
        {},
        node.id,
        mapId,
      );
    }
    return node.id;
  }

  async getWordOrPhraseWithLang(
    word: string,
    languageInfo: LanguageInfo,
    nodeType: NodeTypeConst = NodeTypeConst.WORD,
  ): Promise<Nanoid | null> {
    const wordSearchProps = [
      {
        key: PropertyKeyConst.NAME,
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

    const wordNodeIds = await this.graphFirstLayerService.getNodeIdsByProps(
      nodeType as string,
      wordSearchProps,
    );
    if (wordNodeIds.length === 0) {
      return null;
    }
    return wordNodeIds[0];
  }
}
