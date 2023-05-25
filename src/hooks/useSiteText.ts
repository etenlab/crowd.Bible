import { useCallback } from 'react';

import { useAppContext } from '@/hooks/useAppContext';
import { useVote } from '@/hooks/useVote';

import { LanguageInfo } from '@eten-lab/ui-kit';
import { VotableContent } from '../dtos/votable-item.dto';

import { SiteTextDto, SiteTextTranslationDto } from '@/dtos/site-text.dto';

import { compareLangInfo } from '@/utils/langUtils';

export function useSiteText() {
  const {
    states: {
      global: { singletons },
      // documentTools: { sourceLanguage, targetLanguage },
    },
    actions: { alertFeedback, setLoadingState },
    logger,
  } = useAppContext();

  const { getCandidateById } = useVote();

  const createOrFindSiteText = useCallback(
    async (
      appId: Nanoid,
      languageInfo: LanguageInfo,
      siteText: string,
      definitionText: string,
    ) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at createOrFindSiteText');
        return null;
      }

      try {
        setLoadingState(true);

        const siteTextEntity =
          await singletons.siteTextService.createOrFindSiteText(
            appId,
            languageInfo,
            siteText,
            definitionText,
          );

        setLoadingState(false);
        alertFeedback('success', 'Created a new Site Text!');

        return siteTextEntity.definitionId;
      } catch (err) {
        logger.error(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState, logger],
  );

  const createOrFindTranslation = useCallback(
    async (
      appId: Nanoid,
      definitionRelationshipId: Nanoid,
      languageInfo: LanguageInfo,
      translatedSiteText: string,
      translatedDefinitionText: string,
    ) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at listElections');
        return null;
      }

      if (translatedSiteText.trim().length === 0) {
        alertFeedback(
          'error',
          'translated site text should be non empty string!',
        );
        return null;
      }

      if (translatedDefinitionText.trim().length === 0) {
        alertFeedback(
          'error',
          'translated site text definition should be non empty string!',
        );
        return null;
      }

      try {
        setLoadingState(true);

        const result = await singletons.siteTextService.createOrFindTranslation(
          appId,
          definitionRelationshipId,
          languageInfo,
          translatedSiteText,
          translatedDefinitionText,
        );

        setLoadingState(false);

        return result;
      } catch (err) {
        logger.error(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState, logger],
  );

  const getDefinitionList = useCallback(
    async (appId: Nanoid, siteTextId: Nanoid): Promise<VotableContent[]> => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at listElections');
        return [];
      }

      try {
        setLoadingState(true);

        const result = await singletons.siteTextService.getDefinitionList(
          appId,
          siteTextId,
        );

        setLoadingState(false);

        return result;
      } catch (err) {
        logger.error(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return [];
      }
    },
    [singletons, alertFeedback, setLoadingState, logger],
  );

  const getTranslationListBySiteTextRel = useCallback(
    async (
      appId: Nanoid,
      original: SiteTextDto,
      languageInfo: LanguageInfo,
    ) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at getElectionFull');
        return [];
      }

      try {
        setLoadingState(true);

        const result =
          await singletons.siteTextService.getTranslationListBySiteTextRel(
            appId,
            original,
            languageInfo,
          );

        setLoadingState(false);

        return result;
      } catch (err) {
        logger.error(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return [];
      }
    },
    [singletons, alertFeedback, setLoadingState, logger],
  );

  const getRecommendedSiteText = useCallback(
    async (appId: Nanoid, siteTextId: Nanoid, languageInfo: LanguageInfo) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at addBallotEntry');
        return null;
      }

      try {
        setLoadingState(true);
        const result = await singletons.siteTextService.getRecommendedSiteText(
          appId,
          siteTextId,
          languageInfo,
        );

        setLoadingState(false);

        return result;
      } catch (err) {
        logger.error(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState, logger],
  );

  const getTranslatedSiteTextListByAppId = useCallback(
    async (
      appId: Nanoid,
      sourceLanguageInfo: LanguageInfo,
      targetLanguageInfo: LanguageInfo,
    ) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at addBallotEntry');
        return [];
      }

      try {
        setLoadingState(true);
        const result =
          await singletons.siteTextService.getTranslatedSiteTextListByAppId(
            appId,
            sourceLanguageInfo,
            targetLanguageInfo,
          );

        setLoadingState(false);

        return result;
      } catch (err) {
        logger.error(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return [];
      }
    },
    [singletons, alertFeedback, setLoadingState, logger],
  );

  const getSiteTextDto = useCallback(
    async (siteTextId: Nanoid, definitionId: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at addBallotEntry');
        return null;
      }

      try {
        setLoadingState(true);
        const result = await singletons.siteTextService.getSiteTextDto(
          siteTextId,
          definitionId,
        );

        setLoadingState(false);

        return result;
      } catch (err) {
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState],
  );

  const getSiteTextDtoWithRel = useCallback(
    async (definitionRel: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at addBallotEntry');
        return null;
      }

      try {
        setLoadingState(true);
        const result = await singletons.siteTextService.getSiteTextDtoWithRel(
          definitionRel,
        );

        setLoadingState(false);

        return result;
      } catch (err) {
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState],
  );

  const getSiteTextTranslationDtoWithRel = useCallback(
    async (
      appId: Nanoid,
      originalDefinitionRel: Nanoid,
      translatedDefinitionRel: Nanoid,
    ) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at addBallotEntry');
        return null;
      }

      try {
        setLoadingState(true);
        const result =
          await singletons.siteTextService.getSiteTextTranslationDtoWithRel(
            appId,
            originalDefinitionRel,
            translatedDefinitionRel,
          );

        setLoadingState(false);

        return result;
      } catch (err) {
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState],
  );

  const getOriginalAndTranslatedRelFromSiteTextTranslationDto = useCallback(
    async ({
      original,
      translated,
    }: {
      original: SiteTextDto | null;
      translated: SiteTextTranslationDto | null;
    }) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at addBallotEntry');
        return {
          originalDefinitionRel: null,
          translatedDefinitionRel: null,
        };
      }

      if (!translated && !original) {
        return {
          originalDefinitionRel: null,
          translatedDefinitionRel: null,
        };
      } else if (original && !translated) {
        return {
          originalDefinitionRel: original.relationshipId,
          translatedDefinitionRel: null,
        };
      } else if (
        translated &&
        compareLangInfo(
          translated.languageInfo,
          translated.original.languageInfo,
        )
      ) {
        return {
          originalDefinitionRel: translated.original.relationshipId,
          translatedDefinitionRel: null,
        };
      }

      try {
        setLoadingState(true);

        if (!translated!.candidateId) {
          alertFeedback(
            'error',
            'Cannot find such candidate at useSiteText hooks!',
          );
          setLoadingState(false);
          return {
            originalDefinitionRel: translated!.original.relationshipId,
            translatedDefinitionRel: null,
          };
        }

        const candidate = await getCandidateById(translated!.candidateId);

        if (!candidate) {
          alertFeedback(
            'error',
            'Cannot find such candidate at useSiteText hooks!',
          );
          setLoadingState(false);
          return {
            originalDefinitionRel: translated!.original.relationshipId,
            translatedDefinitionRel: null,
          };
        }
        setLoadingState(false);

        return {
          originalDefinitionRel: translated!.original.relationshipId,
          translatedDefinitionRel: candidate.candidate_ref,
        };
      } catch (err) {
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return {
          originalDefinitionRel: null,
          translatedDefinitionRel: null,
        };
      }
    },
    [singletons, alertFeedback, setLoadingState, getCandidateById],
  );

  return {
    createOrFindSiteText,
    createOrFindTranslation,
    getDefinitionList,
    getTranslationListBySiteTextRel,
    getRecommendedSiteText,
    getTranslatedSiteTextListByAppId,
    getSiteTextDto,
    getSiteTextDtoWithRel,
    getSiteTextTranslationDtoWithRel,
    getOriginalAndTranslatedRelFromSiteTextTranslationDto,
  };
}
