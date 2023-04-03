import { FindOptionsWhere, In } from 'typeorm';

import { GraphFirstLayerService } from './graph-first-layer.service';
import { GraphSecondLayerService } from './graph-second-layer.service';
import { NodeRepository } from '@/repositories/node/node.repository';

import { type Node } from '@/models/node/node.entity';
import { type Relationship } from '@/models/relationship/relationship.entity';

import { MapDto } from '@/dtos/map.dto';
import { LanguageDto } from '@/dtos/language.dto';
import { DocumentDto } from '@/dtos/document.dto';
import { UserDto } from '@/dtos/user.dto';
import {
  WordSequenceDto,
  WordSequenceWithSubDto,
} from '@/dtos/word-sequence.dto';

import { MapMapper } from '@/mappers/map.mapper';
import { DocumentMapper } from '@/mappers/document.mapper';
import { LanguageMapper } from '@/mappers/language.mapper';
import { WordSequenceMapper } from '@/mappers/word-sequence.mapper';

import {
  NodeTypeConst,
  RelationshipTypeConst,
  PropertyKeyConst,
} from '@/constants/graph.constant';

export class GraphThirdLayerService {
  constructor(
    private readonly firstLayerService: GraphFirstLayerService,
    private readonly secondLayerService: GraphSecondLayerService,
    private readonly nodeRepo: NodeRepository,
  ) {}

  async createUser(email: string): Promise<UserDto> {
    const user = await this.getUser(email);

    if (user) {
      return user;
    }

    const newUser = await this.secondLayerService.createNodeFromObject(
      NodeTypeConst.USER,
      {
        email,
      },
    );

    return {
      id: newUser.id,
      email,
    };
  }

  async getUser(email: string): Promise<UserDto | null> {
    const user = await this.firstLayerService.getNodeByProp(
      NodeTypeConst.DOCUMENT,
      {
        key: PropertyKeyConst.EMAIL,
        value: email,
      },
    );

    if (user == null) {
      return null;
    }

    return {
      id: user.id,
      email,
    };
  }

  // -------- Document --------- //
  async createDocument(name: string): Promise<DocumentDto> {
    const document = await this.getDocument(name);

    if (document) {
      return document;
    }

    const newDocument = await this.secondLayerService.createNodeFromObject(
      NodeTypeConst.DOCUMENT,
      {
        name,
      },
    );

    return {
      id: newDocument.id,
      name,
    };
  }

