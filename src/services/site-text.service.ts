import { ElectionTypeConst } from '@/constants/voting.constant';
import { TableNameConst } from '@/constants/table-name.constant';

import {
  SiteTextDto,
  SiteTextTranslationDto,
  TranslatedSiteTextDto,
} from '@/dtos/site-text.dto';
import { WordDto } from '@/dtos/word.dto';
import { VotableContent } from '@/dtos/votable-item.dto';

import {
  NodeTypeConst,
  RelationshipTypeConst,
} from '@/constants/graph.constant';

import { GraphFirstLayerService } from './graph-first-layer.service';
import { VotingService } from './voting.service';
import { DefinitionService } from './definition.service';
import { TranslationService } from './translation.service';
import { WordService } from './word.service';

import { Candidate } from '@/src/models/';

import { LanguageInfo } from '@eten-lab/ui-kit/dist/LangSelector/LangSelector';

export class SiteTextService {
  constructor(
    private readonly graphFirstLayerService: GraphFirstLayerService,
    private readonly votingService: VotingService,
    private readonly definitionService: DefinitionService,
    private readonly translationService: TranslationService,
    private readonly wordService: WordService,
  ) {}

  private async filterDefinitionCanddiatesByLanguage(
    candidates: Candidate[],
    languageId: Nanoid,
  ): Promise<Candidate[]> {
    const filteredCandidates: Candidate[] = [];

    for (const candidate of candidates) {
      const rel = candidate.candidate_ref;

      const relEntity = await this.graphFirstLayerService.readRelationship(
        rel,
        ['fromNode', 'fromNode.toNodeRelationships'],
        {
          id: rel,
          fromNode: {
            node_type: NodeTypeConst.WORD,
            toNodeRelationships: {
              relationship_type: RelationshipTypeConst.WORD_TO_LANG,
              to_node_id: languageId,
            },
          },
        },
      );

      if (relEntity === null) {
        continue;
      }

      filteredCandidates.push(candidate);
    }

    return filteredCandidates;
  }

  private async createOrFindSiteTextOnGraph(
    languageId: Nanoid,
    siteText: string,
    definitionText: string,
  ): Promise<{ wordId: Nanoid; definitionId: Nanoid; relationshipId: Nanoid }> {
    // TODO: refactor code that uses this method to provide proper LanguageInfo here and replace mocked value
    const langInfo_mocked: LanguageInfo = {
      lang: {
        tag: 'ua',
        descriptions: [
          'mocked lang tag as "ua", use new language Selector to get LangInfo values from user',
        ],
      },
    };
    console.log(
      `use langInfo_mocked ${JSON.stringify(
        langInfo_mocked,
      )} in place of langId ${languageId}`,
    );

    const wordId = await this.wordService.createWordOrPhraseWithLang(
      siteText,
      langInfo_mocked,
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

  private async getSiteTextDto(
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

    const definitionDto = await this.definitionService.getDefinitionWithWord(
      relationship.id,
    );

    if (!definitionDto) {
      throw new Error('Cannot get a DefinitionDto with given relationship');
    }

    return {
      siteTextId,
      relationshipId: relationship.id,
      languageId: definitionDto.languageId,
      siteText: definitionDto.wordText,
      definition: definitionDto.definitionText,
    } as SiteTextDto;
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
    languageId: Nanoid,
    siteText: string,
    definitionText: string,
  ): Promise<{ wordId: Nanoid; definitionId: Nanoid; relationshipId: Nanoid }> {
    const { wordId, definitionId, relationshipId } =
      await this.createOrFindSiteTextOnGraph(
        languageId,
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
    );

    return {
      wordId,
      definitionId,
      relationshipId,
    };
  }

  async createOrFindTranslation(
    definitionRelationshipId: Nanoid,
    languageId: Nanoid,
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
        languageId,
        translatedSiteText,
        translatedDefinitionText,
      );

    await this.translationService.createOrFindWordTranslation(
      rel.from_node_id,
      {
        word: translatedSiteText,
        languageId,
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

  async getTranslationListBySiteTextRel(
    appId: Nanoid,
    original: SiteTextDto,
    languageId: Nanoid,
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

    if (!election) {
      throw new Error('Not exists election entity with given props');
    }

    const candidates: Candidate[] =
      await this.votingService.getCandidateListByElectionId(election.id);

    const filteredCandidates: Candidate[] =
      await this.filterDefinitionCanddiatesByLanguage(candidates, languageId);

    const translatedSiteTexts: SiteTextTranslationDto[] = [];

    for (const candidate of filteredCandidates) {
      const definitionDto = await this.definitionService.getDefinitionWithWord(
        candidate.candidate_ref,
      );

      if (!definitionDto) {
        continue;
      }

      const votingStatus = await this.votingService.getVotesStats(candidate.id);

      const translated = {
        original,
        languageId,
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
    languageId: Nanoid,
  ): Promise<SiteTextTranslationDto | null> {
    const recommended = await this.getRecommendedDefinition(appId, siteTextId);

    if (!recommended) {
      return null;
    }

    const original = await this.getSiteTextDto(siteTextId, recommended.id!);

    if (original.languageId === languageId) {
      return {
        original,
        languageId: languageId,
        translatedSiteText: original.siteText,
        translatedDefinition: original.definition,
        upVotes: 0,
        downVotes: 0,
        candidateId: original.siteTextId,
      };
    }

    const translationList = await this.getTranslationListBySiteTextRel(
      appId,
      original,
      languageId,
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
    sourceLanguageId: Nanoid,
    targetLanguageId: Nanoid,
  ): Promise<TranslatedSiteTextDto[]> {
    const siteTextList = await this.getSiteTextListByAppId(appId);

    const translatedSiteTextList: TranslatedSiteTextDto[] = [];

    for (const siteText of siteTextList) {
      const recommended = await this.getRecommendedSiteText(
        appId,
        siteText.id,
        sourceLanguageId,
      );

      let translationCnt = 0;
      const definitionList = await this.getDefinitionList(appId, siteText.id);

      for (const definition of definitionList) {
        const original = await this.getSiteTextDto(siteText.id, definition.id!);
        const translationList = await this.getTranslationListBySiteTextRel(
          appId,
          original,
          targetLanguageId,
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
