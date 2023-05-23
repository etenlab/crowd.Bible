import { actions } from './documentTools.actions';
import { type ActionType } from '.';
import { LanguageInfo } from '@eten-lab/ui-kit';

export interface StateType {
  sourceLanguage: LanguageInfo | null;
  targetLanguage: LanguageInfo | null;
}

export const initialState: StateType = {
  sourceLanguage: null,
  targetLanguage: null,
};

export function reducer(
  state: StateType = initialState,
  action: ActionType<unknown>,
): StateType {
  const prevState = { ...state };
  const { type } = action;

  switch (type) {
    case actions.SET_SOURCE_LANGUAGE: {
      return {
        ...prevState,
        sourceLanguage: action.payload as LanguageInfo | null,
      };
    }
    case actions.SET_TARGET_LANGUAGE: {
      return {
        ...prevState,
        targetLanguage: action.payload as LanguageInfo | null,
      };
    }
    default: {
      return prevState;
    }
  }
}
