import React, { createContext, useReducer } from 'react';

import { reducer, loadPersistedStore } from '@/reducers/index';

import {
  type IUser,
  type RoleType,
  type StateType as GlobalStateType,
  type FeedbackType,
  type PrefersColorSchemeType,
  TranslatedMap,
} from './reducers/global.reducer';

import { useGlobal } from './hooks/useGlobal';

export interface ContextType {
  states: {
    global: GlobalStateType;
  };
  actions: {
    setUser: (user: IUser) => void;
    setRole: (role: RoleType) => void;
    setPrefersColorScheme: (themeMode: PrefersColorSchemeType) => void;
    logout: () => void;
    alertFeedback: (feedbackType: FeedbackType, message: string) => void;
    closeFeedback: () => void;
    setTranslatedMap: (translatedMap: TranslatedMap) => void;
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
    logout,
    setPrefersColorScheme,
    setTranslatedMap,
  } = useGlobal({
    dispatch,
  });
  const value = {
    states: { global: state.global },
    actions: {
      closeFeedback,
      alertFeedback,
      setRole,
      setUser,
      logout,
      setPrefersColorScheme,
      setTranslatedMap,
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
