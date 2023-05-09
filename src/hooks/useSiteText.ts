import { useCallback } from 'react';
import { useAppContext } from '@/hooks/useAppContext';

import { SiteTextWithTranslationCntDto } from '@/dtos/site-text.dto';
import { LanguageInfo } from '@eten-lab/ui-kit/dist/LangSelector/LangSelector';
import { NodeTypeConst } from '../constants/graph.constant';
import { VotableContent } from '../dtos/votable-item.dto';

export function useSiteText() {
  const {
    states: {
      global: { singletons },
      documentTools: { sourceLanguage, targetLanguage },
    },
    actions: { alertFeedback, setLoadingState },
  } = useAppContext();

  const createSiteText = useCallback(
    async (
      appId: Nanoid,
      languageId: Nanoid,
      siteText: string,
      definitionText: string,
    ) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at createOrFindSiteText');
        return null;
      }

      try {
        setLoadingState(true);

        const oldSiteTexts = await singletons.siteTextService.getSiteTextsByRef(
          appId,
          languageId,
          siteText,
        );

        if (oldSiteTexts.length > 0) {
          alertFeedback('error', 'Already exists same site text!');
          setLoadingState(false);
          return null;
        }

        const siteTextEntity =
          await singletons.siteTextService.createOrFindSiteText(
            appId,
            languageId,
            siteText,
            definitionText,
          );

        setLoadingState(false);
        alertFeedback('success', 'Created a new Site Text!');

        return siteTextEntity.id;
      } catch (err) {
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState],
  );

  const createOrFindSiteTextTranslationCandidate = useCallback(
    async (
      siteTextId: Nanoid,
      translatedSiteText: string,
      translatedDescription: string,
    ) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at listElections');
        return null;
      }

      if (targetLanguage === null) {
        alertFeedback('error', 'Not selected Target Language!');
        return null;
      }

      try {
        setLoadingState(true);

        const result =
          await singletons.siteTextService.createOrFindSiteTextTranslationCandidate(
            siteTextId,
            targetLanguage.id,
            translatedSiteText,
            translatedDescription,
          );

        setLoadingState(false);

        return result.id;
      } catch (err) {
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState, targetLanguage],
  );

  const getSiteTextListByAppId = useCallback(
    async (appId: Nanoid): Promise<SiteTextWithTranslationCntDto[]> => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at listElections');
        return [];
      }

      if (sourceLanguage === null) {
        alertFeedback('error', 'Not selected Source Language!');
        return [];
      }

      if (targetLanguage === null) {
        alertFeedback('error', 'Not selected Target Language!');
        return [];
      }

      try {
        setLoadingState(true);

        const result = await singletons.siteTextService.getSiteTextListByAppId(
          appId,
          sourceLanguage.id,
          targetLanguage.id,
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
    [
      singletons,
      alertFeedback,
      setLoadingState,
      sourceLanguage,
      targetLanguage,
    ],
  );

  const getSiteTextWithTranslationCandidates = useCallback(
    async (
      siteTextId: Nanoid,
      sourceLanguageId?: Nanoid,
      targetLanguageId?: Nanoid,
    ) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at getElectionFull');
        return null;
      }

      if (sourceLanguage === null && !sourceLanguageId) {
        alertFeedback('error', 'Not selected Source Language!');
        return null;
      }

      if (targetLanguage === null && !targetLanguageId) {
        alertFeedback('error', 'Not selected Target Language!');
        return null;
      }

      try {
        setLoadingState(true);

        const result =
          await singletons.siteTextService.getSiteTextWithTranslationCandidates(
            siteTextId,
            sourceLanguageId ? sourceLanguageId : sourceLanguage!.id,
            targetLanguageId ? targetLanguageId : targetLanguage!.id,
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
    [
      singletons,
      alertFeedback,
      setLoadingState,
      sourceLanguage,
      targetLanguage,
    ],
  );

  const getSelectedSiteTextTranslation = useCallback(
    async (siteTextId: Nanoid, langId?: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at addBallotEntry');
        return null;
      }

      if (targetLanguage === null && !langId) {
        alertFeedback('error', 'Not selected Target Language!');
        return null;
      }

      try {
        setLoadingState(true);
        const result =
          await singletons.siteTextService.getSelectedSiteTextTranslation(
            siteTextId,
            langId ? langId : targetLanguage!.id,
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
    [singletons, alertFeedback, setLoadingState, targetLanguage],
  );

  const getSiteTextTranslationVotableById = useCallback(
    async (id: Nanoid, electionId?: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at addBallotEntry');
        return null;
      }

      try {
        setLoadingState(true);
        const result =
          await singletons.siteTextService.getSiteTextTranslationVotableById(
            id,
            electionId,
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

  const changeSiteTextDefinitionRef = useCallback(
    async (siteTextId: Nanoid, definitionRef: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at listElections');
        return null;
      }

      if (sourceLanguage === null) {
        alertFeedback('error', 'Not selected Source Language!');
        return null;
      }

      try {
        setLoadingState(true);

        await singletons.siteTextService.changeSiteTextDefinitionRef(
          siteTextId,
          sourceLanguage.id,
          definitionRef,
        );
        setLoadingState(false);

        return null;
      } catch (err) {
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState, sourceLanguage],
  );

  const selectSiteTextTranslationCandidate = useCallback(
    async (siteTextTranslationId: Nanoid, siteTextId: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at getBallotEntryId');
        return false;
      }

      try {
        setLoadingState(true);

        await singletons.siteTextService.selectSiteTextTranslationCandidate(
          siteTextTranslationId,
          siteTextId,
        );

        setLoadingState(false);

        return true;
      } catch (err) {
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return false;
      }
    },
    [singletons, alertFeedback, setLoadingState],
  );

  const cancelSiteTextTranslationCandidate = useCallback(
    async (siteTextId: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at getVotesStats');
        return null;
      }

      if (targetLanguage === null) {
        alertFeedback('error', 'Not selected Target Language!');
        return null;
      }

      try {
        setLoadingState(true);
        await singletons.siteTextService.cancelSiteTextTranslationCandidate(
          siteTextId,
          targetLanguage.id,
        );
        setLoadingState(false);
        return null;
      } catch (err) {
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState, targetLanguage],
  );

  const getDefinitioinVotableContentByWord = useCallback(
    async (word: string, langId: Nanoid): Promise<VotableContent[]> => {
      if (!singletons) {
        alertFeedback(
          'error',
          'Internal Error! at getDefinitioinVotableContentByWord',
        );
        return [];
      }

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
        )} in place of langId ${langId}`,
      );

      try {
        setLoadingState(true);
        const wordAndDefinitions =
          await singletons.definitionService.getVotableItems(
            langInfo_mocked,
            NodeTypeConst.WORD,
            [
              {
                key: 'name',
                value: word,
              },
            ],
          );

        setLoadingState(false);

        return wordAndDefinitions[0].contents;
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        setLoadingState(false);
        return [];
      }
    },
    [singletons, alertFeedback, setLoadingState],
  );

  const getSiteTextById = useCallback(
    async (id: Nanoid) => {
      if (!singletons) {
        alertFeedback(
          'error',
          'Internal Error! at getDefinitioinVotableContentByWord',
        );
        return null;
      }

      try {
        setLoadingState(true);

        const result = await singletons.siteTextService.getSiteTextById(id);

        setLoadingState(false);

        return result;
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        setLoadingState(false);
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState],
  );

  const editSiteTextWordAndDescription = useCallback(
    async (siteTextId: Nanoid, word: string, description: string) => {
      if (!singletons) {
        alertFeedback(
          'error',
          'Internal Error! at getDefinitioinVotableContentByWord',
        );
        return null;
      }

      try {
        setLoadingState(true);

        await singletons.siteTextService.editSiteTextWordAndDescription(
          siteTextId,
          word,
          description,
        );

        setLoadingState(false);

        return true;
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        setLoadingState(false);
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState],
  );

  const getTranslatedSiteText = useCallback(
    async (siteTextId: Nanoid) => {
      if (!singletons) {
        alertFeedback(
          'error',
          'Internal Error! at getDefinitioinVotableContentByWord',
        );
        return null;
      }

      if (sourceLanguage === null) {
        alertFeedback('error', 'Not selected Source Language!');
        return null;
      }

      try {
        setLoadingState(true);

        const result =
          await singletons.siteTextService.getSiteTextByIdAndLanguageId(
            siteTextId,
            sourceLanguage.id,
          );

        setLoadingState(false);

        return result;
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        setLoadingState(false);
        return null;
      }
    },
    [singletons, sourceLanguage, alertFeedback, setLoadingState],
  );

  return {
    createSiteText,
    createOrFindSiteTextTranslationCandidate,
    getSiteTextListByAppId,
    getSiteTextWithTranslationCandidates,
    getSiteTextTranslationVotableById,
    changeSiteTextDefinitionRef,
    selectSiteTextTranslationCandidate,
    cancelSiteTextTranslationCandidate,
    getSelectedSiteTextTranslation,
    getDefinitioinVotableContentByWord,
    getSiteTextById,
    editSiteTextWordAndDescription,
    getTranslatedSiteText,
  };
}
