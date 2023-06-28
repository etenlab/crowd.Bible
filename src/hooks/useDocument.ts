import { useCallback } from 'react';
import { useAppContext } from '@/hooks/useAppContext';

import { LanguageInfo } from '@eten-lab/ui-kit';
import { FeedbackTypes } from '@/constants/common.constant';

export function useDocument() {
  const {
    states: {
      global: { singletons },
    },
    actions: { alertFeedback, createLoadingStack },
    logger,
  } = useAppContext();

  const listDocument = useCallback(async () => {
    if (!singletons) {
      alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at listDocument');
      return [];
    }

    const { startLoading, stopLoading } = createLoadingStack();

    try {
      startLoading();
      const result = await singletons.documentService.listDocument();
      stopLoading();
      return result;
    } catch (err) {
      logger.error((err as Error).toString());
      stopLoading();
      alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
      return [];
    }
  }, [singletons, alertFeedback, createLoadingStack, logger]);

  const listDocumentByLanguageInfo = useCallback(
    async (langInfo: LanguageInfo) => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at listDocument');
        return [];
      }
      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const result =
          await singletons.documentService.listDocumentByLanguageInfo(langInfo);
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

  const getDocument = useCallback(
    async (name: string, langInfo: LanguageInfo) => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at getDocument');
        return [];
      }

      if (name.trim() === '') {
        alertFeedback(
          FeedbackTypes.WARNING,
          'Document name cannot be empty string!',
        );
        return null;
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const result = await singletons.documentService.getDocument(
          name,
          langInfo,
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

  const getDocumentById = useCallback(
    async (documentId: Nanoid) => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at getDocument');
        return null;
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const result = await singletons.documentService.getDocumentById(
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

  const createOrFindDocument = useCallback(
    async (name: string, langInfo: LanguageInfo) => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at createDocument');
        return null;
      }

      if (name.trim() === '') {
        alertFeedback(
          FeedbackTypes.WARNING,
          'Document name cannot be empty string!',
        );
        return null;
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const document = await singletons.documentService.getDocument(
          name.trim(),
          langInfo,
        );

        if (document) {
          stopLoading();
          alertFeedback(
            FeedbackTypes.WARNING,
            'Already exists a document with same name!',
          );
          return null;
        }
        const result = await singletons.documentService.createOrFindDocument(
          name,
          langInfo,
        );

        stopLoading();
        alertFeedback(FeedbackTypes.SUCCESS, 'Created a new document!');

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

  /**
   * @deprecated
   */
  const listApp = useCallback(async () => {
    if (!singletons) {
      alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at listApp');
      return [];
    }

    const { startLoading, stopLoading } = createLoadingStack();

    try {
      startLoading();
      const result = await singletons.documentService.listApp();
      stopLoading();
      return result;
    } catch (err) {
      logger.error(err);
      stopLoading();
      alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
      return [];
    }
  }, [singletons, alertFeedback, createLoadingStack, logger]);

  /**
   * @deprecated
   */
  const getApp = useCallback(
    async (name: string) => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at getApp');
        return null;
      }

      if (name.trim() === '') {
        alertFeedback(
          FeedbackTypes.WARNING,
          'Document name cannot be empty string!',
        );
        return null;
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const result = await singletons.documentService.getApp(name);
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

  /**
   * @deprecated
   */
  const getAppById = useCallback(
    async (appId: string) => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at getApp');
        return null;
      }

      if (appId.trim() === '') {
        alertFeedback(FeedbackTypes.WARNING, 'AppId cannot be empty string!');
        return null;
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const result = await singletons.documentService.getAppById(appId);
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

  /**
   * @deprecated
   */
  const listAppByLanguageInfo = useCallback(
    async (langInfo: LanguageInfo) => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at listDocument');
        return [];
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const result = await singletons.documentService.listAppByLanguageInfo(
          langInfo,
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
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at createApp');
        return null;
      }

      if (name.trim() === '') {
        alertFeedback(
          FeedbackTypes.WARNING,
          'App name cannot be empty string!',
        );
        return null;
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const app = await singletons.documentService.createOrFindApp(
          name.trim(),
          organizationName,
          languageInfo,
        );

        stopLoading();
        alertFeedback(FeedbackTypes.SUCCESS, 'Created a new document!');

        return app;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, createLoadingStack, logger],
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
