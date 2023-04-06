import { useCallback } from 'react';

import { useAppContext } from '@/hooks/useAppContext';
import { useVote } from '@/hooks/useVote';

import {
  WordSequenceDto,
  WordSequenceWithSubDto,
  WordSequenceWithVote,
} from '@/dtos/word-sequence.dto';

interface IndexObject {
  [key: string]: {
    electionId: string;
    ballotEntryIds: {
      [key: string]: string;
    };
  };
}

const electionIds: IndexObject = {};

export function useWordSequence() {
  const {
    states: {
      global: { singletons, user },
      documentTools: { targetLanguage },
    },
    actions: { alertFeedback, setLoadingState },
  } = useAppContext();

  const { getBallotEntryId, listElections, getVotesStats } = useVote();

  const createWordSequence = useCallback(
    async (
      text: string,
      documentId: Nanoid,
      importUid: string,
      languageId: Nanoid,
      isOrigin = false,
    ) => {
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
        const userNode = await singletons.graphThirdLayerService.createUser(
          user.userEmail,
        );

        if (!userNode) {
          return null;
        }

        const wordSequenceNode =
          await singletons.graphThirdLayerService.createWordSequence(
            text,
            documentId,
            userNode.id,
            importUid,
            languageId,
            isOrigin,
            false,
          );

        setLoadingState(false);
        return wordSequenceNode.id;
      } catch (err) {
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, user, setLoadingState],
  );

  const createSubWordSequence = useCallback(
    async (
      wordSequence: WordSequenceDto,
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
        const userNode = await singletons.graphThirdLayerService.createUser(
          user.userEmail,
        );

        if (!userNode) {
          return null;
        }

        const subText = wordSequence.wordSequence
          .split(' ')
          .slice(range.start, range.end + 1)
          .join(' ');

        const subWordSequenceNode =
          await singletons.graphThirdLayerService.createSubWordSequence(
            wordSequence.id,
            subText,
            range.start,
            range.end - range.start + 1,
            userNode.id,
          );

        setLoadingState(false);
        return subWordSequenceNode.id;
      } catch (err) {
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, user, setLoadingState],
  );

  const createTranslation = useCallback(
    async (wordSequenceId: Nanoid, translationText: string) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at createTranslation');
        return null;
      }

      if (!targetLanguage) {
        alertFeedback('error', 'Not exists target language!');
        return null;
      }

      if (translationText.trim() === '') {
        alertFeedback('error', 'Translation cannot be empty string!');
      }

      try {
        setLoadingState(true);
        const wordSequence =
          await singletons.graphThirdLayerService.getWordSequenceById(
            wordSequenceId,
          );

        if (!wordSequence) {
          throw new Error('Not Exists such wordSequence');
        }

        const translationWordSequenceId = await createWordSequence(
          translationText,
          wordSequence.documentId,
          wordSequence.importUid,
          targetLanguage.id,
          false,
        );

        if (!translationWordSequenceId) {
          setLoadingState(false);
          return null;
        }

        await singletons.graphThirdLayerService.createWordSequenceTranslationRelationship(
          wordSequence.id,
          translationWordSequenceId,
        );

        setLoadingState(false);
        return translationWordSequenceId;
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
      createWordSequence,
      targetLanguage,
      setLoadingState,
    ],
  );

  const appendVoteInfoToTranslation = useCallback(
    async (translationDtos: WordSequenceDto[]) => {
      const translationWithVoteDtos: WordSequenceWithVote[] = [];

      for (const translation of translationDtos) {
        const originId = translation.originalWordSequenceId!;

        if (electionIds[originId] === undefined) {
          const tmpElectionIds = await listElections('nodes', originId);

          if (tmpElectionIds.length === 0) {
            continue;
          }

          electionIds[originId] = {
            electionId: tmpElectionIds[0],
            ballotEntryIds: {},
          };
        }

        if (
          electionIds[originId].ballotEntryIds[translation.id] === undefined
        ) {
          const ballotEntryId = await getBallotEntryId(
            electionIds[originId].electionId,
            {
              tableName: 'nodes',
              rowId: translation.id,
            },
          );

          if (!ballotEntryId) {
            continue;
          }

          electionIds[originId].ballotEntryIds[translation.id] = ballotEntryId;
        }

        let vote = await getVotesStats(
          electionIds[originId].ballotEntryIds[translation.id],
        );

        if (!vote) {
          vote = {
            ballot_entry_id:
              electionIds[originId].ballotEntryIds[translation.id],
            up: 0,
            down: 0,
          };
        }
        translationWithVoteDtos.push({
          ...translation,
          vote,
        });
      }

      return translationWithVoteDtos;
    },
    [getVotesStats, getBallotEntryId, listElections],
  );

  const listTranslationsByDocumentId = useCallback(
    async (documentId: Nanoid, userId?: Nanoid) => {
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

      try {
        setLoadingState(true);
        const translationDtos =
          await singletons.graphThirdLayerService.listTranslationsByDocumentId(
            documentId,
            targetLanguage.id,
            userId,
          );

        const result = await appendVoteInfoToTranslation(translationDtos);

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
      targetLanguage,
      appendVoteInfoToTranslation,
      setLoadingState,
    ],
  );

  const listMyTranslationsByDocumentId = useCallback(
    async (documentId: Nanoid) => {
      if (!singletons) {
        alertFeedback(
          'error',
          'Internal Error! at listMyTranslationsByDocumentId',
        );
        return [];
      }

      if (!user) {
        alertFeedback('error', 'Not exists log in user!');
        return [];
      }

      if (!targetLanguage) {
        alertFeedback('error', 'Not exists target language!');
        return [];
      }

      try {
        setLoadingState(true);
        const userNode = await singletons.graphThirdLayerService.createUser(
          user.userEmail,
        );

        const translationDtos =
          await singletons.graphThirdLayerService.listTranslationsByWordSequenceId(
            documentId,
            targetLanguage.id,
            userNode.id,
          );

        const result = await appendVoteInfoToTranslation(translationDtos);
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
      user,
      targetLanguage,
      appendVoteInfoToTranslation,
      setLoadingState,
    ],
  );

  const listTranslationsByWordSequenceId = useCallback(
    async (wordSequenceId: Nanoid, userId?: Nanoid) => {
      if (!singletons) {
        alertFeedback(
          'error',
          'Internal Error! at listTranslationsByWordSequenceId',
        );
        return [];
      }

      if (!targetLanguage) {
        alertFeedback('error', 'Not exists target language!');
        return [];
      }

      try {
        setLoadingState(true);
        const translationDtos =
          await singletons.graphThirdLayerService.listTranslationsByWordSequenceId(
            wordSequenceId,
            targetLanguage.id,
            userId,
          );

        const result = await appendVoteInfoToTranslation(translationDtos);
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
      targetLanguage,
      appendVoteInfoToTranslation,
      setLoadingState,
    ],
  );

  const listMyTranslationsByWordSequenceId = useCallback(
    async (wordSequenceId: Nanoid) => {
      if (!singletons) {
        alertFeedback(
          'error',
          'Internal Error! at listMyTranslationsByWordSequenceId',
        );
        return [];
      }

      if (!user) {
        alertFeedback('error', 'Not exists log in user!');
        return [];
      }

      if (!targetLanguage) {
        alertFeedback('error', 'Not exists target language!');
        return [];
      }

      try {
        setLoadingState(true);
        const userNode = await singletons.graphThirdLayerService.createUser(
          user.userEmail,
        );

        const translationDtos =
          await singletons.graphThirdLayerService.listTranslationsByWordSequenceId(
            wordSequenceId,
            targetLanguage.id,
            userNode.id,
          );

        const result = await appendVoteInfoToTranslation(translationDtos);
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
      user,
      targetLanguage,
      appendVoteInfoToTranslation,
      setLoadingState,
    ],
  );

  const getText = useCallback(
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

        const result = await singletons.graphThirdLayerService.getText(
          wordSequenceId,
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

  const getOriginWordSequenceByDocumentId = useCallback(
    async (
      documentId: Nanoid,
      withSubWordSequence = false,
    ): Promise<WordSequenceDto | WordSequenceWithSubDto | null> => {
      if (!singletons) {
        alertFeedback(
          'error',
          'Internal Error! at getOriginWordSequenceByDocumentId',
        );
        return null;
      }

      try {
        setLoadingState(true);
        const result =
          await singletons.graphThirdLayerService.getOriginWordSequenceByDocumentId(
            documentId,
            withSubWordSequence,
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

  const getWordSequenceById = useCallback(
    async (
      wordSequenceId: Nanoid,
    ): Promise<WordSequenceDto | WordSequenceWithSubDto | null> => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at getWordSequenceById');
        return null;
      }

      try {
        setLoadingState(true);
        const result =
          await singletons.graphThirdLayerService.getWordSequenceById(
            wordSequenceId,
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

  return {
    createWordSequence,
    createSubWordSequence,
    getOriginWordSequenceByDocumentId,
    getText,
    getWordSequenceById,
    createTranslation,
    listTranslationsByDocumentId,
    listMyTranslationsByDocumentId,
    listTranslationsByWordSequenceId,
    listMyTranslationsByWordSequenceId,
  };
}
