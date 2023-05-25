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

  const listDocumentByLanguageInfo = useCallback(
    async (langInfo: LanguageInfo) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at listDocument');
        return [];
      }

      try {
        setLoadingState(true);
        const result =
          await singletons.documentService.listDocumentByLanguageInfo(langInfo);
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

  const getDocument = useCallback(
    async (name: string, langInfo: LanguageInfo) => {
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
        const result = await singletons.documentService.getDocument(
          name,
          langInfo,
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

  const getDocumentById = useCallback(
    async (documentId: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at getDocument');
        return null;
      }

      try {
        setLoadingState(true);
        const result = await singletons.documentService.getDocumentById(
          documentId,
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

  const createOrFindDocument = useCallback(
    async (name: string, langInfo: LanguageInfo) => {
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
          langInfo,
        );

        if (document) {
          setLoadingState(false);
          alertFeedback('warning', 'Already exists a document with same name!');
          return null;
        }
        const result = await singletons.documentService.createOrFindDocument(
          name,
          langInfo,
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
  const getAppById = useCallback(
    async (appId: string) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at getApp');
        return null;
      }

      if (appId.trim() === '') {
        alertFeedback('warning', 'AppId cannot be empty string!');
        return null;
      }

      try {
        setLoadingState(true);
        const result = await singletons.documentService.getAppById(appId);
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

  /**
   * @deprecated
   */
  const listAppByLanguageInfo = useCallback(
    async (langInfo: LanguageInfo) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at listDocument');
        return [];
      }

      try {
        setLoadingState(true);
        const result = await singletons.documentService.listAppByLanguageInfo(
          langInfo,
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

  /**
   * @deprecated
   */
  const createOrFindApp = useCallback(
    async (
      name: string,
      organizationName: string,
      languageInfo: LanguageInfo,
    ) => {
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
        const app = await singletons.documentService.createOrFindApp(
          name.trim(),
          organizationName,
          languageInfo,
        );

        setLoadingState(false);
        alertFeedback('success', 'Created a new document!');

        return app;
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
    listDocumentByLanguageInfo,
    listDocument,
    createOrFindDocument,
    getDocument,
    getDocumentById,
    createOrFindApp,
    listAppByLanguageInfo,
    listApp,
    getApp,
    getAppById,
  };
}
