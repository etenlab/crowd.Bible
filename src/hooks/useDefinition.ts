import { useCallback } from 'react';
import { useAppContext } from '@/hooks/useAppContext';

import { LanguageInfo } from '@eten-lab/ui-kit';
import { FeedbackTypes } from '@/constants/common.constant';

export function useDefinition() {
  const {
    states: {
      global: { singletons },
    },
    actions: { alertFeedback, createLoadingStack },
    logger,
  } = useAppContext();

  const getDefinitionsAsVotableContentByWord = useCallback(
    async (word: string, languageInfo: LanguageInfo) => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at listDocument');
        return [];
      }

      if (word.trim().length === 0) {
        return [];
      }

      const { startLoading, stopLoading } = createLoadingStack();
      try {
        startLoading();
        const result =
          await singletons.definitionService.getDefinitionsAsVotableContentByWord(
            word,
            languageInfo,
          );
        stopLoading();
        return result;
      } catch (err) {
        logger.info(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return [];
      }
    },
    [singletons, alertFeedback, createLoadingStack, logger],
  );

  return {
    getDefinitionsAsVotableContentByWord,
  };
}
