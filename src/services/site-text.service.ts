import { ElectionTypeConst } from '@/constants/voting.constant';
import { TableNameConst } from '@/constants/table-name.constant';

import {
  SiteTextDto,
  SiteTextTranslationDto,
  TranslatedSiteTextDto,
} from '@/dtos/site-text.dto';
import { WordDto } from '@/dtos/word.dto';
import { VotableContent } from '@/dtos/votable-item.dto';

import { RelationshipTypeConst } from '@/constants/graph.constant';

import { GraphFirstLayerService } from './graph-first-layer.service';
import { VotingService } from './voting.service';
import { DefinitionService } from './definition.service';
import { TranslationService } from './translation.service';
import { WordService } from './word.service';
import { DocumentService } from './document.service';

import { Candidate } from '@/src/models/';

import { LanguageInfo } from '@eten-lab/ui-kit';
import { LanguageMapper } from '@/mappers/language.mapper';

import { compareLangInfo } from '@/utils/langUtils';

export class SiteTextService {
  constructor(
    private readonly graphFirstLayerService: GraphFirstLayerService,

    private readonly votingService: VotingService,
    private readonly definitionService: DefinitionService,
    private readonly translationService: TranslationService,
    private readonly wordService: WordService,
    private readonly documentService: DocumentService,
  ) {}

  private async filterDefinitionCandidatesByLanguage(
    candidates: Candidate[],
    languageInfo: LanguageInfo,
  ): Promise<Candidate[]> {
    const filteredCandidates: Candidate[] = [];

    for (const candidate of candidates) {
      const rel = candidate.candidate_ref;

      const relEntity = await this.graphFirstLayerService.readRelationship(
        rel,
        [
          'fromNode',
          'fromNode.propertyKeys',
          'fromNode.propertyKeys.propertyValue',
        ],
        {
          id: rel,
        },
      );

      if (relEntity === null) {
        continue;
      }

      const nodeLanguageInfo = LanguageMapper.entityToDto(relEntity.fromNode);

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

      filteredCandidates.push(candidate);
    }

    return filteredCandidates;
  }

  private async createOrFindSiteTextOnGraph(
    languageInfo: LanguageInfo,
    siteText: string,
    definitionText: string,
  ): Promise<{ wordId: Nanoid; definitionId: Nanoid; relationshipId: Nanoid }> {
    const wordId = await this.wordService.createWordOrPhraseWithLang(
      siteText,
      languageInfo,
    );

    const { definitionId } = await this.definitionService.createDefinition(
      definitionText,
      wordId,
    );

    const relationship = await this.graphFirstLayerService.findRelationship(
      wordId,
      definitionId,
      RelationshipTypeConst.WORD_TO_DEFINITION,
    );

    return {
      wordId,
      definitionId,
      relationshipId: relationship!.id,
    };
  }

  private async getRecommendedDefinition(
    appId: Nanoid,
    siteTextId: Nanoid,
  ): Promise<VotableContent | null> {
    const definitionList = await this.getDefinitionList(appId, siteTextId);

    if (definitionList.length === 0) {
      return null;
    }

    let selected: VotableContent | null = null;

    for (const definition of definitionList) {
      if (selected === null) {
        selected = definition;
      } else if (
        selected.upVotes * 2 - selected.downVotes <
        definition.upVotes * 2 - definition.downVotes
      ) {
        selected = definition;
      }
    }

    return selected;
  }

  private async getSiteTextListByAppId(appId: Nanoid): Promise<WordDto[]> {
    const siteTextElections = await this.votingService.getSiteTextElectionList({
      appId,
      siteText: true,
    });

    const siteTexts: WordDto[] = [];

    for (const election of siteTextElections) {
      const wordId = election.election_ref;
      const wordDto = await this.wordService.getWordById(wordId);

      if (!wordDto) {
        continue;
      }

      siteTexts.push(wordDto);
    }

    return siteTexts;
  }

  async createOrFindSiteText(
    appId: Nanoid,
    languageInfo: LanguageInfo,
    siteText: string,
    definitionText: string,
  ): Promise<{ wordId: Nanoid; definitionId: Nanoid; relationshipId: Nanoid }> {
    const { wordId, definitionId, relationshipId } =
      await this.createOrFindSiteTextOnGraph(
        languageInfo,
        siteText,
        definitionText,
      );

    const election = await this.votingService.createOrFindElection(
      ElectionTypeConst.SITE_TEXT_DEFINTION,
      wordId,
      TableNameConst.NODES,
      TableNameConst.RELATIONSHIPS,
      {
        appId,
        siteText: true,
      },
    );

    await this.votingService.addCandidate(election.id, relationshipId);

    await this.votingService.createOrFindElection(
      ElectionTypeConst.SITE_TEXT_TRANSLATION,
      relationshipId,
      TableNameConst.RELATIONSHIPS,
      TableNameConst.RELATIONSHIPS,
      {
        appId,
        siteTextTranslation: true,
      },
    );

    return {
      wordId,
      definitionId,
      relationshipId,
    };
  }

