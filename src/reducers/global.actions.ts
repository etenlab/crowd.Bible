import {
  type FeedbackType,
  type RoleType,
  type IUser,
  type PrefersColorSchemeType,
  TranslatedMap,
} from './global.reducer';

export const actions = {
  ALERT_FEEDBACK: 'ALERT_FEEDBACK',
  CLOSE_FEEDBACK: 'CLOSE_FEEDBACK',
  SET_ROLE: 'SET_ROLE',
  SET_USER: 'SET_USER',
  SET_PREFERS_COLOR_SCHEME: 'SET_PREFERS_COLOR_SCHEME',
  SET_TRANSLATED_MAP: 'SET_TRANSLATED_MAP',
  LOGOUT: 'LOGOUT',
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

export function logout() {
  return {
    type: actions.LOGOUT,
    payload: null,
  };
}
