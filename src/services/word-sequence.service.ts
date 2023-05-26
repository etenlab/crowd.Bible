import { GraphFirstLayerService } from './graph-first-layer.service';
import { GraphSecondLayerService } from './graph-second-layer.service';

import { WordService } from './word.service';

import {
  PropertyKeyConst,
  NodeTypeConst,
  RelationshipTypeConst,
} from '@/constants/graph.constant';

import { Node, Relationship } from '@/src/models';

import { WordSequenceDto, SubWordSequenceDto } from '@/dtos/word-sequence.dto';

import { WordSequenceMapper } from '@/mappers/word-sequence.mapper';
import { LanguageInfo } from '@eten-lab/ui-kit';

export class WordSequenceService {
  constructor(
    private readonly graphFirstLayerService: GraphFirstLayerService,
    private readonly graphSecondLayerService: GraphSecondLayerService,

    private readonly wordService: WordService,
  ) {}

  async createWordSequence({
    text,
    creatorId,
    languageInfo,
    documentId,
    withWordsRelationship = true,
    importUid,
  }: {
    text: string;
    creatorId: Nanoid;
    languageInfo: LanguageInfo;
    documentId?: Nanoid;
    withWordsRelationship?: boolean;
    importUid?: Nanoid;
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
          [PropertyKeyConst.IMPORT_UID]: importUid,
          [PropertyKeyConst.LANGUAGE_TAG]: languageInfo.lang.tag,
          [PropertyKeyConst.DIALECT_TAG]: languageInfo.dialect?.tag,
          [PropertyKeyConst.REGION_TAG]: languageInfo.region?.tag,
        },
      );

    if (withWordsRelationship) {
      const words = text.split(' ');

      for (const [i, word] of words.entries()) {
        const new_word_id = await this.wordService.createWordOrPhraseWithLang(
          word,
          languageInfo,
        );
        await this.graphSecondLayerService.createRelationshipFromObject(
          RelationshipTypeConst.WORD_SEQUENCE_TO_WORD,
          { position: i + 1 },
          word_sequence.id,
          new_word_id,
        );
      }
    }

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
    position: number,
    len: number,
    creatorId: Nanoid,
  ): Promise<Node> {
    const user = await this.graphFirstLayerService.readNode(creatorId);
    const parentNode = await this.graphFirstLayerService.readNode(
      parentWordSequenceId,
    );

    if (!user) {
      throw new Error('Not exists given creator');
    }

    if (!parentNode) {
      throw new Error('Not exists given WordSequence');
    }

    const parentWordSequence = await this.getWordSequenceById(
      parentWordSequenceId,
    );

    if (parentWordSequence === null) {
      throw new Error('Not Exists given parentWordSequenceId!');
    }

    const subText = parentWordSequence.text
      .split(' ')
      .slice(position, position + len)
      .join(' ');

    const subWordSequence =
      subText === parentWordSequence.text
        ? parentNode
        : await this.createWordSequence({
            text: subText,
            creatorId: creatorId,
            languageInfo: parentWordSequence.languageInfo,
            withWordsRelationship: false,
          });

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

  async getWordSequenceById(
    wordSequenceId: Nanoid,
  ): Promise<WordSequenceDto | null> {
    const word_sequence = await this.graphFirstLayerService.readNode(
      wordSequenceId,
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

    return WordSequenceMapper.entityToDto(word_sequence).text;
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

  async getWordSequenceFromText(text: string): Promise<Nanoid[]> {
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

  async getWordSequenceByDocumentId(
    documentId: Nanoid,
  ): Promise<WordSequenceDto | null> {
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

    return this.getWordSequenceById(wordSequence.id);
  }

  async listSubWordSequenceByWordSequenceId(
    wordSequenceId: Nanoid,
    creatorId?: Nanoid,
  ): Promise<SubWordSequenceDto[]> {
    const wordSequence = await this.graphFirstLayerService.readNode(
      '',
      [
        'toNodeRelationships',
        'toNodeRelationships.propertyKeys',
        'toNodeRelationships.propertyKeys.propertyValue',
        'toNodeRelationships.toNode',
        'toNodeRelationships.toNode.propertyKeys',
        'toNodeRelationships.toNode.propertyKeys.propertyValue',
        'toNodeRelationships.toNode.toNodeRelationships',
        'toNodeRelationships.toNode.toNodeRelationships.toNode',
      ],
      {
        id: wordSequenceId,
        node_type: NodeTypeConst.WORD_SEQUENCE,
        toNodeRelationships: {
          relationship_type:
            RelationshipTypeConst.WORD_SEQUENCE_TO_SUB_WORD_SEQUENCE,
        },
      },
    );

    if (!wordSequence || !wordSequence.toNodeRelationships) {
      return [];
    }

    const subWordSequences: SubWordSequenceDto[] = [];

    for (const toNodeRelationship of wordSequence.toNodeRelationships) {
      if (!toNodeRelationship.toNode.id) {
        continue;
      }

      const subWordSequence = await WordSequenceMapper.relationshipToDto(
        toNodeRelationship,
      );

      if (!subWordSequence) {
        continue;
      }

      if (creatorId && subWordSequence.creatorId !== creatorId) {
        continue;
      }

      subWordSequences.push({
        ...subWordSequence,
      });
    }

    return subWordSequences;
  }
}
