import { actions } from './global.actions';
import { type ActionType } from '.';

export type FeedbackType = 'success' | 'error' | 'info' | 'warning';

export interface SnackType {
  open: boolean;
  message: string;
  severity: FeedbackType;
}
export interface TranslatedMap {
  translatedMapStr?: string;
}

const initialTranslatedMap: TranslatedMap = {
  translatedMapStr: undefined,
};

export type RoleType = 'reader' | 'translator';
export type PrefersColorSchemeType = 'light' | 'dark';

export interface IUser {
  userId: number;
  userEmail: string;
  role: RoleType;
  prefersColorScheme?: 'light' | 'dark';
}

export interface StateType {
  user: IUser | null;
  snack: SnackType;
  loading: boolean;
  connectivity: boolean;
  isNewDiscussion: boolean;
  isNewNotification: boolean;
  translatedMap: TranslatedMap;
}

const initialSnact: SnackType = {
  open: false,
  message: '',
  severity: 'success',
};

export const initialState: StateType = {
  user: {
    userId: 1,
    userEmail: 'hiroshi@test.com',
    role: 'translator',
    prefersColorScheme: 'light',
  },
  snack: initialSnact,
  connectivity: true,
  loading: false,
  isNewDiscussion: false,
  isNewNotification: false,
  translatedMap: initialTranslatedMap,
};

export function reducer(
  state: StateType = initialState,
  action: ActionType<unknown>,
): StateType {
  const prevState = { ...state };
  const { type } = action;

  switch (type) {
    case actions.ALERT_FEEDBACK: {
      const { feedbackType, message } = action.payload as {
        feedbackType: FeedbackType;
        message: string;
      };
      return {
        ...prevState,
        snack: {
          open: true,
          message,
          severity: feedbackType,
        },
      };
    }
    case actions.CLOSE_FEEDBACK: {
      return {
        ...prevState,
        snack: { ...initialSnact },
      };
    }
    case actions.SET_USER: {
      return {
        ...prevState,
        user: action.payload as IUser,
      };
    }
    case actions.SET_ROLE: {
      if (prevState.user != null) {
        return {
          ...prevState,
          user: {
            ...prevState.user,
            role: action.payload as RoleType,
          },
        };
      } else {
        return prevState;
      }
    }
    case actions.SET_PREFERS_COLOR_SCHEME: {
      if (prevState.user === null) {
        return prevState;
      }

      return {
        ...prevState,
        user: {
          ...prevState.user,
          prefersColorScheme: action.payload as PrefersColorSchemeType,
        },
      };
    }
    case actions.SET_TRANSLATED_MAP: {
      return {
        ...prevState,
        translatedMap: action.payload as TranslatedMap,
      };
    }
    case actions.SET_CONNECTIVITY: {
      return {
        ...prevState,
        connectivity: action.payload as boolean,
      };
    }
    case actions.LOGOUT: {
      return {
        ...prevState,
        user: null,
      };
    }
    default: {
      return prevState;
    }
  }
}
