import { useCallback } from 'react';
import { useAppContext } from '@/hooks/useAppContext';

import { LanguageInfo } from '@eten-lab/ui-kit';
import { FeedbackTypes } from '@/constants/common.constant';

export function useDefinition() {
  const {
    states: {
      global: { singletons },
    },
    actions: { alertFeedback, setLoadingState },
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

      try {
        setLoadingState(true);
        const result =
          await singletons.definitionService.getDefinitionsAsVotableContentByWord(
            word,
            languageInfo,
          );
        setLoadingState(false);
        return result;
      } catch (err) {
        logger.info(err);
        setLoadingState(false);
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return [];
      }
    },
    [singletons, alertFeedback, setLoadingState, logger],
  );

  return {
    getDefinitionsAsVotableContentByWord,
  };
}
