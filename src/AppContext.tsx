import React, { createContext, useReducer } from "react";

import { reducer, initialState as reducerInitialState } from "./reducers";

import {
  IUser,
  RoleType,
  StateType as GlobalStateType,
} from "./reducers/global.reducer";

import { useGlobal } from "./hooks/useGlobal";
import { FeedbackType } from "./reducers/global.reducer";

export interface ContextType {
  states: {
    global: GlobalStateType;
  };
  actions: {
    setUser(user: IUser): void;
    setRole(role: RoleType): void;
    alertFeedback(feedbackType: FeedbackType, message: string): void;
    closeFeedback(): void;
  };
}

export const AppContext = createContext<ContextType | undefined>(undefined);

type AppProviderProps = {
  children?: React.ReactNode;
};

export function AppContextProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(reducer, reducerInitialState);

  const { alertFeedback, closeFeedback, setRole, setUser } = useGlobal({
    dispatch,
  });
  const value = {
    states: { global: state.global },
    actions: { closeFeedback, alertFeedback, setRole, setUser },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
