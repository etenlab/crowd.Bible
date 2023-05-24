import React, { createContext, useReducer, useEffect, useRef } from 'react';

import { reducer, loadPersistedStore } from '@/reducers/index';

import {
  type IUser,
  type RoleType,
  type IMode,
  type StateType as GlobalStateType,
  type FeedbackType,
  type PrefersColorSchemeType,
} from '@/reducers/global.reducer';
import { type StateType as DocumentToolsStateType } from '@/reducers/documentTools.reducer';
import { LanguageInfo } from '@eten-lab/ui-kit';

import { useGlobal } from '@/hooks/useGlobal';
import { useDocumentTools } from '@/hooks/useDocumentTools';

import { getAppDataSource } from './data-source';
import getSingletons from './singletons';
import { LoggerService } from './services/logger.service';

export interface ContextType {
  states: {
    global: GlobalStateType;
    documentTools: DocumentToolsStateType;
  };
  actions: {
    setUser: (user: IUser) => void;
    setRole: (roles: RoleType) => void;
    setMode: (mode: IMode) => void;
    setPrefersColorScheme: (themeMode: PrefersColorSchemeType) => void;
    setConnectivity: (connectivity: boolean) => void;
    logout: () => void;
    alertFeedback: (feedbackType: FeedbackType, message: string) => void;
    closeFeedback: () => void;
    setSourceLanguage: (lang: LanguageInfo | null) => void;
    setTargetLanguage: (lang: LanguageInfo | null) => void;
    setLoadingState: (state: boolean) => void;
    setSqlPortalShown: (isSqlPortalShown: boolean) => void;
  };
  logger: LoggerService;
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
    setMode,
    setConnectivity,
    setPrefersColorScheme,
    logout,
    setLoadingState,
    setSingletons,
    setSqlPortalShown,
  } = useGlobal({
    dispatch,
  });

  const { setTargetLanguage, setSourceLanguage } = useDocumentTools({
    dispatch,
  });

  const logger = useRef(new LoggerService());

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
      setMode,
      setConnectivity,
      setPrefersColorScheme,
      setLoadingState,
      setSingletons,
      setSourceLanguage,
      setTargetLanguage,
      logout,
      setSqlPortalShown,
    },
    logger: state?.global?.singletons?.loggerService || logger.current,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
