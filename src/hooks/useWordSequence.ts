import { useCallback } from 'react';
import { useAppContext } from '@/hooks/useAppContext';

export function useWordSequence() {
  const {
    states: {
      global: { singletons, user },
    },
    actions: { alertFeedback },
  } = useAppContext();

  const createWordSequence = useCallback(
    async (
      text: string,
      documentId: Nanoid,
      importUid: string,
      languageId: Nanoid,
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
        alertFeedback('warning', 'Document name cannot be empty string!');
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

        const wordSequenceNode =
          await singletons.graphThirdLayerService.createWordSequence(
            text,
            documentId,
            user.userEmail,
            importUid,
            languageId,
          );

        alertFeedback('success', 'Created a new word sequence!');

        return wordSequenceNode.id;
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, user],
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

  return {
    createWordSequence,
    getText,
  };
}
