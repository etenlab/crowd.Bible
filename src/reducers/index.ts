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

export function reducer(
  state: StateType = initialState,
  action: ActionType<unknown>,
): StateType {
  return {
    global: globalReducer(state.global, action),
  };
}
