import { useRef, type Dispatch, useCallback } from 'react';

import {
  setMenuCom as setMenuComAction,
  clearMenuCom as clearMenuComAction,
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

  return {
    setMenuCom,
    clearMenuCom,
  };
}
