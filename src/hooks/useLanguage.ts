import { useCallback } from 'react';
import { useAppContext } from '@/hooks/useAppContext';

export type MockApp = {
  id: Nanoid;
  name: string;
  languageId: Nanoid;
};

const mockAppList = [
  {
    id: '1',
    name: 'App Name 1',
  },
  {
    id: '2',
    name: 'App Name 2',
  },
  {
    id: '3',
    name: 'App Name 3',
  },
  {
    id: '4',
    name: 'App Name 4',
  },
  {
    id: '5',
    name: 'App Name 5',
  },
  {
    id: '6',
    name: 'App Name 6',
  },
];

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

  const getMockAppList = useCallback(async () => {
    const languages = await getLanguages();

    if (languages.length === 0) {
      return [];
    }

    return mockAppList.map(
      (app, index) =>
        ({
          ...app,
          name: `${app.name} Language(${languages[index].name})`,
          languageId: languages[index].id,
        } as MockApp),
    );
  }, [getLanguages]);

  const getMockAppById = useCallback(
    async (appId: Nanoid) => {
      const apps = await getMockAppList();

      const app = apps.find((app) => app.id === appId);

      if (!app) {
        return null;
      }

      return app;
    },
    [getMockAppList],
  );

  return {
    createLanguage,
    getLanguage,
    getLanguages,

    getMockAppById,
    getMockAppList,
  };
}