  async getDocument(name: string): Promise<DocumentDto | null> {
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

  async listDocument(): Promise<DocumentDto[]> {
    const documents = await this.firstLayerService.listAllNodesByType(
      NodeTypeConst.DOCUMENT,
    );

    return documents.map(DocumentMapper.entityToDto);
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
    isOrigin = false,
    withWordsRelationship = true,
  ): Promise<Node> {
    const user = await this.firstLayerService.readNode(creator);

    if (!user) {
      throw new Error('Not exists given creator');
    }

    const word_sequence = await this.secondLayerService.createNodeFromObject(
      NodeTypeConst.WORD_SEQUENCE,
      {
        [PropertyKeyConst.WORD_SEQUENCE]: text,
        [PropertyKeyConst.DOCUMENT_ID]: document,
        [PropertyKeyConst.CREATOR_ID]: creator,
        [PropertyKeyConst.IMPORT_UID]: import_uid,
        [PropertyKeyConst.LANGUAGE_ID]: language,
        [PropertyKeyConst.IS_ORIGIN]: isOrigin,
      },
    );

    if (withWordsRelationship) {
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
      user.id,
    );

    return word_sequence;
  }

  async createSubWordSequence(
    parentWordSequenceId: Nanoid,
    subText: string,
    position: number,
    len: number,
    creator: Nanoid,
  ): Promise<Node> {
    const user = await this.firstLayerService.readNode(creator);

    if (!user) {
      throw new Error('Not exists given creator');
    }

    const parentWordSequence = await this.getWordSequenceById(
      parentWordSequenceId,
    );

    if (parentWordSequence === null) {
      throw new Error('Not Exists given parentWordSequenceId!');
    }

    const subWordSequence = await this.secondLayerService.createNodeFromObject(
      NodeTypeConst.WORD_SEQUENCE,
      {
        [PropertyKeyConst.WORD_SEQUENCE]: subText,
        [PropertyKeyConst.DOCUMENT_ID]: parentWordSequence.documentId,
        [PropertyKeyConst.CREATOR_ID]: user.id,
        [PropertyKeyConst.IMPORT_UID]: parentWordSequence.importUid,
        [PropertyKeyConst.LANGUAGE_ID]: parentWordSequence.languageId,
        [PropertyKeyConst.IS_ORIGIN]: parentWordSequence.isOrigin,
      },
    );

    await this.secondLayerService.createRelationshipFromObject(
      RelationshipTypeConst.WORD_SEQUENCE_TO_SUB_WORD_SEQUENCE,
      {
        [PropertyKeyConst.POSITION]: position,
        [PropertyKeyConst.LENGTH]: len,
      },
      parentWordSequence.id,
      subWordSequence.id,
    );

    return subWordSequence;
  }

  async getOriginWordSequenceByDocumentId(
    documentId: Nanoid,
    withSubWordSequence = false,
  ): Promise<WordSequenceDto | WordSequenceWithSubDto | null> {
    const document = await this.firstLayerService.readNode(documentId);

    if (!document) {
      throw new Error('Not exists such documentId!');
    }

    const wordSequence = await this.firstLayerService.readNode(
      '',
      [
        'propertyKeys',
        'propertyKeys.propertyValue',
        'nodeRelationships',
        'nodeRelationships.toNode',
      ],
      {
        node_type: NodeTypeConst.WORD_SEQUENCE,
        propertyKeys: {
          property_key: PropertyKeyConst.IS_ORIGIN,
          propertyValue: {
            property_value: JSON.stringify({ value: true }),
          },
        },
        nodeRelationships: {
          relationship_type: RelationshipTypeConst.WORD_SEQUENCE_TO_DOCUMENT,
          toNode: {
            id: documentId,
          },
        },
      },
    );

    if (wordSequence === null) {
      return null;
    }

    if (withSubWordSequence === false) {
      return WordSequenceMapper.entityToDto(wordSequence);
    }

    const wordSequenceAgain = await this.firstLayerService.readNode(
      wordSequence.id,
      [
        'propertyKeys',
        'propertyKeys.propertyValue',
        'nodeRelationships',
        'nodeRelationships.toNode',
      ],
    );

    return WordSequenceMapper.entityToDtoWithSubSequence(wordSequenceAgain!);
  }

  async getWordSequenceById(
    word_sequence_id: Nanoid,
  ): Promise<WordSequenceDto | null> {
    const word_sequence = await this.firstLayerService.readNode(
      word_sequence_id,
      ['propertyKeys', 'propertyKeys.propertyValue'],
    );

    if (word_sequence === null) {
      return null;
    }

    return WordSequenceMapper.entityToDto(word_sequence);
  }

  async getText(word_sequence_id: Nanoid): Promise<string | null> {
    const word_sequence = await this.firstLayerService.readNode(
      word_sequence_id,
      [
        'propertyKeys',
        'propertyKeys.propertyValue',
        'nodeRelationships',
        'nodeRelationships.toNode',
        'nodeRelationships.toNode.propertyKeys',
        'nodeRelationships.toNode.propertyKeys.propertyValue',
      ],
    );

    if (word_sequence === null) {
      return null;
    }

    return WordSequenceMapper.entityToDto(word_sequence).wordSequence;
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

    await this.secondLayerService.updateNodeObject(to, {
      [PropertyKeyConst.ORIGINAL_WORD_SEQUENCE_ID]: from,
    });

    return new_translation.id;
  }

  async listTranslationsByDocumentId(
    documentId: Nanoid,
    languageId: Nanoid,
    userId?: Nanoid,
  ) {
    const constrains = [
      {
        key: PropertyKeyConst.DOCUMENT_ID,
        value: documentId,
      },
      { key: PropertyKeyConst.LANGUAGE_ID, value: languageId },
    ];

    if (userId) {
      constrains.push({ key: PropertyKeyConst.CREATOR_ID, value: userId });
    }

    const wordSequenceIds = await this.firstLayerService.getNodesByProps(
      NodeTypeConst.WORD_SEQUENCE,
      constrains,
    );

    const translations = [];

    for (const id of wordSequenceIds) {
      const wordSequenceDto = await this.getWordSequenceById(id);

      if (!wordSequenceDto) {
        continue;
      }

      if (!wordSequenceDto.originalWordSequenceId) {
        continue;
      }

      translations.push(wordSequenceDto);
    }

    return translations;
  }

  async listTranslationsByWordSequenceId(
    wordSequenceId: Nanoid,
    languageId: Nanoid,
    userId?: Nanoid,
  ) {
    const languageNode = await this.firstLayerService.readNode(languageId);

    if (!languageNode) {
      throw new Error('Not exists lanaguage with given Id!');
    }

    const constrains = [
      {
        key: PropertyKeyConst.ORIGINAL_WORD_SEQUENCE_ID,
        value: wordSequenceId,
      },
      { key: PropertyKeyConst.LANGUAGE_ID, value: languageId },
    ];

    if (userId) {
      constrains.push({ key: PropertyKeyConst.CREATOR_ID, value: userId });
    }

    const wordSequenceIds = await this.firstLayerService.getNodesByProps(
      NodeTypeConst.WORD_SEQUENCE,
      constrains,
    );

    const translations = [];

    for (const id of wordSequenceIds) {
      const wordSequenceDto = await this.getWordSequenceById(id);

      if (!wordSequenceDto) {
        continue;
      }

      translations.push(wordSequenceDto);
    }

    return translations;
  }

  // --------- region language node --------- //
  async createLanguage(language: string): Promise<Nanoid> {
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

  async getLanguage(name: string): Promise<Nanoid | null> {
    const langNode = await this.firstLayerService.getNodeByProp(
      NodeTypeConst.LANGUAGE,
      { key: PropertyKeyConst.NAME, value: name },
    );

    if (!langNode) {
      return null;
    }

    return langNode.id;
  }

  async getLanguages(): Promise<LanguageDto[]> {
    const langNodes = await this.firstLayerService.listAllNodesByType(
      NodeTypeConst.LANGUAGE,
    );

    return langNodes.map(LanguageMapper.entityToDto);
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