  async createOrFindTranslation(
    appId: Nanoid,
    definitionRelationshipId: Nanoid,
    languageInfo: LanguageInfo,
    translatedSiteText: string,
    translatedDefinitionText: string,
  ): Promise<{ wordId: Nanoid; definitionId: Nanoid; relationshipId: Nanoid }> {
    const rel = await this.graphFirstLayerService.readRelationship(
      definitionRelationshipId,
    );

    if (rel === null) {
      throw new Error(
        'A SiteText with the specified relationship ID does not exist!',
      );
    }

    const { wordId, definitionId, relationshipId } =
      await this.createOrFindSiteTextOnGraph(
        languageInfo,
        translatedSiteText,
        translatedDefinitionText,
      );

    await this.translationService.createOrFindWordTranslation(
      rel.from_node_id,
      {
        word: translatedSiteText,
        languageInfo,
      },
    );

    await this.translationService.createOrFindDefinitionTranslation(
      rel.to_node_id,
      definitionId,
    );

    const election = await this.votingService.createOrFindElection(
      ElectionTypeConst.SITE_TEXT_TRANSLATION,
      definitionRelationshipId,
      TableNameConst.RELATIONSHIPS,
      TableNameConst.RELATIONSHIPS,
      {
        appId,
        siteTextTranslation: true,
      },
    );

    if (election === null) {
      throw new Error('An Election with the specified Ref does not exist!');
    }

    await this.votingService.addCandidate(election.id, relationshipId);

    return {
      wordId,
      definitionId,
      relationshipId,
    };
  }

  async getSiteTextDto(
    siteTextId: Nanoid,
    definitionId: Nanoid,
  ): Promise<SiteTextDto> {
    const relationship = await this.graphFirstLayerService.findRelationship(
      siteTextId,
      definitionId,
      RelationshipTypeConst.WORD_TO_DEFINITION,
    );

    if (!relationship) {
      throw new Error(
        'Not exists such relationship with siteTextId, and recommended definition Id',
      );
    }

    const definitionDto = await this.definitionService.getDefinitionWithRel(
      relationship.id,
    );

    if (!definitionDto) {
      throw new Error('Cannot get a DefinitionDto with given relationship');
    }

    return {
      siteTextId,
      relationshipId: relationship.id,
      languageInfo: definitionDto.languageInfo,
      siteText: definitionDto.wordText,
      definition: definitionDto.definitionText,
      upVotes: definitionDto.upVotes,
      downVotes: definitionDto.downVotes,
      candidateId: definitionDto.candidateId,
    };
  }

  async getSiteTextDtoWithRel(definitionRel: Nanoid): Promise<SiteTextDto> {
    const definitionDto = await this.definitionService.getDefinitionWithRel(
      definitionRel,
    );

    if (!definitionDto) {
      throw new Error('Cannot get a DefinitionDto with given relationship');
    }

    return {
      siteTextId: definitionDto.wordId,
      relationshipId: definitionDto.relationshipId,
      languageInfo: definitionDto.languageInfo,
      siteText: definitionDto.wordText,
      definition: definitionDto.definitionText,
      upVotes: definitionDto.upVotes,
      downVotes: definitionDto.downVotes,
      candidateId: definitionDto.candidateId,
    };
  }

  async getDefinitionList(
    appId: Nanoid,
    siteTextId: Nanoid,
  ): Promise<VotableContent[]> {
    const election = await this.votingService.getElectionByRef(
      ElectionTypeConst.SITE_TEXT_DEFINTION,
      siteTextId,
      TableNameConst.NODES,
      {
        appId,
        siteText: true,
      },
    );

    if (!election) {
      throw new Error('Not exists election entity with given props');
    }

    return this.definitionService.getDefinitionsAsVotableContent(
      siteTextId,
      election.id,
    );
  }

