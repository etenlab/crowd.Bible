import { useCallback } from 'react';
import { useAppContext } from '@/hooks/useAppContext';

export function useDocument() {
  const {
    states: {
      global: { singletons },
    },
    actions: { alertFeedback },
  } = useAppContext();

  const listDocument = useCallback(async () => {
    if (!singletons) {
      alertFeedback('error', 'Internal Error! at listDocument');
      return [];
    }

    try {
      return singletons.graphThirdLayerService.listDocument();
    } catch (err) {
      console.log(err);
      alertFeedback('error', 'Internal Error!');
      return [];
    }
  }, [singletons, alertFeedback]);

  const getDocument = useCallback(
    async (name: string) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at getDocument');
        return [];
      }

      if (name.trim() === '') {
        alertFeedback('warning', 'Document name cannot be empty string!');
        return null;
      }

      try {
        return singletons.graphThirdLayerService.getDocument(name);
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        return [];
      }
    },
    [singletons, alertFeedback],
  );

  const createDocument = useCallback(
    async (name: string) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at createDocument');
        return null;
      }

      if (name.trim() === '') {
        alertFeedback('warning', 'Document name cannot be empty string!');
        return null;
      }

      try {
        const document = await singletons.graphThirdLayerService.getDocument(
          name.trim(),
        );

        if (document) {
          alertFeedback('warning', 'Already exists a document with same name!');
          return null;
        }
        const newDocument =
          await singletons.graphThirdLayerService.createDocument(name);

        alertFeedback('success', 'Created a new document!');

        return newDocument;
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback],
  );

  return {
    createDocument,
    listDocument,
    getDocument,
  };
}
