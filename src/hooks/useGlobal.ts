import { useRef, type Dispatch, useCallback } from 'react';

import {
  setRole as setRoleAction,
  setUser as setUserAction,
  alertFeedback as alertFeedbackAction,
  closeFeedback as closeFeedbackAction,
  setTranslatedMap as setTranslatedMapAction,
  setPrefersColorScheme as setPrefersColorSchemeAction,
  setConnectivity as setConnectivityAction,
  logout as logoutAction,
  setLoadingState as setLoadingStateAction,
  setSingletons as setSingletonsAction,
} from '@/reducers/global.actions';

import { type ActionType } from '@/reducers/index';
import {
  type FeedbackType,
  type RoleType,
  type IUser,
  type PrefersColorSchemeType,
  TranslatedMap,
} from '@/reducers/global.reducer';
import { type ISingletons } from '@/src/singletons';

interface UseGlobalProps {
  dispatch: Dispatch<ActionType<unknown>>;
}

export function useGlobal({ dispatch }: UseGlobalProps) {
  const dispatchRef = useRef<{ dispatch: Dispatch<ActionType<unknown>> }>({
    dispatch,
  });

  const setUser = useCallback((user: IUser) => {
    dispatchRef.current.dispatch(setUserAction(user));
  }, []);

  const setRole = useCallback((role: RoleType) => {
    dispatchRef.current.dispatch(setRoleAction(role));
  }, []);

  const setPrefersColorScheme = useCallback(
    (prefers: PrefersColorSchemeType) => {
      dispatchRef.current.dispatch(setPrefersColorSchemeAction(prefers));
    },
    [],
  );

  const setConnectivity = useCallback((connectivity: boolean) => {
    dispatchRef.current.dispatch(setConnectivityAction(connectivity));
  }, []);

  const alertFeedback = useCallback(
    (feedbackType: FeedbackType, message: string) => {
      dispatchRef.current.dispatch(alertFeedbackAction(feedbackType, message));
    },
    [],
  );

  const setTranslatedMap = useCallback((translatedMap: TranslatedMap) => {
    dispatchRef.current.dispatch(setTranslatedMapAction(translatedMap));
  }, []);

  const closeFeedback = useCallback(() => {
    dispatchRef.current.dispatch(closeFeedbackAction());
  }, []);

  const logout = useCallback(() => {
    dispatchRef.current.dispatch(logoutAction());
  }, []);

  const setLoadingState = useCallback((state: boolean) => {
    dispatchRef.current.dispatch(setLoadingStateAction(state));
  }, []);

  const setSingletons = useCallback((singletons: ISingletons | null) => {
    dispatchRef.current.dispatch(setSingletonsAction(singletons));
  }, []);

  return {
    setRole,
    setUser,
    logout,
    setConnectivity,
    setPrefersColorScheme,
    alertFeedback,
    closeFeedback,
    setTranslatedMap,
    setLoadingState,
    setSingletons,
  };
}
