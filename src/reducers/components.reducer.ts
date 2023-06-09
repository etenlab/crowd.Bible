import { actions } from './components.actions';
import { type ActionType } from '.';

export interface StateType {
  menu?: HTMLIonMenuElement;
}

export const initialState: StateType = {};

export function reducer(
  state: StateType = initialState,
  action: ActionType<unknown>,
): StateType {
  const prevState = { ...state };
  const { type } = action;

  switch (type) {
    case actions.SET_MENU_COM: {
      return {
        ...prevState,
        menu: action.payload as HTMLIonMenuElement,
      };
    }
    case actions.CLEAR_MENU_COM: {
      return {
        ...prevState,
        menu: undefined,
      };
    }
    default: {
      return prevState;
    }
  }
}
