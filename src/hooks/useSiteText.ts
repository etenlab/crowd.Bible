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
      createLoadingStack,
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

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();

        const siteTextEntity =
          await singletons.siteTextService.createOrFindSiteText(
            appId,
            languageInfo,
            siteText,
            definitionText,
          );

        stopLoading();

        return siteTextEntity.definitionId;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, createLoadingStack, logger],
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

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();

        const result = await singletons.siteTextService.createOrFindTranslation(
          appId,
          definitionRelationshipId,
          languageInfo,
          translatedSiteText,
          translatedDefinitionText,
        );

        stopLoading();

        return result;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, createLoadingStack, logger],
  );

  const getDefinitionList = useCallback(
    async (appId: Nanoid, siteTextId: Nanoid): Promise<VotableContent[]> => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at listElections');
        return [];
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();

        const result = await singletons.siteTextService.getDefinitionList(
          appId,
          siteTextId,
        );

        stopLoading();

        return result;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return [];
      }
    },
    [singletons, alertFeedback, createLoadingStack, logger],
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

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();

        const result =
          await singletons.siteTextService.getTranslationListBySiteTextRel(
            appId,
            original,
            languageInfo,
          );

        stopLoading();

        return result;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return [];
      }
    },
    [singletons, alertFeedback, createLoadingStack, logger],
  );

  const getRecommendedSiteText = useCallback(
    async (appId: Nanoid, siteTextId: Nanoid, languageInfo: LanguageInfo) => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at addBallotEntry');
        return null;
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const result = await singletons.siteTextService.getRecommendedSiteText(
          appId,
          siteTextId,
          languageInfo,
        );

        stopLoading();

        return result;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, createLoadingStack, logger],
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

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const result =
          await singletons.siteTextService.getTranslatedSiteTextListByAppId(
            appId,
            sourceLanguageInfo,
            targetLanguageInfo,
          );

        stopLoading();

        return result;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return [];
      }
    },
    [singletons, alertFeedback, createLoadingStack, logger],
  );

  const getSiteTextDto = useCallback(
    async (siteTextId: Nanoid, definitionId: Nanoid) => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at addBallotEntry');
        return null;
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const result = await singletons.siteTextService.getSiteTextDto(
          siteTextId,
          definitionId,
        );

        stopLoading();

        return result;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, createLoadingStack, logger],
  );

  const getSiteTextDtoWithRel = useCallback(
    async (definitionRel: Nanoid) => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at addBallotEntry');
        return null;
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const result = await singletons.siteTextService.getSiteTextDtoWithRel(
          definitionRel,
        );

        stopLoading();

        return result;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, createLoadingStack, logger],
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

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const result =
          await singletons.siteTextService.getSiteTextTranslationDtoWithRel(
            appId,
            originalDefinitionRel,
            translatedDefinitionRel,
          );

        stopLoading();

        return result;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, createLoadingStack, logger],
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

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();

        if (!translated!.candidateId) {
          alertFeedback(
            FeedbackTypes.ERROR,
            'Cannot find such candidate at useSiteText hooks!',
          );
          stopLoading();
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
          stopLoading();
          return {
            originalDefinitionRel: translated!.original.relationshipId,
            translatedDefinitionRel: null,
          };
        }
        stopLoading();

        return {
          originalDefinitionRel: translated!.original.relationshipId,
          translatedDefinitionRel: candidate.candidate_ref,
        };
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return {
          originalDefinitionRel: null,
          translatedDefinitionRel: null,
        };
      }
    },
    [singletons, alertFeedback, createLoadingStack, getCandidateById, logger],
  );

  const loadSiteTextMap = useCallback(async () => {
    if (!singletons || !crowdBibleApp) {
      alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at loadSiteTextMap');
      return;
    }

    const { startLoading, stopLoading } = createLoadingStack();

    try {
      startLoading();

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
          siteText: data.sourceSiteText || data.siteText,
          isTranslated: !!(
            data.sourceSiteText && data.sourceSiteText.length > 0
          ),
        };
      });

      setSiteTextMap(temp);

      stopLoading();
    } catch (err) {
      logger.error(err);
      stopLoading();
      alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
      return;
    }
  }, [
    singletons,
    crowdBibleApp,
    alertFeedback,
    createLoadingStack,
    appLanguage,
    setSiteTextMap,
    logger,
  ]);

  const saveTempSiteTexts = useCallback(async () => {
    if (!singletons || !crowdBibleApp) {
      return;
    }

    const { startLoading, stopLoading } = createLoadingStack();

    startLoading();

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

    stopLoading();
    loadSiteTextMap();
  }, [
    singletons,
    crowdBibleApp,
    createLoadingStack,
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

    const { startLoading, stopLoading } = createLoadingStack();

    try {
      startLoading();

      const result = await singletons.siteTextService.getAppLanguageList(
        crowdBibleApp.id,
      );

      stopLoading();

      return result;
    } catch (err) {
      logger.error(err);
      stopLoading();
      alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
      return [];
    }
  }, [singletons, crowdBibleApp, alertFeedback, createLoadingStack, logger]);

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
