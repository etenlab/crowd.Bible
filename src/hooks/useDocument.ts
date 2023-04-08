import { useCallback } from 'react';
import { useAppContext } from '@/hooks/useAppContext';

export function useDocument() {
  const {
    states: {
      global: { singletons },
    },
    actions: { alertFeedback, setLoadingState },
  } = useAppContext();

  const listDocument = useCallback(async () => {
    if (!singletons) {
      alertFeedback('error', 'Internal Error! at listDocument');
      return [];
    }

    try {
      setLoadingState(true);
      const result = await singletons.graphThirdLayerService.listDocument();
      setLoadingState(false);
      return result;
    } catch (err) {
      console.log(err);
      setLoadingState(false);
      alertFeedback('error', 'Internal Error!');
      return [];
    }
  }, [singletons, alertFeedback, setLoadingState]);

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
        setLoadingState(true);
        const result = await singletons.graphThirdLayerService.getDocument(
          name,
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
        setLoadingState(true);
        const document = await singletons.graphThirdLayerService.getDocument(
          name.trim(),
        );

        if (document) {
          setLoadingState(false);
          alertFeedback('warning', 'Already exists a document with same name!');
          return null;
        }
        const result = await singletons.graphThirdLayerService.createDocument(
          name,
        );

        setLoadingState(false);
        alertFeedback('success', 'Created a new document!');

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
    createDocument,
    listDocument,
    getDocument,
  };
}
