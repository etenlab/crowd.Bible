import { GraphFirstLayerService } from './graph-first-layer.service';
import { GraphSecondLayerService } from './graph-second-layer.service';

import { WordService } from './word.service';
import { PhraseService } from './phrase.service';
import { WordSequenceService } from './word-sequence.service';
import { VotingService } from './voting.service';

import { ElectionTypeConst } from '@/constants/voting.constant';
import {
  PropertyKeyConst,
  RelationshipTypeConst,
  NodeTypeConst,
} from '@/constants/graph.constant';
import { TableNameConst } from '@eten-lab/models';

import {
  SubWordSequenceDto,
  WordSequenceTranslationDto,
} from '@/dtos/word-sequence.dto';

import { WordSequenceMapper } from '@/mappers/word-sequence.mapper';

export class TranslationService {
  constructor(
    private readonly graphFirstLayerService: GraphFirstLayerService,
    private readonly graphSecondLayerService: GraphSecondLayerService,

    private readonly wordService: WordService,
    private readonly phraseService: PhraseService,
    private readonly wordSequenceService: WordSequenceService,

    private readonly votingService: VotingService,
  ) {}

  private async createOrFindTranslation(
    originalId: Nanoid,
    translatedId: Nanoid,
    relType: RelationshipTypeConst,
  ): Promise<{
    electionId: Nanoid;
    candidateId: Nanoid;
    translatedId: Nanoid;
    translationRelationshipId: Nanoid;
  }> {
    const election = await this.votingService.createOrFindElection(
      ElectionTypeConst.TRANSLATION,
      originalId,
      TableNameConst.NODES,
      TableNameConst.RELATIONSHIPS,
    );

    let transRel = await this.graphFirstLayerService.findRelationship(
      originalId,
      translatedId,
      relType,
    );

    if (!transRel) {
      transRel =
        await this.graphSecondLayerService.createRelationshipFromObject(
          relType,
          {},
          originalId,
          translatedId,
        );
    }

    const candidate = await this.votingService.addCandidate(
      election.id,
      transRel.id,
    );

    return {
      electionId: election.id,
      candidateId: candidate.id,
      translatedId: translatedId,
      translationRelationshipId: transRel.id,
    };
  }

  async createOrFindWordSequenceTranslation(
    originalWordSequenceId: Nanoid,
    translation: {
      text: string;
      creatorId: Nanoid;
      languageId: Nanoid;
      documentId?: Nanoid;
    },
  ): Promise<{
    electionId: Nanoid;
    candidateId: Nanoid;
    wordSequenceId: Nanoid;
    wordSequenceTranslationRelationshipId: Nanoid;
  }> {
    const original = await this.wordSequenceService.getWordSequenceById(
      originalWordSequenceId,
    );

    if (!original) {
      throw new Error('Not exists original word sequence with given Id');
    }

    const translated = await this.wordSequenceService.createWordSequence({
      ...translation,
    });

    const { electionId, candidateId, translatedId, translationRelationshipId } =
      await this.createOrFindTranslation(
        original.id,
        translated.id,
        RelationshipTypeConst.WORD_SEQUENCE_TO_TRANSLATION,
      );

    return {
      electionId,
      candidateId,
      wordSequenceId: translatedId,
      wordSequenceTranslationRelationshipId: translationRelationshipId,
    };
  }

  async createOrFindWordTranslation(
    originalWordId: Nanoid,
    translation: {
      word: string;
      languageId: Nanoid;
      siteText?: boolean;
    },
  ): Promise<{
    electionId: Nanoid;
    candidateId: Nanoid;
    wordId: Nanoid;
    wordTranslationRelationshipId: Nanoid;
  }> {
    const original = await this.graphFirstLayerService.readNode(originalWordId);

    if (!original) {
      throw new Error('Not exists original word with given Id');
    }

    const translatedId = await this.wordService.createOrFindWord({
      ...translation,
    });

    const {
      electionId,
      candidateId,
      translatedId: wordId,
      translationRelationshipId,
    } = await this.createOrFindTranslation(
      original.id,
      translatedId,
      RelationshipTypeConst.WORD_TO_TRANSLATION,
    );

    return {
      electionId,
      candidateId,
      wordId: wordId,
      wordTranslationRelationshipId: translationRelationshipId,
    };
  }

  async createOrFindPhraseTranslation(
    originalPhraseId: Nanoid,
    translation: {
      phrase: string;
      languageId: Nanoid;
      siteText?: boolean;
    },
  ): Promise<{
    electionId: Nanoid;
    candidateId: Nanoid;
    phraseId: Nanoid;
    phraseTranslationRelationshipId: Nanoid;
  }> {
    const original = await this.phraseService.getPhrase(
      translation.phrase,
      translation.languageId,
    );

    if (!original) {
      throw new Error('Not exists original phrase with given Id');
    }

    const translatedId = await this.phraseService.createOrFindPhrase({
      ...translation,
    });

    const {
      electionId,
      candidateId,
      translatedId: phraseId,
      translationRelationshipId,
    } = await this.createOrFindTranslation(
      originalPhraseId,
      translatedId,
      RelationshipTypeConst.WORD_TO_TRANSLATION,
    );

    return {
      electionId,
      candidateId,
      phraseId,
      phraseTranslationRelationshipId: translationRelationshipId,
    };
  }

