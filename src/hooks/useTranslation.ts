import { useCallback } from 'react';

import { useAppContext } from '@/hooks/useAppContext';
import { LanguageInfo } from '@eten-lab/ui-kit';
import { UserDto } from '@/dtos/user.dto';

export function useTranslation() {
  const {
    states: {
      global: { singletons, user },
      documentTools: { targetLanguage },
    },
    actions: { alertFeedback, setLoadingState },
  } = useAppContext();

  const createOrFindWordSequenceTranslation = useCallback(
    async (
      originalWordSequenceId: Nanoid,
      translation: {
        text: string;
        languageInfo?: LanguageInfo;
        documentId?: Nanoid;
      },
    ) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at createTranslation');
        return null;
      }

      if (!user) {
        alertFeedback('error', 'Not exists log in user!');
        return null;
      }

      if (!targetLanguage && !translation.languageInfo) {
        alertFeedback('error', 'Not exists target language!');
        return null;
      }

      if (translation.text.trim() === '') {
        alertFeedback('error', 'Translation cannot be empty string!');
      }

      try {
        setLoadingState(true);
        const userNode = await singletons.userService.createOrFindUser(
          user.userEmail,
        );

        if (!userNode) {
          return null;
        }

        const { wordSequenceTranslationRelationshipId } =
          await singletons.translationService.createOrFindWordSequenceTranslation(
            originalWordSequenceId,
            {
              text: translation.text,
              creatorId: userNode.id,
              languageInfo: translation.languageInfo || targetLanguage!,
              documentId: translation.documentId,
            },
          );

        if (!wordSequenceTranslationRelationshipId) {
          setLoadingState(false);
          return null;
        }

        setLoadingState(false);
        return wordSequenceTranslationRelationshipId;
      } catch (err) {
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, user, targetLanguage, setLoadingState],
  );

  const createOrFindDefinitionTranslation = useCallback(
    async (originalDefinitionId: Nanoid, translatedDefinitionId: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at createTranslation');
        return null;
      }

      try {
        setLoadingState(true);

        const { translationRelationshipId } =
          await singletons.translationService.createOrFindDefinitionTranslation(
            originalDefinitionId,
            translatedDefinitionId,
          );

        if (!translationRelationshipId) {
          setLoadingState(false);
          return null;
        }

        setLoadingState(false);
        return translationRelationshipId;
      } catch (err) {
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState],
  );

  const createOrFindWordTranslation = useCallback(
    async (
      originalWordId: Nanoid,
      translation: {
        word: string;
        languageInfo?: LanguageInfo;
      },
    ) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at createTranslation');
        return null;
      }

      if (!targetLanguage && !translation.languageInfo) {
        alertFeedback('error', 'Not exists target language!');
        return null;
      }

      if (translation.word.trim() === '') {
        alertFeedback('error', 'Translation cannot be empty string!');
      }

      try {
        setLoadingState(true);

        const { wordTranslationRelationshipId } =
          await singletons.translationService.createOrFindWordTranslation(
            originalWordId,
            {
              word: translation.word,
              languageInfo: translation.languageInfo || targetLanguage!,
            },
          );

        if (!wordTranslationRelationshipId) {
          setLoadingState(false);
          return null;
        }

        setLoadingState(false);
        return wordTranslationRelationshipId;
      } catch (err) {
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, targetLanguage, setLoadingState],
  );

  const getRecommendedTranslationId = useCallback(
    async (originalId: Nanoid, languageInfo?: LanguageInfo) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at createTranslation');
        return null;
      }

      if (!targetLanguage && !languageInfo) {
        alertFeedback('error', 'Not exists target language!');
        return null;
      }

      try {
        setLoadingState(true);

        const recommendedId =
          await singletons.translationService.getRecommendedTranslationId(
            originalId,
            targetLanguage || languageInfo!,
          );

        if (!recommendedId) {
          setLoadingState(false);
          return null;
        }

        setLoadingState(false);
        return recommendedId;
      } catch (err) {
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, targetLanguage, setLoadingState],
  );

  const listTranslationsByWordSequenceId = useCallback(
    async (wordSequenceId: Nanoid, isUserId = false) => {
      if (!singletons) {
        alertFeedback(
          'error',
          'Internal Error! at listTranslationsByDocumentId',
        );
        return [];
      }

      if (!targetLanguage) {
        alertFeedback('error', 'Not exists target language!');
        return [];
      }

      if (!user && isUserId) {
        alertFeedback('error', 'Not exists log in user!');
        return [];
      }

      try {
        setLoadingState(true);

        let userNode: UserDto;

        if (isUserId) {
          userNode = await singletons.userService.createOrFindUser(
            user!.userEmail,
          );

          if (!userNode) {
            return [];
          }
        }

        const result =
          await singletons.translationService.listTranslationsByWordSequenceId(
            wordSequenceId,
            targetLanguage,
            isUserId ? userNode!.id : undefined,
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
    [singletons, alertFeedback, user, targetLanguage, setLoadingState],
  );

  return {
    createOrFindWordSequenceTranslation,
    createOrFindDefinitionTranslation,
    createOrFindWordTranslation,
    getRecommendedTranslationId,
    listTranslationsByWordSequenceId,
  };
}
