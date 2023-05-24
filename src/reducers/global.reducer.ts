import { actions } from './global.actions';
import { type ActionType } from '.';
import { type ISingletons } from '@/src/singletons';

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

export type RoleType = [unknown];
export type PrefersColorSchemeType = 'light' | 'dark';

export interface IUser {
  userId: string;
  userEmail: string;
  roles: RoleType;
  prefersColorScheme?: 'light' | 'dark';
}

export interface IMode {
  admin: boolean;
  beta: boolean;
}

export interface StateType {
  user: IUser | null;
  mode: IMode;
  snack: SnackType;
  loading: boolean;
  connectivity: boolean;
  isNewDiscussion: boolean;
  isNewNotification: boolean;
  translatedMap: TranslatedMap;
  singletons: ISingletons | null;
  isSqlPortalShown: boolean;
}

const initialSnact: SnackType = {
  open: false,
  message: '',
  severity: 'success',
};

export const initialState: StateType = {
  user: {
    userId: '',
    userEmail: 'hiroshi@test.com',
    roles: ['translator'],
    prefersColorScheme: 'light',
  },
  mode: {
    admin: true,
    beta: true,
  },
  snack: initialSnact,
  connectivity: true,
  loading: false,
  isNewDiscussion: false,
  isNewNotification: false,
  translatedMap: initialTranslatedMap,
  singletons: null,
  isSqlPortalShown: false,
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
        const newRoles = prevState.user.roles;
        newRoles.push(action.payload as string);
        return {
          ...prevState,
          user: {
            ...prevState.user,
            roles: newRoles,
          },
        };
      } else {
        return prevState;
      }
    }
    case actions.SET_MODE: {
      return {
        ...prevState,
        mode: action.payload as IMode,
      };
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
    case actions.SET_LOGING_STATE: {
      return {
        ...prevState,
        loading: action.payload as boolean,
      };
    }
    case actions.SET_SINGLETONS: {
      return {
        ...prevState,
        singletons: action.payload as ISingletons,
      };
    }
    case actions.SET_SQL_PORTAL_SHOWN: {
      return {
        ...prevState,
        isSqlPortalShown: action.payload as boolean,
      };
    }
    default: {
      return prevState;
    }
  }
}
