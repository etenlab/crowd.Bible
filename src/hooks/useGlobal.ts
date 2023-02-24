import { useRef, Dispatch, useCallback } from "react";

import {
  setRole as setRoleAction,
  alertFeedback as alertFeedbackAction,
  closeFeedback as closeFeedbackAction,
} from "../reducers/global.actions";

import { ActionType } from "../reducers";
import { FeedbackType, RoleType } from "../reducers/global.reducer";

type UseGlobalProps = {
  dispatch: Dispatch<ActionType<unknown>>;
};

// This hook take care every chagnes of discussion's state via connecting graphql servers
export function useGlobal({ dispatch }: UseGlobalProps) {
  const dispatchRef = useRef<{ dispatch: Dispatch<ActionType<unknown>> }>({
    dispatch,
  });

  const setRole = useCallback((role: RoleType) => {
    dispatchRef.current.dispatch(setRoleAction(role));
  }, []);

  const alertFeedback = useCallback(
    (feedbackType: FeedbackType, message: string) => {
      dispatchRef.current.dispatch(alertFeedbackAction(feedbackType, message));
    },
    []
  );

  const closeFeedback = useCallback(() => {
    dispatchRef.current.dispatch(closeFeedbackAction());
  }, []);

  return {
    setRole,
    alertFeedback,
    closeFeedback,
  };
}
