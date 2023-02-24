import { actions } from "./global.actions";
import { ActionType } from ".";

export type FeedbackType = "success" | "error" | "info" | "warning";

export type SnackType = {
  open: boolean;
  message: string;
  severity: FeedbackType;
};

export type RoleType = "reader" | "translator";

export type StateType = {
  userId: number | null;
  role: RoleType;
  snack: SnackType;
  loading: boolean;
  isNewDiscussion: boolean;
  isNewNotification: boolean;
};

const initialSnact: SnackType = {
  open: false,
  message: "",
  severity: "success",
};

export const initialState: StateType = {
  userId: null,
  role: "translator",
  snack: initialSnact,
  loading: false,
  isNewDiscussion: false,
  isNewNotification: false,
};

export function reducer(
  state: StateType = initialState,
  action: ActionType<unknown>
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
    case actions.SET_ROLE: {
      return {
        ...prevState,
        role: action.payload as RoleType,
      };
    }
    default: {
      return prevState;
    }
  }
}
