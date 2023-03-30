import { useCallback } from 'react';
import { useAppContext } from '@/hooks/useAppContext';

export function useLanguage() {
  const {
    states: {
      global: { singletons },
    },
    actions: { alertFeedback },
  } = useAppContext();

  const getLanguage = useCallback(
    async (language: string) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error!');
        return [];
      }

      if (language.trim() === '') {
        alertFeedback('warning', 'Language name cannot be empty string!');
        return null;
      }

      try {
        return singletons.graphThirdLayerService.getLanguage(language);
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        return [];
      }
    },
    [singletons, alertFeedback],
  );

  const createLanguage = useCallback(
    async (lanaguageName: string) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error!');
        return null;
      }

      if (lanaguageName.trim() === '') {
        alertFeedback('warning', 'Language name cannot be empty string!');
        return null;
      }

      try {
        const language = await singletons.graphThirdLayerService.createLanguage(
          lanaguageName,
        );

        alertFeedback('success', 'Imported a new language!');

        return language;
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback],
  );

  const getLanguages = useCallback(async () => {
    if (!singletons) {
      alertFeedback('error', 'Internal Error!');
      return [];
    }

    try {
      return singletons.graphThirdLayerService.getLanguages();
    } catch (err) {
      console.log(err);
      alertFeedback('error', 'Internal Error!');
      return [];
    }
  }, [singletons, alertFeedback]);

  return {
    createLanguage,
    getLanguage,
    getLanguages,
  };
}
