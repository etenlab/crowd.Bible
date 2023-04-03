import { useCallback } from 'react';

import { useAppContext } from '@/hooks/useAppContext';
import { useVote } from '@/hooks/useVote';

import {
  WordSequenceDto,
  WordSequenceWithSubDto,
  WordSequenceWithVote,
} from '../dtos/word-sequence.dto';

interface MyObject {
  [key: string]: string;
}

const ballotEntryIds: MyObject = {};

export function useWordSequence() {
  const {
    states: {
      global: { singletons, user },
      documentTools: { targetLanguage },
    },
    actions: { alertFeedback },
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
        alertFeedback('error', 'Internal Error!');
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

        return wordSequenceNode.id;
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, user],
  );

  const createSubWordSequence = useCallback(
    async (
      wordSequence: WordSequenceDto,
      range: { start: number; end: number },
    ) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error!');
        return null;
      }

      if (!user) {
        alertFeedback('error', 'Not exists log in user!');
        return null;
      }

      try {
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

        return subWordSequenceNode.id;
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, user],
  );

  const createTranslation = useCallback(
    async (wordSequenceId: Nanoid, translationText: string) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error!');
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
        const wordSequence =
          await singletons.graphThirdLayerService.getWordSequenceById(
            wordSequenceId,
          );

        if (!wordSequence) {
          return null;
        }

        const translationWordSequenceId = await createWordSequence(
          translationText,
          wordSequence.documentId,
          wordSequence.importUid,
          targetLanguage.id,
          false,
        );

        if (!translationWordSequenceId) {
          return null;
        }

        await singletons.graphThirdLayerService.createWordTranslationRelationship(
          wordSequence.id,
          translationWordSequenceId,
        );

        return translationWordSequenceId;
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, createWordSequence, targetLanguage],
  );

  const appendVoteInfoToTranslation = useCallback(
    async (translationDtos: WordSequenceDto[]) => {
      const translationWithVoteDtos: WordSequenceWithVote[] = [];

      for (const translation of translationDtos) {
        const originId = translation.originalWordSequenceId!;

        if (ballotEntryIds[originId] === undefined) {
          const electionIds = await listElections('nodes', originId);

          if (electionIds.length === 0) {
            continue;
          }

          const ballotEntryId = await getBallotEntryId(electionIds[0], {
            tableName: 'nodes',
            rowId: translation.id,
          });

          if (!ballotEntryId) {
            continue;
          }

          ballotEntryIds[originId] = ballotEntryId;
        }
        let vote = await getVotesStats(ballotEntryIds[originId]);

        if (!vote) {
          vote = {
            ballot_entry_id: ballotEntryIds[originId],
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
        alertFeedback('error', 'Internal Error!');
        return [];
      }

      if (!targetLanguage) {
        alertFeedback('error', 'Not exists target language!');
        return [];
      }

      try {
        const translationDtos =
          await singletons.graphThirdLayerService.listTranslationsByDocumentId(
            documentId,
            targetLanguage.id,
            userId,
          );

        return appendVoteInfoToTranslation(translationDtos);
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        return [];
      }
    },
    [singletons, alertFeedback, targetLanguage, appendVoteInfoToTranslation],
  );

  const listMyTranslationsByDocumentId = useCallback(
    async (documentId: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error!');
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
        const userNode = await singletons.graphThirdLayerService.createUser(
          user.userEmail,
        );

        const translationDtos =
          await singletons.graphThirdLayerService.listTranslationsByWordSequenceId(
            documentId,
            targetLanguage.id,
            userNode.id,
          );

        return appendVoteInfoToTranslation(translationDtos);
      } catch (err) {
        console.log(err);
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
    ],
  );

  const listTranslationsByWordSequenceId = useCallback(
    async (wordSequenceId: Nanoid, userId?: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error!');
        return [];
      }

      if (!targetLanguage) {
        alertFeedback('error', 'Not exists target language!');
        return [];
      }

      try {
        const translationDtos =
          await singletons.graphThirdLayerService.listTranslationsByWordSequenceId(
            wordSequenceId,
            targetLanguage.id,
            userId,
          );

        return appendVoteInfoToTranslation(translationDtos);
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        return [];
      }
    },
    [singletons, alertFeedback, targetLanguage, appendVoteInfoToTranslation],
  );

  const listMyTranslationsByWordSequenceId = useCallback(
    async (wordSequenceId: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error!');
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
        const userNode = await singletons.graphThirdLayerService.createUser(
          user.userEmail,
        );

        const translationDtos =
          await singletons.graphThirdLayerService.listTranslationsByWordSequenceId(
            wordSequenceId,
            targetLanguage.id,
            userNode.id,
          );

        return appendVoteInfoToTranslation(translationDtos);
      } catch (err) {
        console.log(err);
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
    ],
  );

  const getText = useCallback(
    async (wordSequenceId: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error!');
        return [];
      }

      try {
        const wordSequenceNode =
          await singletons.graphFirstLayerService.readNode(wordSequenceId);

        if (!wordSequenceNode) {
          alertFeedback(
            'error',
            'Not exists a word-sequence with given word-sequence id!',
          );
          return null;
        }

        return singletons.graphThirdLayerService.getText(wordSequenceId);
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        return [];
      }
    },
    [singletons, alertFeedback],
  );

  const getOriginWordSequenceByDocumentId = useCallback(
    async (
      documentId: Nanoid,
      withSubWordSequence = false,
    ): Promise<WordSequenceDto | WordSequenceWithSubDto | null> => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error!');
        return null;
      }

      try {
        const documentNode = await singletons.graphFirstLayerService.readNode(
          documentId,
        );

        if (!documentNode) {
          alertFeedback(
            'error',
            'Not exists a document with given document id!',
          );
          return null;
        }

        return singletons.graphThirdLayerService.getOriginWordSequenceByDocumentId(
          documentId,
          withSubWordSequence,
        );
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback],
  );

  const getWordSequenceById = useCallback(
    async (
      wordSequenceId: Nanoid,
    ): Promise<WordSequenceDto | WordSequenceWithSubDto | null> => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error!');
        return null;
      }

      try {
        return singletons.graphThirdLayerService.getWordSequenceById(
          wordSequenceId,
        );
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback],
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