  async getSiteTextTranslationDtoWithRel(
    appId: Nanoid,
    originalDefinitionRel: Nanoid,
    translatedDefinitionRel: Nanoid,
  ): Promise<SiteTextTranslationDto | null> {
    const original = await this.getSiteTextDtoWithRel(originalDefinitionRel);
    const definitionDto = await this.definitionService.getDefinitionWithRel(
      translatedDefinitionRel,
    );

    if (!definitionDto) {
      throw new Error('Not exists definition entity with given relationship!');
    }

    const election = await this.votingService.getElectionByRef(
      ElectionTypeConst.SITE_TEXT_TRANSLATION,
      original.relationshipId,
      TableNameConst.RELATIONSHIPS,
      {
        appId,
        siteTextTranslation: true,
      },
    );

    if (!election) {
      throw new Error('Not exists election entity with given props!');
    }

    const candidate = await this.votingService.getCandidateByRef(
      election.id,
      translatedDefinitionRel,
    );

    if (!candidate) {
      throw new Error('Not exists candidate entity with given ref!');
    }

    const votingStatus = await this.votingService.getVotesStats(candidate.id);

    return {
      original,
      languageInfo: definitionDto.languageInfo,
      translatedSiteText: definitionDto.wordText,
      translatedDefinition: definitionDto.definitionText,
      ...votingStatus,
    };
  }

  async getTranslationListBySiteTextRel(
    appId: Nanoid,
    original: SiteTextDto,
    languageInfo: LanguageInfo,
  ): Promise<SiteTextTranslationDto[]> {
    const election = await this.votingService.getElectionByRef(
      ElectionTypeConst.SITE_TEXT_TRANSLATION,
      original.relationshipId,
      TableNameConst.RELATIONSHIPS,
      {
        appId,
        siteTextTranslation: true,
      },
    );

    // This means still there isn't any translations.
    if (!election) {
      return [];
    }

    const candidates: Candidate[] =
      await this.votingService.getCandidateListByElectionId(election.id);

    const filteredCandidates: Candidate[] =
      await this.filterDefinitionCandidatesByLanguage(candidates, languageInfo);

    const translatedSiteTexts: SiteTextTranslationDto[] = [];

    for (const candidate of filteredCandidates) {
      const definitionDto = await this.definitionService.getDefinitionWithRel(
        candidate.candidate_ref,
      );

      if (!definitionDto) {
        continue;
      }

      const votingStatus = await this.votingService.getVotesStats(candidate.id);

      const translated = {
        original,
        languageInfo,
        translatedSiteText: definitionDto.wordText,
        translatedDefinition: definitionDto.definitionText,
        ...votingStatus,
      };

      translatedSiteTexts.push(translated);
    }

    return translatedSiteTexts;
  }

  async getRecommendedSiteText(
    appId: Nanoid,
    siteTextId: Nanoid,
    languageInfo: LanguageInfo,
  ): Promise<SiteTextTranslationDto | null> {
    const recommended = await this.getRecommendedDefinition(appId, siteTextId);

    if (!recommended) {
      return null;
    }

    const original = await this.getSiteTextDto(siteTextId, recommended.id!);

    // check if the node entity has the same languageInfo
    if (compareLangInfo(original.languageInfo, languageInfo)) {
      return {
        original,
        languageInfo: languageInfo,
        translatedSiteText: original.siteText,
        translatedDefinition: original.definition,
        upVotes: 0,
        downVotes: 0,
        candidateId: original.candidateId,
      };
    }

    const translationList = await this.getTranslationListBySiteTextRel(
      appId,
      original,
      languageInfo,
    );

    if (translationList.length === 0) {
      return null;
    }

    let selected: SiteTextTranslationDto | null = null;

    for (const translated of translationList) {
      if (selected === null) {
        selected = translated;
      } else if (
        selected.upVotes * 2 - selected.downVotes <
        translated.upVotes * 2 - translated.downVotes
      ) {
        selected = translated;
      }
    }

    return selected;
  }

  async getTranslatedSiteTextListByAppId(
    appId: Nanoid,
    sourceLanguageInfo: LanguageInfo,
    targetLanguageInfo: LanguageInfo,
  ): Promise<TranslatedSiteTextDto[]> {
    const siteTextList = await this.getSiteTextListByAppId(appId);

    const translatedSiteTextList: TranslatedSiteTextDto[] = [];

    for (const siteText of siteTextList) {
      const recommended = await this.getRecommendedSiteText(
        appId,
        siteText.id,
        sourceLanguageInfo,
      );

      let translationCnt = 0;
      const definitionList = await this.getDefinitionList(appId, siteText.id);

      for (const definition of definitionList) {
        const original = await this.getSiteTextDto(siteText.id, definition.id!);
        const translationList = await this.getTranslationListBySiteTextRel(
          appId,
          original,
          targetLanguageInfo,
        );
        translationCnt += translationList.length;
      }

      translatedSiteTextList.push({
        siteTextId: siteText.id,
        siteText: siteText.word,
        translatedSiteText: recommended?.translatedSiteText,
        translationCnt,
      });
    }

    return translatedSiteTextList;
  }
}
