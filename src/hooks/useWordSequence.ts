import { useCallback } from 'react';

import { useAppContext } from '@/hooks/useAppContext';

import { WordSequenceDto } from '@/dtos/word-sequence.dto';
import { UserDto } from '@/dtos/user.dto';

import { LanguageInfo } from '@eten-lab/ui-kit';

export function useWordSequence() {
  const {
    states: {
      global: { singletons, user },
    },
    actions: { alertFeedback, setLoadingState },
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
        alertFeedback('error', 'Internal Error! at createWordSequence');
        return null;
      }

      if (!user) {
        alertFeedback('error', 'Not exists log in user!');
        return null;
      }

      if (text.trim() === '') {
        alertFeedback('error', 'Text name cannot be empty string!');
        return null;
      }

      try {
        setLoadingState(true);
        const userNode = await singletons.userService.createOrFindUser(
          user.userEmail,
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

        setLoadingState(false);
        return wordSequenceNode.id;
      } catch (err) {
        logger.error(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, user, setLoadingState, logger],
  );

  const createSubWordSequence = useCallback(
    async (
      parentWordSequenceId: Nanoid,
      range: { start: number; end: number },
    ) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at createSubWordSequence');
        return null;
      }

      if (!user) {
        alertFeedback('error', 'Not exists log in user!');
        return null;
      }

      try {
        setLoadingState(true);
        const userNode = await singletons.userService.createOrFindUser(
          user.userEmail,
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

        setLoadingState(false);
        return subWordSequenceNode.id;
      } catch (err) {
        logger.error(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, user, setLoadingState, logger],
  );

  const getTextFromWordSequenceId = useCallback(
    async (wordSequenceId: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at getText');
        return [];
      }

      try {
        setLoadingState(true);
        const wordSequenceNode =
          await singletons.graphFirstLayerService.readNode(wordSequenceId);

        if (!wordSequenceNode) {
          setLoadingState(false);
          alertFeedback(
            'error',
            'Not exists a word-sequence with given word-sequence id!',
          );
          return null;
        }

        const result =
          await singletons.wordSequenceService.getTextFromWordSequenceId(
            wordSequenceId,
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

  const getWordSequenceById = useCallback(
    async (wordSequenceId: Nanoid): Promise<WordSequenceDto | null> => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at getWordSequenceById');
        return null;
      }

      try {
        setLoadingState(true);
        const result = await singletons.wordSequenceService.getWordSequenceById(
          wordSequenceId,
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

  const appendWordSequence = useCallback(
    async (fromId: Nanoid, toId: Nanoid): Promise<Nanoid | null> => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at appendWordSequence');
        return null;
      }

      try {
        setLoadingState(true);
        const result = await singletons.wordSequenceService.appendWordSequence(
          fromId,
          toId,
        );
        setLoadingState(false);
        return result.id;
      } catch (err) {
        logger.error(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState, logger],
  );

  const getWordSequenceFromText = useCallback(
    async (text: string): Promise<Nanoid[]> => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at getWordSequenceFromText');
        return [];
      }

      try {
        setLoadingState(true);
        const result =
          await singletons.wordSequenceService.getWordSequenceFromText(text);
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

  const getWordSequenceByDocumentId = useCallback(
    async (documentId: Nanoid): Promise<WordSequenceDto | null> => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at getWordSequenceFromText');
        return null;
      }

      try {
        setLoadingState(true);
        const result =
          await singletons.wordSequenceService.getWordSequenceByDocumentId(
            documentId,
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

  const listSubWordSequenceByWordSequenceId = useCallback(
    async (wordSequenceId: Nanoid, isUserId = false) => {
      if (!singletons) {
        alertFeedback(
          'error',
          'Internal Error! at listTranslationsByDocumentId',
        );
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
          await singletons.wordSequenceService.listSubWordSequenceByWordSequenceId(
            wordSequenceId,
            isUserId ? userNode!.id : undefined,
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
    [singletons, alertFeedback, user, setLoadingState, logger],
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
