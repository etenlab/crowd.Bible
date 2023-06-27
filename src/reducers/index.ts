import {
  type StateType as GlobalStateType,
  initialState as globalInitialState,
  reducer as globalReducer,
} from './global.reducer';
import {
  type StateType as DocumentToolsStateType,
  initialState as documentToolsInitialState,
  reducer as documentToolsReducer,
} from './documentTools.reducer';
import {
  type StateType as ComponentsStateType,
  initialState as componentsInitialState,
  reducer as componentsReducer,
} from './components.reducer';

import { actions } from './global.actions';

import { LoggerService } from '@eten-lab/core';

const logger = new LoggerService();

export interface ActionType<T> {
  type: string;
  payload: T;
}

export interface StateType {
  global: GlobalStateType;
  documentTools: DocumentToolsStateType;
  components: ComponentsStateType;
}

export const initialState = {
  global: globalInitialState,
  documentTools: documentToolsInitialState,
  components: componentsInitialState,
};

const CROWD_BIBLE_STATE = 'CROWD_BIBLE_STATE';

export function persistStore(state: StateType) {
  try {
    window.localStorage.setItem(
      CROWD_BIBLE_STATE,
      JSON.stringify({
        ...state,
        global: {
          ...state.global,
          singletons: null,
          loadingStack: [],
        },
        components: {},
      }),
    );
  } catch (err) {
    logger.error(err);
  }
}

export function loadPersistedStore(): StateType {
  try {
    const state = window.localStorage.getItem(CROWD_BIBLE_STATE);

    if (state === null) {
      return initialState;
    }

    const newState = JSON.parse(state) as StateType;
    return {
      ...newState,
      global: {
        ...newState.global,
        loadingStack: [],
        connectivity: window.navigator.onLine,
      },
      components: {},
    };
  } catch (err) {
    logger.error(err);
  }

  return initialState;
}

export function reducer(
  state: StateType = initialState,
  action: ActionType<unknown>,
): StateType {
  if (action.type === actions.LOGOUT) {
    persistStore(initialState);
    return initialState;
  }

  const newState = {
    global: globalReducer(state.global, action),
    documentTools: documentToolsReducer(state.documentTools, action),
    components: componentsReducer(state.components, action),
  };

  persistStore(newState);

  return newState;
}
