import { FindOptionsWhere, In } from 'typeorm';

import { GraphFirstLayerService } from './graph-first-layer.service';
import { GraphSecondLayerService } from './graph-second-layer.service';
import { NodeRepository } from '@/repositories/node/node.repository';

import { Node } from '@/models/node/node.entity';
import { Relationship } from '@/models/relationship/relationship.entity';

import { MapDto } from '../dtos/map.dto';
import { LanguageDto } from '../dtos/lang.dto';
import { MapMapper } from '../mappers/map.mapper';

import {
  NodeTypeConst,
  RelationshipTypeConst,
  PropertyKeyConst,
} from '@/constants/graph.constant';
import { NodePropertyKey, NodePropertyValue } from '../models';
import { NodePropertyKeyRepository } from '../repositories/node/node-property-key.repository';
import { NodePropertyValueRepository } from '../repositories/node/node-property-value.repository';
import { RelationshipRepository } from '../repositories/relationship/relationship.repository';

export class GraphThirdLayerService {
  constructor(
    private readonly firstLayerService: GraphFirstLayerService,
    private readonly secondLayerService: GraphSecondLayerService,
    private readonly nodeRepo: NodeRepository,
    private readonly pkRepo: NodePropertyKeyRepository,
    private readonly pvRepo: NodePropertyValueRepository,
    private readonly relRepo: RelationshipRepository,
  ) {}

  // -------- Document --------- //
  async createDocument(name: string): Promise<Document> {
    const document = await this.secondLayerService.createNodeFromObject(
      NodeTypeConst.DOCUMENT,
      {
        name,
      },
    );

    return {
      id: document.id,
      name,
    };
  }

  async getDocument(name: string): Promise<Document | null> {
    const document = await this.firstLayerService.getNodeByProp(
      NodeTypeConst.DOCUMENT,
      {
        key: PropertyKeyConst.NAME,
        value: name,
      },
    );

    if (document == null) {
      return null;
    }

    return {
      id: document.id,
      name,
    };
  }

  // --------- Word --------- //
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
      await this.secondLayerService.createRelatedFromNodeFromObject(
        RelationshipTypeConst.WORD_TO_LANG,
        {},
        NodeTypeConst.WORD,
        { name: word },
        langId,
      );

    if (mapId) {
      await this.secondLayerService.createRelationshipFromObject(
        RelationshipTypeConst.WORD_MAP,
        {},
        node.id,
        mapId,
      );
    }

