import { FeedbackType, RoleType } from "./global.reducer";

export const actions = {
  ALERT_FEEDBACK: "ALERT_FEEDBACK",
  CLOSE_FEEDBACK: "CLOSE_FEEDBACK",
  SET_ROLE: "SET_ROLE",
};

export function setRole(role: RoleType) {
  return {
    type: actions.SET_ROLE,
    payload: role,
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
