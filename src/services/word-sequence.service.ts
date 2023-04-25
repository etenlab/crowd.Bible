import { GraphFirstLayerService } from './graph-first-layer.service';
import { GraphSecondLayerService } from './graph-second-layer.service';

import { WordService } from './word.service';

import {
  PropertyKeyConst,
  NodeTypeConst,
  RelationshipTypeConst,
} from '@/constants/graph.constant';

import { Node, Relationship } from '@/src/models';

import {
  WordSequenceDto,
  WordSequenceWithSubDto,
} from '@/dtos/word-sequence.dto';

import { WordSequenceMapper } from '@/mappers/word-sequence.mapper';

export class WordSequenceService {
  constructor(
    private readonly graphFirstLayerService: GraphFirstLayerService,
    private readonly graphSecondLayerService: GraphSecondLayerService,

    private readonly wordService: WordService,
  ) {}

  async createWordSequence({
    text,
    creatorId,
    languageId,
    documentId,
    withWordsRelationship = true,
  }: {
    text: string;
    creatorId: Nanoid;
    languageId: Nanoid;
    documentId?: Nanoid;
    withWordsRelationship?: boolean;
  }): Promise<Node> {
    const user = await this.graphFirstLayerService.readNode(creatorId);

    if (!user) {
      throw new Error('Not exists given creator');
    }

    const word_sequence =
      await this.graphSecondLayerService.createNodeFromObject(
        NodeTypeConst.WORD_SEQUENCE,
        {
          [PropertyKeyConst.WORD_SEQUENCE]: text,
          [PropertyKeyConst.DOCUMENT_ID]: documentId,
          [PropertyKeyConst.CREATOR_ID]: creatorId,
          [PropertyKeyConst.LANGUAGE_ID]: languageId,
        },
      );

    if (withWordsRelationship) {
      const words = text.split(' ');

      for (const [i, word] of words.entries()) {
        const new_word_id = await this.wordService.createOrFindWord({
          word,
          languageId,
        });
        await this.graphSecondLayerService.createRelationshipFromObject(
          RelationshipTypeConst.WORD_SEQUENCE_TO_WORD,
          { position: i + 1 },
          word_sequence.id,
          new_word_id,
        );
      }
    }

    await this.graphSecondLayerService.createRelationshipFromObject(
      RelationshipTypeConst.WORD_SEQUENCE_TO_LANGUAGE_ENTRY,
      {},
      word_sequence.id,
      languageId,
    );

    if (documentId) {
      await this.graphSecondLayerService.createRelationshipFromObject(
        RelationshipTypeConst.WORD_SEQUENCE_TO_DOCUMENT,
        {},
        word_sequence.id,
        documentId,
      );
    }

    await this.graphSecondLayerService.createRelationshipFromObject(
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
    const user = await this.graphFirstLayerService.readNode(creator);

    if (!user) {
      throw new Error('Not exists given creator');
    }

    const parentWordSequence = await this.getWordSequenceById(
      parentWordSequenceId,
    );

    if (parentWordSequence === null) {
      throw new Error('Not Exists given parentWordSequenceId!');
    }

    const subWordSequence =
      await this.graphSecondLayerService.createNodeFromObject(
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

    await this.graphSecondLayerService.createRelationshipFromObject(
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
    const document = await this.graphFirstLayerService.readNode(documentId);

    if (!document) {
      throw new Error('Not exists such documentId!');
    }

    const wordSequence = await this.graphFirstLayerService.readNode(
      '',
      [
        'propertyKeys',
        'propertyKeys.propertyValue',
        'toNodeRelationships',
        'toNodeRelationships.toNode',
      ],
      {
        node_type: NodeTypeConst.WORD_SEQUENCE,
        propertyKeys: {
          property_key: PropertyKeyConst.IS_ORIGIN,
          propertyValue: {
            property_value: JSON.stringify({ value: true }),
          },
        },
        toNodeRelationships: {
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

    const wordSequenceAgain = await this.graphFirstLayerService.readNode(
      wordSequence.id,
      [
        'propertyKeys',
        'propertyKeys.propertyValue',
        'toNodeRelationships',
        'toNodeRelationships.propertyKeys',
        'toNodeRelationships.propertyKeys.propertyValue',
        'toNodeRelationships.toNode',
      ],
    );

    if (withSubWordSequence === false) {
      return WordSequenceMapper.entityToDto(wordSequenceAgain!);
    }

    return WordSequenceMapper.entityToDtoWithSubSequence(wordSequenceAgain!);
  }

  async getWordSequenceById(
    wordSequenceId: Nanoid,
  ): Promise<WordSequenceDto | null> {
    const word_sequence = await this.graphFirstLayerService.readNode(
      wordSequenceId,
      ['propertyKeys', 'propertyKeys.propertyValue'],
    );

    if (word_sequence === null) {
      return null;
    }

    return WordSequenceMapper.entityToDto(word_sequence);
  }

  async getTextFromWordSequenceId(
    word_sequence_id: Nanoid,
  ): Promise<string | null> {
    const word_sequence = await this.graphFirstLayerService.readNode(
      word_sequence_id,
      [
        'propertyKeys',
        'propertyKeys.propertyValue',
        'toNodeRelationships',
        'toNodeRelationships.toNode',
        'toNodeRelationships.toNode.propertyKeys',
        'toNodeRelationships.toNode.propertyKeys.propertyValue',
      ],
    );

    if (word_sequence === null) {
      return null;
    }

    return WordSequenceMapper.entityToDto(word_sequence).wordSequence;
  }

  async appendWordSequence(from: Nanoid, to: Nanoid): Promise<Relationship> {
    const word_sequence_connection =
      await this.graphSecondLayerService.createRelationshipFromObject(
        RelationshipTypeConst.WORD_SEQUENCE_TO_WORD_SEQUENCE,
        {},
        from,
        to,
      );

    return word_sequence_connection;
  }

  async getWordSequence(text: string): Promise<Nanoid[]> {
    const word_sequences = await this.graphFirstLayerService.listAllNodesByType(
      NodeTypeConst.WORD_SEQUENCE,
    );
    const filtered_word_sequences = await Promise.all(
      word_sequences.filter(async (word_sequence) => {
        const word_sequence_text = await this.getTextFromWordSequenceId(
          word_sequence.id,
        );
        return word_sequence_text === text;
      }),
    );

    return filtered_word_sequences.map((sequence) => sequence.id);
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

    const wordSequenceIds = await this.graphFirstLayerService.getNodesByProps(
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
    const languageNode = await this.graphFirstLayerService.readNode(languageId);

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

    const wordSequenceIds = await this.graphFirstLayerService.getNodesByProps(
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
}