    return node.id;
  }

  async createWords(
    words: string[],
    langId: Nanoid,
    mapId?: Nanoid,
  ): Promise<Nanoid[]> {
    const wordNodes: Node[] = [];
    for (const _word of words) {
      const node = new Node();
      node.node_type = NodeTypeConst.WORD;
      wordNodes.push(node);
    }
    const wordNodeEntities = await this.nodeRepo.repository.save(wordNodes, {
      transaction: true,
    });

    const pkNodes: NodePropertyKey[] = [];
    for (const entity of wordNodeEntities) {
      const node = new NodePropertyKey();
      node.node_id = entity.id;
      node.property_key = PropertyKeyConst.name;
      pkNodes.push(node);
    }
    const pkNodeEntities = await this.pkRepo.bulkSave(pkNodes);

    const pvNodes: NodePropertyValue[] = [];
    let idx = 0;
    for (const entity of pkNodeEntities) {
      const node = new NodePropertyValue();
      node.node_property_key_id = entity.id;
      node.property_value = JSON.stringify({ value: words[idx++] });
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
      relEntities.push(rel1);

      if (mapId) {
        const rel2 = new Relationship();
        rel2.from_node_id = entity.id;
        rel2.to_node_id = mapId;
        rel2.relationship_type = RelationshipTypeConst.WORD_MAP;
        relEntities.push(rel2);
      }
    }
    await this.relRepo.repository.save(relEntities, { transaction: true });

    return wordNodes.map((w) => w.id);
  }

  async getWord(word: string, language: Nanoid): Promise<Nanoid | null> {
    const wordNode = await this.firstLayerService.getNodeByProp(
      NodeTypeConst.WORD,
      {
        key: PropertyKeyConst.NAME,
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
        'nodeRelationships',
        ...additionalRelations,
      ],
      where: {
        node_type: NodeTypeConst.WORD,
        nodeRelationships: relQuery,
      },
    });

    return wordNodes;
  }

  async getMapWords(mapId: Nanoid) {
    return this.getWords({
      to_node_id: mapId,
      relationship_type: RelationshipTypeConst.WORD_MAP,
    });
  }

  async getUnTranslatedWords(langId: Nanoid) {
    // console.log('getUnTranslatedWords', langId);
    return this.getWords(
      [
        {
          relationship_type: In([RelationshipTypeConst.WORD_MAP]),
        },
      ],
      [
        'nodeRelationships.fromNode',
        'nodeRelationships.fromNode.nodeRelationships',
        'nodeRelationships.fromNode.nodeRelationships.toNode',
        'nodeRelationships.fromNode.nodeRelationships.toNode.propertyKeys',
        'nodeRelationships.fromNode.nodeRelationships.toNode.propertyKeys.propertyValue',
        'nodeRelationships.fromNode.nodeRelationships.toNode.nodeRelationships',
      ],
    );
  }

  // --------- Word-Translation --------- //
  async createWordTranslationRelationship(
    from: Nanoid,
    to: Nanoid,
  ): Promise<Nanoid> {
    const translation = await this.firstLayerService.findRelationship(
      from,
      to,
      RelationshipTypeConst.WORD_TO_TRANSLATION,
    );

    if (translation) {
      return translation.id;
    }

    const new_translation =
      await this.secondLayerService.createRelationshipFromObject(
        RelationshipTypeConst.WORD_TO_TRANSLATION,
        {},
        from,
        to,
      );

    return new_translation.id;
  }

  // --------- Word-Sequence --------- //
  async createWordSequence(
    text: string,
    document: Nanoid,
    creator: Nanoid,
    import_uid: string,
    language: Nanoid,
  ): Promise<Node> {
    const word_sequence = await this.secondLayerService.createNodeFromObject(
      NodeTypeConst.WORD_SEQUENCE,
      {
        [PropertyKeyConst.IMPORT_UID]: import_uid,
      },
    );

    const words = text.split(' ');

    for (const [i, word] of words.entries()) {
      const new_word_id = await this.createWord(word, language);
      await this.secondLayerService.createRelationshipFromObject(
        RelationshipTypeConst.WORD_SEQUENCE_TO_WORD,
        { position: i + 1 },
        word_sequence.id,
        new_word_id,
      );
    }

    await this.secondLayerService.createRelationshipFromObject(
      RelationshipTypeConst.WORD_SEQUENCE_TO_LANGUAGE_ENTRY,
      {},
      word_sequence.id,
      language,
    );

    await this.secondLayerService.createRelationshipFromObject(
      RelationshipTypeConst.WORD_SEQUENCE_TO_DOCUMENT,
      {},
      word_sequence.id,
      document,
    );

    await this.secondLayerService.createRelationshipFromObject(
      RelationshipTypeConst.WORD_SEQUENCE_TO_CREATOR,
      {},
      word_sequence.id,
      creator,
    );

    return word_sequence;
  }

  async getText(word_sequence_id: Nanoid): Promise<Nanoid | null> {
    const word_sequence = await this.nodeRepo.repository.findOne({
      relations: [
        'nodeRelationships',
        'nodeRelationships.toNode',
        'nodeRelationships.toNode.propertyKeys',
        'nodeRelationships.toNode.propertyKeys.propertyValue',
      ],
      where: {
        node_id: word_sequence_id,
      },
    });

    if (word_sequence == null || word_sequence.nodeRelationships == null) {
      return null;
    }

    const words: string[] = [];

    word_sequence.nodeRelationships.forEach((rel) => {
      if (
        rel.relationship_type === RelationshipTypeConst.WORD_SEQUENCE_TO_WORD
      ) {
        words.push(
          JSON.parse(
            rel.toNode.propertyKeys.find((key) => key.property_key === 'word')
              ?.propertyValue.property_value ?? '',
          ).value,
        );
      }
    });

    return words.join(' ');
  }

  // --------- Word-Sequence-Connection --------- //
  async appendWordSequence(from: Nanoid, to: Nanoid): Promise<Relationship> {
    const word_sequence_connection =
      await this.secondLayerService.createRelationshipFromObject(
        RelationshipTypeConst.WORD_SEQUENCE_TO_WORD_SEQUENCE,
        {},
        from,
        to,
      );

    return word_sequence_connection;
  }

  async getWordSequence(text: string): Promise<Nanoid[]> {
    const word_sequences = await this.nodeRepo.listAllNodesByType(
      NodeTypeConst.WORD_SEQUENCE,
    );
    const filtered_word_sequences = await Promise.all(
      word_sequences.filter(async (word_sequence) => {
        const word_sequence_text = await this.getText(word_sequence.id);
        return word_sequence_text === text;
      }),
    );

    return filtered_word_sequences.map((sequence) => sequence.id);
  }

  // --------- Word-Sequence-Translation --------- //
  async createWordSequenceTranslationRelationship(
    from: Nanoid,
    to: Nanoid,
  ): Promise<Nanoid> {
    const translation = await this.firstLayerService.findRelationship(
      from,
      to,
      RelationshipTypeConst.WORD_SEQUENCE_TO_TRANSLATION,
    );

    if (translation) {
      return translation.id;
    }

    const new_translation =
      await this.secondLayerService.createRelationshipFromObject(
        RelationshipTypeConst.WORD_SEQUENCE_TO_TRANSLATION,
        {},
        from,
        to,
      );

    return new_translation.id;
  }

  // --------- region language node --------- //
  async createLanguage(language: Nanoid): Promise<Nanoid> {
    const lang_id = await this.getLanguage(language);

    if (lang_id) {
      return lang_id;
    }

    const node = await this.secondLayerService.createNodeFromObject(
      NodeTypeConst.LANGUAGE,
      {
        name: language,
      },
    );

    return node.id;
  }

  async getLanguage(language: Nanoid): Promise<Nanoid | null> {
    const langNode = await this.nodeRepo.repository.findOne({
      relations: ['propertyKeys', 'propertyKeys.propertyValue'],
      where: {
        node_type: NodeTypeConst.LANGUAGE,
        propertyKeys: {
          property_key: PropertyKeyConst.NAME,
          propertyValue: {
            property_value: JSON.stringify({ value: language }),
          },
        },
      },
    });

    if (!langNode) {
      return null;
    }

    return langNode.id;
  }

  async getLanguages(): Promise<LanguageDto[]> {
    const langNodes = await this.nodeRepo.repository.find({
      relations: ['propertyKeys', 'propertyKeys.propertyValue'],
      where: {
        node_type: NodeTypeConst.LANGUAGE,
      },
    });

    const dtos: LanguageDto[] = [];

    for (const node of langNodes) {
      const strJson = node.propertyKeys.at(0)?.propertyValue?.property_value;

      if (strJson) {
        const valObj = JSON.parse(strJson);

        if (valObj.value) dtos.push({ id: node.id, name: valObj.value });
      }
    }

    return dtos;
  }

  // --------- region map node --------- //
  async saveMap(
    langId: Nanoid,
    mapInfo: {
      name: string;
      map: string;
      ext: string;
    },
  ): Promise<Nanoid | null> {
    const res = await this.secondLayerService.createRelatedFromNodeFromObject(
      NodeTypeConst.MAP_LANG,
      {},
      NodeTypeConst.MAP,
      mapInfo,
      langId,
    );
    return res.node.id;
  }

  async getMap(mapId: Nanoid): Promise<MapDto | null> {
    const langNode = await this.nodeRepo.repository.findOne({
      relations: ['propertyKeys', 'propertyKeys.propertyValue'],
      where: {
        id: mapId,
        node_type: NodeTypeConst.MAP,
      },
    });

    if (!langNode) {
      return null;
    }

    return MapMapper.entityToDto(langNode);
  }

  async getMaps(langId?: Nanoid) {
    const mapNodes = await this.nodeRepo.repository.find({
      relations: [
        'propertyKeys',
        'propertyKeys.propertyValue',
        'nodeRelationships',
      ],
      where: {
        node_type: NodeTypeConst.MAP,
        nodeRelationships: {
          relationship_type: NodeTypeConst.MAP_LANG,
          to_node_id: langId,
        },
      },
    });

    const dtos = mapNodes.map((node) => MapMapper.entityToDto(node));
    return dtos;
  }
}

interface Document {
  id?: string;
  name: string;
}
