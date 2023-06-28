import React, {
  createContext,
  useReducer,
  useEffect,
  useRef,
  ReactNode,
} from 'react';

import { reducer, loadPersistedStore } from '@/reducers/index';

import {
  type IUser,
  type RoleType,
  type IMode,
  type StateType as GlobalStateType,
  type FeedbackType,
  type PrefersColorSchemeType,
  type TempSiteTextItem,
} from '@/reducers/global.reducer';
import { type StateType as DocumentToolsStateType } from '@/reducers/documentTools.reducer';
import { type StateType as ComponentsStateType } from '@/reducers/components.reducer';
import { LanguageInfo } from '@eten-lab/ui-kit';

import { useGlobal } from '@/hooks/useGlobal';
import { useDocumentTools } from '@/hooks/useDocumentTools';
import { useGlobalComponents } from '@/hooks/useGlobalComponents';

import { LoggerService } from '@eten-lab/core';
import { ISingletons } from './singletons';

import { getAppDataSource } from './data-source';
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
    createLoadingStack: (
      message?: string,
      status?: string,
      isCancelButton?: boolean,
    ) => {
      startLoading: () => void;
      stopLoading: () => void;
    };
    deleteLoadingState: (id: string) => void;
    setSqlPortalShown: (
      isSqlPortalShown: boolean,
      position?: { x: number; y: number },
    ) => void;
    setMenuCom: (com: HTMLIonMenuElement) => void;
    clearMenuCom: () => void;
    setModalCom: (com: ReactNode) => void;
    clearModalCom: () => void;
    setSiteTextMap: (
      siteTextMap: Record<string, { siteText: string; isTranslated: boolean }>,
    ) => void;
    setSingletons: (singletons: ISingletons | null) => void;
    changeAppLanguage: (langInfo: LanguageInfo) => void;
    addTempSiteTextItem: (item: TempSiteTextItem) => void;
    clearTempSiteTexts: () => void;
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
    createLoadingStack,
    deleteLoadingState,
    setSingletons,
    setSqlPortalShown,
    setSiteTextMap,
    changeAppLanguage,
    addTempSiteTextItem,
    clearTempSiteTexts,
    setCrowdBibleApp,
  } = useGlobal({
    dispatch,
  });

  const { setMenuCom, clearMenuCom, setModalCom, clearModalCom } =
    useGlobalComponents({
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
    if (state.global.singletons) {
      state.global.singletons.documentService
        .createOrFindApp('crowd.Bible', 'ETEN Lab', {
          lang: {
            tag: 'en',
            descriptions: ['English'],
          },
        })
        .then((app) => {
          setCrowdBibleApp(app);
        });
    }
  }, [state.global.singletons, setCrowdBibleApp]);

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
      createLoadingStack,
      deleteLoadingState,
      setSingletons,
      setSourceLanguage,
      setTargetLanguage,
      logout,
      setSqlPortalShown,
      setMenuCom,
      clearMenuCom,
      setModalCom,
      clearModalCom,
      setSiteTextMap,
      changeAppLanguage,
      addTempSiteTextItem,
      clearTempSiteTexts,
    },
    logger: state?.global?.singletons?.loggerService || logger.current,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
