import { useCallback } from 'react';
import { useAppContext } from '@/hooks/useAppContext';

export function useLanguage() {
  const {
    states: {
      global: { singletons },
    },
    actions: { alertFeedback, setLoadingState },
  } = useAppContext();

  const getLanguage = useCallback(
    async (language: string) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at getLanguage');
        return [];
      }

      if (language.trim() === '') {
        alertFeedback('warning', 'Language name cannot be empty string!');
        return null;
      }

      try {
        setLoadingState(true);
        const result = await singletons.graphThirdLayerService.getLanguage(
          language,
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

  const createLanguage = useCallback(
    async (lanaguageName: string) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at createLanguage');
        return null;
      }

      if (lanaguageName.trim() === '') {
        alertFeedback('warning', 'Language name cannot be empty string!');
        return null;
      }

      try {
        setLoadingState(true);
        const language = await singletons.graphThirdLayerService.createLanguage(
          lanaguageName,
        );

        setLoadingState(false);
        alertFeedback('success', 'Imported a new language!');

        return language;
      } catch (err) {
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState],
  );

  const getLanguages = useCallback(async () => {
    if (!singletons) {
      alertFeedback('error', 'Internal Error! at getLanguages');
      return [];
    }

    try {
      setLoadingState(true);
      const result = await singletons.graphThirdLayerService.getLanguages();
      setLoadingState(false);
      return result;
    } catch (err) {
      console.log(err);
      setLoadingState(false);
      alertFeedback('error', 'Internal Error!');
      return [];
    }
  }, [singletons, alertFeedback, setLoadingState]);

  return {
    createLanguage,
    getLanguage,
    getLanguages,
  };
}
