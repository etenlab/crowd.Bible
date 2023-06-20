import { useRef, type Dispatch, useCallback, ReactNode } from 'react';

import {
  setMenuCom as setMenuComAction,
  clearMenuCom as clearMenuComAction,
  setModalCom as setModalComAction,
  clearModalCom as clearModalComAction,
} from '@/reducers/components.actions';

import { type ActionType } from '@/reducers/index';

interface UseGlobalComponentsProps {
  dispatch: Dispatch<ActionType<unknown>>;
}

export function useGlobalComponents({ dispatch }: UseGlobalComponentsProps) {
  const dispatchRef = useRef<{ dispatch: Dispatch<ActionType<unknown>> }>({
    dispatch,
  });

  const setMenuCom = useCallback((com: HTMLIonMenuElement) => {
    dispatchRef.current.dispatch(setMenuComAction(com));
  }, []);

  const clearMenuCom = useCallback(() => {
    dispatchRef.current.dispatch(clearMenuComAction());
  }, []);

  const setModalCom = useCallback((com: ReactNode) => {
    dispatchRef.current.dispatch(setModalComAction(com));
  }, []);

  const clearModalCom = useCallback(() => {
    dispatchRef.current.dispatch(clearModalComAction());
  }, []);

  return {
    setMenuCom,
    clearMenuCom,
    setModalCom,
    clearModalCom,
  };
}
