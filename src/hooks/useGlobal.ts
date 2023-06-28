import { useRef, type Dispatch, useCallback } from 'react';

import {
  setRole as setRoleAction,
  setUser as setUserAction,
  setMode as setModeAction,
  alertFeedback as alertFeedbackAction,
  closeFeedback as closeFeedbackAction,
  setPrefersColorScheme as setPrefersColorSchemeAction,
  setConnectivity as setConnectivityAction,
  logout as logoutAction,
  setLoadingState as setLoadingStateAction,
  setSingletons as setSingletonsAction,
  setSqlPortalShown as setSqlPortalShownAction,
  setSiteTextMap as setSiteTextMapAction,
  changeAppLanguage as changeAppLanguageAction,
  addTempSiteTextItem as addTempSiteTextItemAction,
  clearTempSiteTexts as clearTempSiteTextsAction,
  setCrowdBibleApp as setCrowdBibleAppAction,
} from '@/reducers/global.actions';

import { type ActionType } from '@/reducers/index';
import {
  type FeedbackType,
  type RoleType,
  type IUser,
  type IMode,
  type PrefersColorSchemeType,
  type TempSiteTextItem,
} from '@/reducers/global.reducer';
import { type ISingletons } from '@/src/singletons';

import { LanguageInfo } from '@eten-lab/ui-kit';
import { AppDto } from '@/dtos/document.dto';

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

  const setMode = useCallback((mode: IMode) => {
    dispatchRef.current.dispatch(setModeAction(mode));
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

  const closeFeedback = useCallback(() => {
    dispatchRef.current.dispatch(closeFeedbackAction());
  }, []);

  const logout = useCallback(() => {
    dispatchRef.current.dispatch(logoutAction());
  }, []);

  const setLoadingState = useCallback(
    (
      isLoading: boolean,
      message?: string,
      status?: string,
      isCancelButton?: boolean,
    ) => {
      dispatchRef.current.dispatch(
        setLoadingStateAction(isLoading, message, status, isCancelButton),
      );
    },
    [],
  );

  const setSingletons = useCallback((singletons: ISingletons | null) => {
    dispatchRef.current.dispatch(setSingletonsAction(singletons));
  }, []);

  const setSqlPortalShown = useCallback(
    (
      isSqlPortalShown: boolean,
      position: { x: number; y: number } | undefined,
    ) => {
      dispatchRef.current.dispatch(
        setSqlPortalShownAction(isSqlPortalShown, position),
      );
    },
    [],
  );

  const setSiteTextMap = useCallback(
    (
      siteTextMap: Record<string, { siteText: string; isTranslated: boolean }>,
    ) => {
      dispatchRef.current.dispatch(setSiteTextMapAction(siteTextMap));
    },
    [],
  );

  const changeAppLanguage = useCallback((langInfo: LanguageInfo) => {
    dispatchRef.current.dispatch(changeAppLanguageAction(langInfo));
  }, []);

  const addTempSiteTextItem = useCallback((item: TempSiteTextItem) => {
    dispatchRef.current.dispatch(addTempSiteTextItemAction(item));
  }, []);

  const clearTempSiteTexts = useCallback(() => {
    dispatchRef.current.dispatch(clearTempSiteTextsAction());
  }, []);

  const setCrowdBibleApp = useCallback((app: AppDto) => {
    dispatchRef.current.dispatch(setCrowdBibleAppAction(app));
  }, []);

  return {
    setRole,
    setUser,
    setMode,
    logout,
    setConnectivity,
    setPrefersColorScheme,
    alertFeedback,
    closeFeedback,
    setLoadingState,
    setSingletons,
    setSqlPortalShown,
    setSiteTextMap,
    changeAppLanguage,
    addTempSiteTextItem,
    clearTempSiteTexts,
    setCrowdBibleApp,
  };
}
