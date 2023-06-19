export const actions = {
  SET_MENU_COM: 'CHANGE_MENU_COM',
  CLEAR_MENU_COM: 'CLEAR_MENU_COM',
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
