import {
  type FeedbackType,
  type RoleType,
  type IUser,
  type PrefersColorSchemeType,
  TranslatedMap,
} from './global.reducer';
import { type ISingletons } from '@/src/singletons';

export const actions = {
  ALERT_FEEDBACK: 'ALERT_FEEDBACK',
  CLOSE_FEEDBACK: 'CLOSE_FEEDBACK',
  SET_ROLE: 'SET_ROLE',
  SET_USER: 'SET_USER',
  SET_PREFERS_COLOR_SCHEME: 'SET_PREFERS_COLOR_SCHEME',
  SET_TRANSLATED_MAP: 'SET_TRANSLATED_MAP',
  SET_CONNECTIVITY: 'SET_CONNECTIVITY',
  LOGOUT: 'LOGOUT',
  SET_LOGING_STATE: 'SET_LOGING_STATE',
  SET_SINGLETONS: 'SET_SINGLETONS',
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

export function setTranslatedMap(translatedMap: TranslatedMap) {
  return {
    type: actions.SET_TRANSLATED_MAP,
    payload: translatedMap,
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

export function setLoadingState(state: boolean) {
  return {
    type: actions.SET_LOGING_STATE,
    payload: state,
  };
}

export function setSingletons(singletons: ISingletons | null) {
  return {
    type: actions.SET_SINGLETONS,
    payload: singletons,
  };
}
