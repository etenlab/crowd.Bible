import { useCallback } from 'react';

import { useAppContext } from '@/hooks/useAppContext';
import { useVote } from '@/hooks/useVote';

import { LanguageInfo } from '@eten-lab/ui-kit';
import { VotableContent } from '@/dtos/votable-item.dto';

import { SiteTextDto, SiteTextTranslationDto } from '@/dtos/site-text.dto';

import { compareLangInfo } from '@/utils/langUtils';
import { FeedbackTypes } from '@/constants/common.constant';

export function useSiteText() {
  const {
    states: {
      global: { singletons, appLanguage, tempSiteTexts, crowdBibleApp },
    },
    actions: {
      alertFeedback,
      setLoadingState,
      setSiteTextMap,
      clearTempSiteTexts,
    },
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
        alertFeedback(
          FeedbackTypes.ERROR,
          'Internal Error! at createOrFindSiteText',
        );
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

        return siteTextEntity.definitionId;
      } catch (err) {
        logger.error(err);
        setLoadingState(false);
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
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
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at listElections');
        return null;
      }

      if (translatedSiteText.trim().length === 0) {
        alertFeedback(
          FeedbackTypes.ERROR,
          'translated site text should be non empty string!',
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
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState, logger],
  );

  const getDefinitionList = useCallback(
    async (appId: Nanoid, siteTextId: Nanoid): Promise<VotableContent[]> => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at listElections');
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
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
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
        alertFeedback(
          FeedbackTypes.ERROR,
          'Internal Error! at getElectionFull',
        );
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
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return [];
      }
    },
    [singletons, alertFeedback, setLoadingState, logger],
  );

  const getRecommendedSiteText = useCallback(
    async (appId: Nanoid, siteTextId: Nanoid, languageInfo: LanguageInfo) => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at addBallotEntry');
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
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
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
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at addBallotEntry');
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
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return [];
      }
    },
    [singletons, alertFeedback, setLoadingState, logger],
  );

  const getSiteTextDto = useCallback(
    async (siteTextId: Nanoid, definitionId: Nanoid) => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at addBallotEntry');
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
        logger.error(err);
        setLoadingState(false);
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState, logger],
  );

  const getSiteTextDtoWithRel = useCallback(
    async (definitionRel: Nanoid) => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at addBallotEntry');
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
        logger.error(err);
        setLoadingState(false);
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState, logger],
  );

  const getSiteTextTranslationDtoWithRel = useCallback(
    async (
      appId: Nanoid,
      originalDefinitionRel: Nanoid,
      translatedDefinitionRel: Nanoid,
    ) => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at addBallotEntry');
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
        logger.error(err);
        setLoadingState(false);
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState, logger],
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
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at addBallotEntry');
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
            FeedbackTypes.ERROR,
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
            FeedbackTypes.ERROR,
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
        logger.error(err);
        setLoadingState(false);
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return {
          originalDefinitionRel: null,
          translatedDefinitionRel: null,
        };
      }
    },
    [singletons, alertFeedback, setLoadingState, getCandidateById, logger],
  );

  const loadSiteTextMap = useCallback(async () => {
    if (!singletons || !crowdBibleApp) {
      alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at loadSiteTextMap');
      return;
    }

    try {
      setLoadingState(true, 'Loading Site Text Map', undefined, true);

      const candidate =
        await singletons.siteTextService.getTranslatedSiteTextListByAppId(
          crowdBibleApp.id,
          appLanguage,
          appLanguage,
        );

      const temp: Record<string, { siteText: string; isTranslated: boolean }> =
        {};

      candidate.forEach((data) => {
        temp[data.siteText] = {
          siteText: data.translatedSiteText || data.siteText,
          isTranslated: !!(
            data.translatedSiteText && data.translatedSiteText.length > 0
          ),
        };
      });

      setSiteTextMap(temp);

      setLoadingState(false);
    } catch (err) {
      logger.error(err);
      setLoadingState(false);
      alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
      return;
    }
  }, [
    singletons,
    crowdBibleApp,
    alertFeedback,
    setLoadingState,
    appLanguage,
    setSiteTextMap,
    logger,
  ]);

  const saveTempSiteTexts = useCallback(async () => {
    if (!singletons || !crowdBibleApp) {
      return;
    }

    setLoadingState(true);

    for (const item of tempSiteTexts) {
      try {
        await singletons.siteTextService.createOrFindSiteText(
          item.appId,
          item.languageInfo,
          item.siteText,
          item.definition,
        );
      } catch (err) {
        logger.error(err);
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at TrWithInto');
      }
    }

    clearTempSiteTexts();

    setLoadingState(false);
    loadSiteTextMap();
  }, [
    singletons,
    crowdBibleApp,
    setLoadingState,
    clearTempSiteTexts,
    loadSiteTextMap,
    tempSiteTexts,
    logger,
    alertFeedback,
  ]);

  const getAppLanguageList = useCallback(async (): Promise<LanguageInfo[]> => {
    if (!singletons || !crowdBibleApp) {
      alertFeedback(
        FeedbackTypes.ERROR,
        'Internal Error! at getAppLanguageList',
      );
      return [];
    }

    try {
      setLoadingState(true);

      const result = await singletons.siteTextService.getAppLanguageList(
        crowdBibleApp.id,
      );

      setLoadingState(false);

      return result;
    } catch (err) {
      logger.error(err);
      setLoadingState(false);
      alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
      return [];
    }
  }, [singletons, crowdBibleApp, alertFeedback, setLoadingState, logger]);

  return {
    loadSiteTextMap,
    saveTempSiteTexts,
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
    getAppLanguageList,
  };
}
