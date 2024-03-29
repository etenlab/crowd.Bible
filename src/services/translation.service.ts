import {
  GraphFirstLayerService,
  GraphSecondLayerService,
  MainKeyName,
  VotingService,
} from '@eten-lab/core';

import { WordService } from './word.service';
import { WordSequenceService } from './word-sequence.service';

import { ElectionTypeConst } from '@eten-lab/core';
import { RelationshipTypeConst, NodeTypeConst } from '@eten-lab/core';
import { Candidate, Node, TableNameConst } from '@eten-lab/models';
import { LanguageInfo } from '@eten-lab/ui-kit';

import {
  WordSequenceDto,
  WordSequenceTranslationDto,
} from '@/dtos/word-sequence.dto';

import { LanguageMapper } from '@/mappers/language.mapper';
import { NodeMapper } from '../mappers/node.mapper';

export interface getRecommendedTranslationParams {
  sourceLang: LanguageInfo;
  targetLang: LanguageInfo;
  source: string;
  nodeType: NodeTypeConst.WORD | NodeTypeConst.PHRASE;
}

export class TranslationService {
  constructor(
    private readonly graphFirstLayerService: GraphFirstLayerService,
    private readonly graphSecondLayerService: GraphSecondLayerService,

    private readonly wordService: WordService,
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
      languageInfo: LanguageInfo;
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
      withWordsRelationship: false,
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

  async createOrFindDefinitionTranslation(
    originalDefinitionId: Nanoid,
    translatedDefinitionId: Nanoid,
  ): Promise<{
    electionId: Nanoid;
    candidateId: Nanoid;
    definitionId: Nanoid;
    translationRelationshipId: Nanoid;
  }> {
    const original = await this.graphFirstLayerService.readNode(
      originalDefinitionId,
    );

    if (!original) {
      throw new Error('Not exists original definition with given Id');
    }

    const translated = await this.graphFirstLayerService.readNode(
      translatedDefinitionId,
    );

    if (!translated) {
      throw new Error('Not exists translated definition with given Id');
    }

    const { electionId, candidateId, translatedId, translationRelationshipId } =
      await this.createOrFindTranslation(
        original.id,
        translated.id,
        RelationshipTypeConst.WORD_SEQUENCE_TO_TRANSLATION,
      );

    return {
      electionId,
      candidateId,
      definitionId: translatedId,
      translationRelationshipId: translationRelationshipId,
    };
  }

  async createOrFindWordTranslation(
    originalWordId: Nanoid,
    translation: {
      word: string;
      languageInfo: LanguageInfo;
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

    const translatedId =
      await this.wordService.createOrFindWordOrPhraseWithLang(
        translation.word,
        translation.languageInfo,
      );

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

  // async createOrFindPhraseTranslation(
  //   originalPhraseId: Nanoid,
  //   translation: {
  //     phrase: string;
  //     languageId: Nanoid;
  //     siteText?: boolean;
  //   },
  // ): Promise<{
  //   electionId: Nanoid;
  //   candidateId: Nanoid;
  //   phraseId: Nanoid;
  //   phraseTranslationRelationshipId: Nanoid;
  // }> {
  //   const original = await this.phraseService.getPhrase(
  //     translation.phrase,
  //     translation.languageId,
  //   );

  //   if (!original) {
  //     throw new Error('Not exists original phrase with given Id');
  //   }

  //   const translatedId = await this.phraseService.createOrFindPhrase({
  //     ...translation,
  //   });

  //   const {
  //     electionId,
  //     candidateId,
  //     translatedId: phraseId,
  //     translationRelationshipId,
  //   } = await this.createOrFindTranslation(
  //     originalPhraseId,
  //     translatedId,
  //     RelationshipTypeConst.WORD_TO_TRANSLATION,
  //   );

  //   return {
  //     electionId,
  //     candidateId,
  //     phraseId,
  //     phraseTranslationRelationshipId: translationRelationshipId,
  //   };
  // }

  async getRecommendedTranslation({
    sourceLang,
    targetLang,
    source,
    nodeType,
  }: getRecommendedTranslationParams): Promise<string | null> {
    const originalId = await this.wordService.getWordOrPhraseWithLang(
      source,
      sourceLang,
      nodeType,
    );
    if (!originalId) return null;
    const candidateAndNode =
      await this.getRecommendedTranslationCandidateAndNode(
        originalId,
        targetLang,
      );

    if (!candidateAndNode) return null;

    const translatedNode = NodeMapper.entityToDto(candidateAndNode.electedNode);

    return translatedNode[MainKeyName[nodeType]];
  }

  async getRecommendedTranslationCandidateAndNode(
    originalId: Nanoid,
    languageInfo: LanguageInfo,
  ): Promise<{ candidateId: Nanoid; electedNode: Node } | null> {
    const election = await this.votingService.getElectionByRef(
      ElectionTypeConst.TRANSLATION,
      originalId,
      TableNameConst.NODES,
    );

    if (!election) {
      return null;
    }

    const allCandidates = await this.votingService.getCandidateListByElectionId(
      election.id,
    );

    const candidatesByLanguage: { candidate: Candidate; targetedNode: Node }[] =
      [];

    for (const candidate of allCandidates) {
      const rel = await this.graphFirstLayerService.readRelationship(
        candidate.candidate_ref,
        ['toNode', 'toNode.propertyKeys', 'toNode.propertyKeys.propertyValue'],
        {
          id: candidate.candidate_ref,
        },
      );

      if (!rel || !rel.toNode) {
        continue;
      }

      const nodeLanguageInfo = LanguageMapper.entityToDto(rel.toNode);

      if (!nodeLanguageInfo) {
        continue;
      }

      // check if the node entity has the same languageInfo
      if (
        nodeLanguageInfo.lang.tag !== languageInfo.lang.tag ||
        nodeLanguageInfo.dialect?.tag !== languageInfo.dialect?.tag ||
        nodeLanguageInfo.region?.tag !== languageInfo.region?.tag
      ) {
        continue;
      }

      candidatesByLanguage.push({ candidate, targetedNode: rel.toNode });
    }

    let highestVoted: {
      id: string | null;
      votes: number;
      targetNode: Node | null;
    } = {
      id: null,
      votes: 0,
      targetNode: null,
    };

    for (const cbl of candidatesByLanguage) {
      const voteStatus = await this.votingService.getVotesStats(
        cbl.candidate.id,
      );

      if (voteStatus.upVotes >= highestVoted.votes) {
        highestVoted = {
          id: cbl.candidate.candidate_ref,
          votes: voteStatus.upVotes,
          targetNode: cbl.targetedNode,
        };
      }
    }

    if (!highestVoted.id || !highestVoted.targetNode) {
      return null;
    }

    return {
      candidateId: highestVoted.id,
      electedNode: highestVoted.targetNode,
    };
  }

  async getRecommendedWordSequenceTranslation(
    originalId: Nanoid,
    languageInfo: LanguageInfo,
  ): Promise<WordSequenceDto | null> {
    const translationCandidate =
      await this.getRecommendedTranslationCandidateAndNode(
        originalId,
        languageInfo,
      );

    if (!translationCandidate) {
      return null;
    }

    return this.wordSequenceService.getWordSequenceById(
      translationCandidate.electedNode.id,
    );
  }

  async listTranslationsByWordSequenceId(
    wordSequenceId: Nanoid,
    languageInfo: LanguageInfo,
    creatorId?: Nanoid,
  ): Promise<WordSequenceTranslationDto[]> {
    const wordSequence = await this.graphFirstLayerService.readNode(
      '',
      [
        'toNodeRelationships',
        'toNodeRelationships.toNode',
        'toNodeRelationships.toNode.propertyKeys',
        'toNodeRelationships.toNode.propertyKeys.propertyValue',
      ],
      {
        id: wordSequenceId,
        node_type: NodeTypeConst.WORD_SEQUENCE,
        toNodeRelationships: {
          relationship_type: RelationshipTypeConst.WORD_SEQUENCE_TO_TRANSLATION,
        },
      },
    );

    if (!wordSequence || !wordSequence.toNodeRelationships) {
      return [];
    }

    const translations: WordSequenceTranslationDto[] = [];

    const election = await this.votingService.getElectionByRef(
      ElectionTypeConst.TRANSLATION,
      wordSequenceId,
      TableNameConst.NODES,
    );

    if (!election) {
      return [];
    }

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

      if (creatorId && translatedWordSequence.creatorId !== creatorId) {
        continue;
      }

      // check if the node entity has the same languageInfo
      if (
        translatedWordSequence.languageInfo.lang.tag !==
          languageInfo.lang.tag ||
        translatedWordSequence.languageInfo.dialect?.tag !==
          languageInfo.dialect?.tag ||
        translatedWordSequence.languageInfo.region?.tag !==
          languageInfo.region?.tag
      ) {
        continue;
      }

      const translationId = translatedWordSequence.id;

      const transRel = await this.graphFirstLayerService.findRelationship(
        wordSequenceId,
        translationId,
        RelationshipTypeConst.WORD_SEQUENCE_TO_TRANSLATION,
      );

      if (!transRel) {
        continue;
      }

      const candidate = await this.votingService.addCandidate(
        election.id,
        transRel.id,
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
}
