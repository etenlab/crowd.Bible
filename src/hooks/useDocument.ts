import { useCallback } from 'react';
import { useAppContext } from '@/hooks/useAppContext';

import { LanguageInfo } from '@eten-lab/ui-kit';

export function useDocument() {
  const {
    states: {
      global: { singletons },
    },
    actions: { alertFeedback, setLoadingState },
    logger,
  } = useAppContext();

  const listDocument = useCallback(async () => {
    if (!singletons) {
      alertFeedback('error', 'Internal Error! at listDocument');
      return [];
    }

    try {
      setLoadingState(true);
      const result = await singletons.documentService.listDocument();
      setLoadingState(false);
      return result;
    } catch (err) {
      logger.error(err);
      setLoadingState(false);
      alertFeedback('error', 'Internal Error!');
      return [];
    }
  }, [singletons, alertFeedback, setLoadingState, logger]);

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
        const result = await singletons.documentService.getDocument(name);
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

  const createOrFindDocument = useCallback(
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
        const document = await singletons.documentService.getDocument(
          name.trim(),
        );

        if (document) {
          setLoadingState(false);
          alertFeedback('warning', 'Already exists a document with same name!');
          return null;
        }
        const result = await singletons.documentService.createOrFindDocument(
          name,
        );

        setLoadingState(false);
        alertFeedback('success', 'Created a new document!');

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

  /**
   * @deprecated
   */
  const listApp = useCallback(async () => {
    if (!singletons) {
      alertFeedback('error', 'Internal Error! at listApp');
      return [];
    }

    try {
      setLoadingState(true);
      const result = await singletons.documentService.listApp();
      setLoadingState(false);
      return result;
    } catch (err) {
      logger.error(err);
      setLoadingState(false);
      alertFeedback('error', 'Internal Error!');
      return [];
    }
  }, [singletons, alertFeedback, setLoadingState, logger]);

  /**
   * @deprecated
   */
  const getApp = useCallback(
    async (name: string) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at getApp');
        return null;
      }

      if (name.trim() === '') {
        alertFeedback('warning', 'Document name cannot be empty string!');
        return null;
      }

      try {
        setLoadingState(true);
        const result = await singletons.documentService.getApp(name);
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

  /**
   * @deprecated
   */
  const createOrFindApp = useCallback(
    async (name: string, languageInfo: LanguageInfo) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at createApp');
        return null;
      }

      if (name.trim() === '') {
        alertFeedback('warning', 'App name cannot be empty string!');
        return null;
      }

      try {
        setLoadingState(true);
        const document = await singletons.documentService.createOrFindApp(
          name.trim(),
          languageInfo,
        );

        if (document) {
          setLoadingState(false);
          alertFeedback('warning', 'Already exists a document with same name!');
          return null;
        }
        const result = await singletons.documentService.createOrFindDocument(
          name,
        );

        setLoadingState(false);
        alertFeedback('success', 'Created a new document!');

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

  return {
    createOrFindDocument,
    listDocument,
    getDocument,
    createOrFindApp,
    listApp,
    getApp,
  };
}
