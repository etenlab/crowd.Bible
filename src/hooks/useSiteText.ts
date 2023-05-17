import { useCallback } from 'react';
import { useAppContext } from '@/hooks/useAppContext';

import { LanguageInfo } from '@eten-lab/ui-kit/dist/LangSelector/LangSelector';
import { VotableContent } from '../dtos/votable-item.dto';

import { SiteTextDto } from '@/dtos/site-text.dto';

export function useSiteText() {
  const {
    states: {
      global: { singletons },
      // documentTools: { sourceLanguage, targetLanguage },
    },
    actions: { alertFeedback, setLoadingState },
  } = useAppContext();

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
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState],
  );

  const createOrFindTranslation = useCallback(
    async (
      definitionRelationshipId: Nanoid,
      languageInfo: LanguageInfo,
      translatedSiteText: string,
      translatedDefinitionText: string,
    ) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at listElections');
        return null;
      }

      try {
        setLoadingState(true);

        const result = await singletons.siteTextService.createOrFindTranslation(
          definitionRelationshipId,
          languageInfo,
          translatedSiteText,
          translatedDefinitionText,
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
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return [];
      }
    },
    [singletons, alertFeedback, setLoadingState],
  );

  const getTranslationListBySiteTextRel = useCallback(
    async (
      appId: Nanoid,
      original: SiteTextDto,
      languageInfo: LanguageInfo,
    ) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at getElectionFull');
        return null;
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
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState],
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
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState],
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

      // if (!sourceLanguage) {
      //   alertFeedback('error', 'Not exists target language!');
      //   return null;
      // }

      // if (!targetLanguage) {
      //   alertFeedback('error', 'Not exists target language!');
      //   return null;
      // }

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
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return [];
      }
    },
    [singletons, alertFeedback, setLoadingState],
  );

  return {
    createOrFindSiteText,
    createOrFindTranslation,
    getDefinitionList,
    getTranslationListBySiteTextRel,
    getRecommendedSiteText,
    getTranslatedSiteTextListByAppId,
  };
}
