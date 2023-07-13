import { useCallback } from 'react';

import { useAppContext } from '@/hooks/useAppContext';
import { LanguageInfo } from '@eten-lab/ui-kit';
import { UserDto } from '@/dtos/user.dto';

import { compareLangInfo } from '@/utils/langUtils';
import { FeedbackTypes } from '@/constants/common.constant';

export function useTranslation() {
  const {
    states: {
      global: { singletons, user },
      documentTools: { targetLanguage },
    },
    actions: { alertFeedback, createLoadingStack },
    logger,
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
        alertFeedback(
          FeedbackTypes.ERROR,
          'Internal Error! at createTranslation',
        );
        return null;
      }

      if (!user) {
        alertFeedback(FeedbackTypes.ERROR, 'Not exists log in user!');
        return null;
      }

      if (!targetLanguage && !translation.languageInfo) {
        alertFeedback(FeedbackTypes.ERROR, 'Not exists target language!');
        return null;
      }

      if (translation.text.trim() === '') {
        alertFeedback(
          FeedbackTypes.ERROR,
          'Translation cannot be empty string!',
        );
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const userNode = await singletons.userService.createOrFindUser(
          user.email,
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
          stopLoading();
          return null;
        }

        stopLoading();
        return wordSequenceTranslationRelationshipId;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [
      singletons,
      alertFeedback,
      user,
      targetLanguage,
      createLoadingStack,
      logger,
    ],
  );

  const createOrFindDefinitionTranslation = useCallback(
    async (originalDefinitionId: Nanoid, translatedDefinitionId: Nanoid) => {
      if (!singletons) {
        alertFeedback(
          FeedbackTypes.ERROR,
          'Internal Error! at createTranslation',
        );
        return null;
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();

        const { translationRelationshipId } =
          await singletons.translationService.createOrFindDefinitionTranslation(
            originalDefinitionId,
            translatedDefinitionId,
          );

        if (!translationRelationshipId) {
          stopLoading();
          return null;
        }

        stopLoading();
        return translationRelationshipId;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, createLoadingStack, logger],
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
        alertFeedback(
          FeedbackTypes.ERROR,
          'Internal Error! at createTranslation',
        );
        return null;
      }

      if (!targetLanguage && !translation.languageInfo) {
        alertFeedback(FeedbackTypes.ERROR, 'Not exists target language!');
        return null;
      }

      if (translation.word.trim() === '') {
        alertFeedback(
          FeedbackTypes.ERROR,
          'Translation cannot be empty string!',
        );
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();

        const { wordTranslationRelationshipId } =
          await singletons.translationService.createOrFindWordTranslation(
            originalWordId,
            {
              word: translation.word,
              languageInfo: translation.languageInfo || targetLanguage!,
            },
          );

        if (!wordTranslationRelationshipId) {
          stopLoading();
          return null;
        }

        stopLoading();
        return wordTranslationRelationshipId;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, targetLanguage, createLoadingStack, logger],
  );

  const getRecommendedTranslationCandidateId = useCallback(
    async (
      originalId: Nanoid,
      originalLanguageInfo: LanguageInfo,
      languageInfo?: LanguageInfo,
    ) => {
      if (!singletons) {
        alertFeedback(
          FeedbackTypes.ERROR,
          'Internal Error! at createTranslation',
        );
        return null;
      }

      if (!targetLanguage && !languageInfo) {
        alertFeedback(FeedbackTypes.ERROR, 'Not exists target language!');
        return null;
      }

      if (
        compareLangInfo(originalLanguageInfo, languageInfo || targetLanguage!)
      ) {
        return originalId;
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();

        const recommended =
          await singletons.translationService.getRecommendedTranslationCandidateAndNode(
            originalId,
            languageInfo || targetLanguage!,
          );

        stopLoading();
        return recommended?.candidateId;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, targetLanguage, createLoadingStack, logger],
  );

  const getRecommendedWordSequenceTranslation = useCallback(
    async (
      originalId: Nanoid,
      originalLanguageInfo: LanguageInfo,
      languageInfo?: LanguageInfo,
    ) => {
      if (!singletons) {
        alertFeedback(
          FeedbackTypes.ERROR,
          'Internal Error! at createTranslation',
        );
        return null;
      }

      if (!targetLanguage && !languageInfo) {
        alertFeedback(FeedbackTypes.ERROR, 'Not exists target language!');
        return null;
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        if (
          compareLangInfo(originalLanguageInfo, languageInfo || targetLanguage!)
        ) {
          return singletons.wordSequenceService.getWordSequenceById(originalId);
        }
        startLoading();

        const recommendedId =
          await singletons.translationService.getRecommendedWordSequenceTranslation(
            originalId,
            languageInfo || targetLanguage!,
          );

        stopLoading();
        return recommendedId;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, targetLanguage, createLoadingStack, logger],
  );

  const listTranslationsByWordSequenceId = useCallback(
    async (wordSequenceId: Nanoid, isUserId = false) => {
      if (!singletons) {
        alertFeedback(
          FeedbackTypes.ERROR,
          'Internal Error! at listTranslationsByDocumentId',
        );
        return [];
      }

      if (!targetLanguage) {
        alertFeedback(FeedbackTypes.ERROR, 'Not exists target language!');
        return [];
      }

      if (!user && isUserId) {
        alertFeedback(FeedbackTypes.ERROR, 'Not exists log in user!');
        return [];
      }
      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();

        let userNode: UserDto;

        if (isUserId) {
          userNode = await singletons.userService.createOrFindUser(user!.email);

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

        stopLoading();
        return result;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return [];
      }
    },
    [
      singletons,
      alertFeedback,
      user,
      targetLanguage,
      createLoadingStack,
      logger,
    ],
  );

  return {
    createOrFindWordSequenceTranslation,
    createOrFindDefinitionTranslation,
    createOrFindWordTranslation,
    getRecommendedTranslationCandidateId,
    getRecommendedWordSequenceTranslation,
    listTranslationsByWordSequenceId,
  };
}