  async getRecommendedTranslationId(
    originalId: Nanoid,
    languageId: Nanoid,
  ): Promise<Nanoid | null> {
    const election = await this.votingService.getElectionByRef(
      ElectionTypeConst.TRANSLATION,
      originalId,
      TableNameConst.NODES,
    );

    if (!election) {
      throw new Error('Not exists election entity with given props');
    }

    const allCandidates = await this.votingService.getCandidateListByElectionId(
      election.id,
    );

    const candidatesByLanguage = [];

    for (const candidate of allCandidates) {
      const rel = await this.graphFirstLayerService.readRelationship(
        candidate.candidate_ref,
        ['toNode', 'toNode.propertyKeys', 'toNode.propertyKeys.propertyValue'],
        {
          id: candidate.candidate_ref,
          toNode: {
            propertyKeys: {
              property_key: PropertyKeyConst.LANGUAGE_ID,
              propertyValue: {
                property_value: JSON.stringify({ value: languageId }),
              },
            },
          },
        },
      );

      if (!rel) {
        continue;
      }

      candidatesByLanguage.push(candidate);
    }

    let highestVoted: {
      id: string | null;
      votes: number;
    } = {
      id: null,
      votes: 0,
    };

    for (const candidate of candidatesByLanguage) {
      const voteStatus = await this.votingService.getVotesStats(candidate.id);

      if (voteStatus.upVotes >= highestVoted.votes) {
        highestVoted = {
          id: candidate.candidate_ref,
          votes: voteStatus.upVotes,
        };
      }
    }

    if (!highestVoted.id) {
      return null;
    }

    return highestVoted.id;
  }

  async getWordSequenceByDocumentId(
    documentId: Nanoid,
  ): Promise<Nanoid | null> {
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

    return wordSequence.id;
  }

  async listTranslationsByWordSequenceId(
    wordSequenceId: Nanoid,
    languageId: Nanoid,
    userId?: Nanoid,
  ): Promise<WordSequenceTranslationDto[]> {
    const wordSequence = await this.graphFirstLayerService.readNode(
      '',
      [
        'toNodeRelationships',
        'toNodeRelationships.toNode',
        'toNodeRelationships.toNode.toNodeRelationships',
        'toNodeRelationships.toNode.toNodeRelationships.toNode',
      ],
      {
        id: wordSequenceId,
        node_type: NodeTypeConst.WORD_SEQUENCE,
        toNodeRelationships: {
          relationship_type: RelationshipTypeConst.WORD_SEQUENCE_TO_TRANSLATION,
          toNode: {
            toNodeRelationships: {
              relationship_type:
                RelationshipTypeConst.WORD_SEQUENCE_TO_LANGUAGE_ENTRY,
              toNode: {
                id: languageId,
              },
            },
          },
        },
      },
    );

    if (!wordSequence || !wordSequence.toNodeRelationships) {
      return [];
    }

    const translations: WordSequenceTranslationDto[] = [];

    for (const toNodeRelationship of wordSequence.toNodeRelationships) {
      if (!toNodeRelationship.toNode.id) {
        continue;
      }

      const translatedWordSequence =
        await this.wordSequenceService.getWordSequenceById(
          toNodeRelationship.toNode.id,
        );

      if (!translatedWordSequence) {
        continue;
      }

      if (userId && translatedWordSequence.creatorId !== userId) {
        continue;
      }

      const translationId = toNodeRelationship.toNode.id;
      const election = await this.votingService.getElectionByRef(
        ElectionTypeConst.TRANSLATION,
        wordSequenceId,
        TableNameConst.NODES,
      );

      if (!election) {
        continue;
      }

      const candidate = await this.votingService.getCandidateByRef(
        election.id,
        translationId,
      );

      if (!candidate) {
        continue;
      }

      const votingStatus = await this.votingService.getVotesStats(candidate.id);

      translations.push({
        originalId: wordSequenceId,
        translationId,
        ...votingStatus,
      });
    }

    return translations;
  }

  async listSubWordSequenceByWordSequenceId(
    wordSequenceId: Nanoid,
    userId?: Nanoid,
  ) {
    const wordSequence = await this.graphFirstLayerService.readNode(
      '',
      [
        'toNodeRelationships',
        'toNodeRelationships.propertyKeys',
        'toNodeRelationships.propertyKeys.propertyValues',
        'toNodeRelationships.toNode',
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

      if (userId && subWordSequence.creatorId !== userId) {
        continue;
      }

      subWordSequences.push({
        ...subWordSequence,
      });
    }

    return subWordSequences;
  }
}
