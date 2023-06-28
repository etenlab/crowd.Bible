import {
  type FeedbackType,
  type RoleType,
  type IUser,
  type IMode,
  type PrefersColorSchemeType,
  type TempSiteTextItem,
} from './global.reducer';
import { type ISingletons } from '@/src/singletons';
import { LanguageInfo } from '@eten-lab/ui-kit';
import { AppDto } from '@/dtos/document.dto';

export const actions = {
  ALERT_FEEDBACK: 'ALERT_FEEDBACK',
  CLOSE_FEEDBACK: 'CLOSE_FEEDBACK',
  SET_ROLE: 'SET_ROLE',
  SET_USER: 'SET_USER',
  SET_MODE: 'SET_MODE',
  SET_PREFERS_COLOR_SCHEME: 'SET_PREFERS_COLOR_SCHEME',
  SET_CONNECTIVITY: 'SET_CONNECTIVITY',
  LOGOUT: 'LOGOUT',
  SET_LOGING_STATE: 'SET_LOGING_STATE',
  DELETE_LOADING_STATE: 'DELETE_LOADING_STATE',
  SET_SINGLETONS: 'SET_SINGLETONS',
  SET_SQL_PORTAL_SHOWN: 'SET_SQL_PORTAL_SHOWN',
  CHANGE_APP_LANGUAGE: 'CHANGE_APP_LANGUAGE',
  SET_SITE_TEXT_MAP: 'SET_SITE_TEXT_MAP',
  ADD_TEMP_SITE_TEXTS: 'ADD_TEMP_SITE_TEXTS',
  CLEAR_TEMP_SITE_TEXTS: 'CLEAR_TEMP_SITE_TEXTS',
  SET_CROWD_BIBLE_APP: 'SET_CROWD_BIBLE_APP',
};

export function setUser(user: IUser) {
  return {
    type: actions.SET_USER,
    payload: user,
  };
}

export function setRole(role: RoleType) {
  return {
    type: actions.SET_ROLE,
    payload: role,
  };
}

export function setMode(mode: IMode) {
  return {
    type: actions.SET_MODE,
    payload: mode,
  };
}

export function setPrefersColorScheme(prefers: PrefersColorSchemeType) {
  return {
    type: actions.SET_PREFERS_COLOR_SCHEME,
    payload: prefers,
  };
}

export function alertFeedback(feedbackType: FeedbackType, message: string) {
  return {
    type: actions.ALERT_FEEDBACK,
    payload: {
      feedbackType,
      message,
    },
  };
}

export function closeFeedback() {
  return {
    type: actions.CLOSE_FEEDBACK,
    payload: null,
  };
}

export function setConnectivity(connectivity: boolean) {
  return {
    type: actions.SET_CONNECTIVITY,
    payload: connectivity,
  };
}

export function logout() {
  return {
    type: actions.LOGOUT,
    payload: null,
  };
}

export function setLoadingState(
  id: string,
  message?: string,
  status?: string,
  isCancelButton?: boolean,
) {
  return {
    type: actions.SET_LOGING_STATE,
    payload: {
      id,
      message,
      status,
      isCancelButton,
    },
  };
}

export function deleteLoadingState(id: string) {
  return {
    type: actions.DELETE_LOADING_STATE,
    payload: id,
  };
}

export function setSingletons(singletons: ISingletons | null) {
  return {
    type: actions.SET_SINGLETONS,
    payload: singletons,
  };
}

export function setSqlPortalShown(
  isShown: boolean,
  position: { x: number; y: number } | undefined,
) {
  return {
    type: actions.SET_SQL_PORTAL_SHOWN,
    payload: { isShown, position },
  };
}

export function changeAppLanguage(langInfo: LanguageInfo) {
  return {
    type: actions.CHANGE_APP_LANGUAGE,
    payload: langInfo,
  };
}

export function setSiteTextMap(
  siteTextMap: Record<string, { siteText: string; isTranslated: boolean }>,
) {
  return {
    type: actions.SET_SITE_TEXT_MAP,
    payload: siteTextMap,
  };
}

export function addTempSiteTextItem(item: TempSiteTextItem) {
  return {
    type: actions.ADD_TEMP_SITE_TEXTS,
    payload: item,
  };
}

export function clearTempSiteTexts() {
  return {
    type: actions.CLEAR_TEMP_SITE_TEXTS,
    payload: null,
  };
}

export function setCrowdBibleApp(app: AppDto) {
  return {
    type: actions.SET_CROWD_BIBLE_APP,
    payload: app,
  };
}
