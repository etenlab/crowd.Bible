import {
  type StateType as GlobalStateType,
  initialState as globalInitialState,
  reducer as globalReducer,
} from './global.reducer';
import {
  type StateType as DocumentToolsStateType,
  initialState as DocumentToolsInitialState,
  reducer as documentToolsReducer,
} from './documentTools.reducer';

export interface ActionType<T> {
  type: string;
  payload: T;
}

export interface StateType {
  global: GlobalStateType;
  documentTools: DocumentToolsStateType;
}

export const initialState = {
  global: globalInitialState,
  documentTools: DocumentToolsInitialState,
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
          loading: false,
        },
      }),
    );
  } catch (err) {
    console.log(err);
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
        connectivity: window.navigator.onLine,
      },
    };
  } catch (err) {
    console.log(err);
  }

  return initialState;
}

export function reducer(
  state: StateType = initialState,
  action: ActionType<unknown>,
): StateType {
  if (action.type === 'logout') {
    return initialState;
  }

  const newState = {
    global: globalReducer(state.global, action),
    documentTools: documentToolsReducer(state.documentTools, action),
  };

  persistStore(newState);

  return newState;
}
