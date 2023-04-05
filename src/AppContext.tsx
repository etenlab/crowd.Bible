import React, { createContext, useReducer, useEffect } from 'react';

import { reducer, loadPersistedStore } from '@/reducers/index';

import {
  type IUser,
  type RoleType,
  type StateType as GlobalStateType,
  type FeedbackType,
  type PrefersColorSchemeType,
  TranslatedMap,
} from '@/reducers/global.reducer';
import { type StateType as DocumentToolsStateType } from '@/reducers/documentTools.reducer';
import { type LanguageDto } from '@/dtos/language.dto';

import { useGlobal } from '@/hooks/useGlobal';
import { useDocumentTools } from '@/hooks/useDocumentTools';

import { getAppDataSource } from './data-source';
import getSingletons from './singletons';

export interface ContextType {
  states: {
    global: GlobalStateType;
    documentTools: DocumentToolsStateType;
  };
  actions: {
    setUser: (user: IUser) => void;
    setRole: (role: RoleType) => void;
    setPrefersColorScheme: (themeMode: PrefersColorSchemeType) => void;
    setConnectivity: (connectivity: boolean) => void;
    logout: () => void;
    alertFeedback: (feedbackType: FeedbackType, message: string) => void;
    closeFeedback: () => void;
    setTranslatedMap: (translatedMap: TranslatedMap) => void;
    setSourceLanguage: (lang: LanguageDto | null) => void;
    setTargetLanguage: (lang: LanguageDto | null) => void;
  };
}

export const AppContext = createContext<ContextType | undefined>(undefined);

const initialState = loadPersistedStore();

interface AppProviderProps {
  children?: React.ReactNode;
}

export function AppContextProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    alertFeedback,
    closeFeedback,
    setRole,
    setUser,
    setConnectivity,
    setTranslatedMap,
    setPrefersColorScheme,
    logout,
    setLoadingState,
    setSingletons,
  } = useGlobal({
    dispatch,
  });

  const { setTargetLanguage, setSourceLanguage } = useDocumentTools({
    dispatch,
  });

  useEffect(() => {
    window.addEventListener('offline', () => {
      setConnectivity(false);
    });
    window.addEventListener('online', () => {
      setConnectivity(true);
    });
  }, [setConnectivity]);

  useEffect(() => {
    setSingletons(null);
    getAppDataSource().then((_ds) => {
      getSingletons(_ds).then(setSingletons);
    });
  }, [setSingletons]);

  const value = {
    states: { global: state.global, documentTools: state.documentTools },
    actions: {
      closeFeedback,
      alertFeedback,
      setRole,
      setUser,
      setConnectivity,
      setTranslatedMap,
      setPrefersColorScheme,
      setLoadingState,
      setSingletons,
      setSourceLanguage,
      setTargetLanguage,
      logout,
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
