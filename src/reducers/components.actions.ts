import { ReactNode } from 'react';

export const actions = {
  SET_MENU_COM: 'CHANGE_MENU_COM',
  CLEAR_MENU_COM: 'CLEAR_MENU_COM',
  SET_MODAL_COM: 'SET_MODAL_COM',
  CLEAR_MODAL_COM: 'CLEAR_MODAL_COM',
};

export function setMenuCom(com: HTMLIonMenuElement) {
  return {
    type: actions.SET_MENU_COM,
    payload: com,
  };
}

export function clearMenuCom() {
  return {
    type: actions.CLEAR_MENU_COM,
    payload: null,
  };
}

export function setModalCom(com: ReactNode) {
  return {
    type: actions.SET_MODAL_COM,
    payload: com,
  };
}

export function clearModalCom() {
  return {
    type: actions.CLEAR_MODAL_COM,
    payload: null,
  };
}
