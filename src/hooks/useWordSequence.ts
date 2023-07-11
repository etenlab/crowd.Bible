import { useCallback } from 'react';

import { useAppContext } from '@/hooks/useAppContext';

import { WordSequenceDto } from '@/dtos/word-sequence.dto';
import { UserDto } from '@/dtos/user.dto';

import { LanguageInfo } from '@eten-lab/ui-kit';
import { FeedbackTypes } from '@/constants/common.constant';

export function useWordSequence() {
  const {
    states: {
      global: { singletons, user },
    },
    actions: { alertFeedback, createLoadingStack },
    logger,
  } = useAppContext();

  const createWordSequence = useCallback(
    async ({
      text,
      languageInfo,
      documentId,
      importUid,
    }: {
      text: string;
      languageInfo: LanguageInfo;
      documentId?: Nanoid;
      importUid?: Nanoid;
    }) => {
      if (!singletons) {
        alertFeedback(
          FeedbackTypes.ERROR,
          'Internal Error! at createWordSequence',
        );
        return null;
      }

      if (!user) {
        alertFeedback(FeedbackTypes.ERROR, 'Not exists log in user!');
        return null;
      }

      if (text.trim() === '') {
        alertFeedback(FeedbackTypes.ERROR, 'Text name cannot be empty string!');
        return null;
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

        const wordSequenceNode =
          await singletons.wordSequenceService.createWordSequence({
            text,
            creatorId: userNode.id,
            languageInfo,
            documentId,
            withWordsRelationship: false, // decided to cancel creating word relationship because of performance
            importUid,
          });

        stopLoading();
        return wordSequenceNode.id;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, user, createLoadingStack, logger],
  );

  const createSubWordSequence = useCallback(
    async (
      parentWordSequenceId: Nanoid,
      range: { start: number; end: number },
    ) => {
      if (!singletons) {
        alertFeedback(
          FeedbackTypes.ERROR,
          'Internal Error! at createSubWordSequence',
        );
        return null;
      }

      if (!user) {
        alertFeedback(FeedbackTypes.ERROR, 'Not exists log in user!');
        return null;
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

        const subWordSequenceNode =
          await singletons.wordSequenceService.createSubWordSequence(
            parentWordSequenceId,
            range.start,
            range.end - range.start + 1,
            userNode.id,
          );

        stopLoading();
        return subWordSequenceNode.id;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, user, createLoadingStack, logger],
  );

  const getTextFromWordSequenceId = useCallback(
    async (wordSequenceId: Nanoid) => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at getText');
        return [];
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const wordSequenceNode =
          await singletons.graphFirstLayerService.readNode(wordSequenceId);

        if (!wordSequenceNode) {
          stopLoading();
          alertFeedback(
            FeedbackTypes.ERROR,
            'Not exists a word-sequence with given word-sequence id!',
          );
          return null;
        }

        const result =
          await singletons.wordSequenceService.getTextFromWordSequenceId(
            wordSequenceId,
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

  const getWordSequenceById = useCallback(
    async (wordSequenceId: Nanoid): Promise<WordSequenceDto | null> => {
      if (!singletons) {
        alertFeedback(
          FeedbackTypes.ERROR,
          'Internal Error! at getWordSequenceById',
        );
        return null;
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const result = await singletons.wordSequenceService.getWordSequenceById(
          wordSequenceId,
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

  const appendWordSequence = useCallback(
    async (fromId: Nanoid, toId: Nanoid): Promise<Nanoid | null> => {
      if (!singletons) {
        alertFeedback(
          FeedbackTypes.ERROR,
          'Internal Error! at appendWordSequence',
        );
        return null;
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const result = await singletons.wordSequenceService.appendWordSequence(
          fromId,
          toId,
        );
        stopLoading();
        return result.id;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, createLoadingStack, logger],
  );

  const getWordSequenceFromText = useCallback(
    async (text: string): Promise<Nanoid[]> => {
      if (!singletons) {
        alertFeedback(
          FeedbackTypes.ERROR,
          'Internal Error! at getWordSequenceFromText',
        );
        return [];
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const result =
          await singletons.wordSequenceService.getWordSequenceFromText(text);
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

  const getWordSequenceByDocumentId = useCallback(
    async (documentId: Nanoid): Promise<WordSequenceDto | null> => {
      if (!singletons) {
        alertFeedback(
          FeedbackTypes.ERROR,
          'Internal Error! at getWordSequenceFromText',
        );
        return null;
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const result =
          await singletons.wordSequenceService.getWordSequenceByDocumentId(
            documentId,
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

  const listSubWordSequenceByWordSequenceId = useCallback(
    async (wordSequenceId: Nanoid, isUserId = false) => {
      if (!singletons) {
        alertFeedback(
          FeedbackTypes.ERROR,
          'Internal Error! at listTranslationsByDocumentId',
        );
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
          await singletons.wordSequenceService.listSubWordSequenceByWordSequenceId(
            wordSequenceId,
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
    [singletons, alertFeedback, user, createLoadingStack, logger],
  );

  return {
    createWordSequence,
    createSubWordSequence,
    getTextFromWordSequenceId,
    getWordSequenceById,
    appendWordSequence,
    getWordSequenceFromText,
    getWordSequenceByDocumentId,
    listSubWordSequenceByWordSequenceId,
  };
}
