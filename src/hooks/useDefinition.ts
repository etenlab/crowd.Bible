import { useCallback } from 'react';
import { useAppContext } from '@/hooks/useAppContext';

import { LanguageInfo } from '@eten-lab/ui-kit';

export function useDefinition() {
  const {
    states: {
      global: { singletons },
    },
    actions: { alertFeedback, setLoadingState },
  } = useAppContext();

  const getDefinitionsAsVotableContentByWord = useCallback(
    async (word: string, languageInfo: LanguageInfo) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at listDocument');
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
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return [];
      }
    },
    [singletons, alertFeedback, setLoadingState],
  );

  return {
    getDefinitionsAsVotableContentByWord,
  };
}
