import {
  type StateType as GlobalStateType,
  initialState as globalInitialState,
  reducer as globalReducer,
} from './global.reducer';

export interface ActionType<T> {
  type: string;
  payload: T;
}

export interface StateType {
  global: GlobalStateType;
}

export const initialState = {
  global: globalInitialState,
};

const CROWD_BIBLE_STATE = 'CROWD_BIBLE_STATE';

export function persistStore(state: StateType) {
  try {
    window.localStorage.setItem(CROWD_BIBLE_STATE, JSON.stringify(state));
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

    return JSON.parse(state) as StateType;
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
  };

  // console.log(newState);

  persistStore(newState);

  return newState;
}
