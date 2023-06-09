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
import { type StateType as ComponentsStateType } from '@/reducers/components.reducer';
import { LanguageInfo } from '@eten-lab/ui-kit';

import { useGlobal } from '@/hooks/useGlobal';
import { useDocumentTools } from '@/hooks/useDocumentTools';
import { useGlobalComponents } from '@/hooks/useGlobalComponents';

import { getAppDataSource } from './data-source';
import { LoggerService } from '@eten-lab/core';
import getSingletons from './singletons';

export interface ContextType {
  states: {
    global: GlobalStateType;
    documentTools: DocumentToolsStateType;
    components: ComponentsStateType;
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
    setMenuCom: (com: HTMLIonMenuElement) => void;
    clearMenuCom: () => void;
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

  const { setMenuCom, clearMenuCom } = useGlobalComponents({
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
  }, [setSingletons]);

  useEffect(() => {
    if (state.global.singletons === null) {
      getAppDataSource().then((_ds) => {
        getSingletons(_ds).then(setSingletons);
      });
    }
  }, [setSingletons, state.global.singletons]);

  const value = {
    states: {
      global: state.global,
      documentTools: state.documentTools,
      components: state.components,
    },
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
      setMenuCom,
      clearMenuCom,
    },
    logger: state?.global?.singletons?.loggerService || logger.current,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
