import { actions } from './global.actions';
import { type ActionType } from '.';

export type FeedbackType = 'success' | 'error' | 'info' | 'warning';

export interface SnackType {
  open: boolean;
  message: string;
  severity: FeedbackType;
}

export type RoleType = 'reader' | 'translator';

export interface IUser {
  userId: number;
  userEmail: string;
  role: RoleType;
}

export interface StateType {
  user: IUser | null;
  snack: SnackType;
  loading: boolean;
  isNewDiscussion: boolean;
  isNewNotification: boolean;
}

const initialSnact: SnackType = {
  open: false,
  message: '',
  severity: 'success',
};

export const initialState: StateType = {
  user: null,
  snack: initialSnact,
  loading: false,
  isNewDiscussion: false,
  isNewNotification: false,
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
    default: {
      return prevState;
    }
  }
}
