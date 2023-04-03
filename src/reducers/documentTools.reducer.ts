import { actions } from './documentTools.actions';
import { type ActionType } from '.';
import { type LanguageDto } from '@/dtos/language.dto';

export interface StateType {
  sourceLanguage: LanguageDto | null;
  targetLanguage: LanguageDto | null;
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
      console.log(action);
      return {
        ...prevState,
        sourceLanguage: action.payload as LanguageDto | null,
      };
    }
    case actions.SET_TARGET_LANGUAGE: {
      return {
        ...prevState,
        targetLanguage: action.payload as LanguageDto | null,
      };
    }
    default: {
      return prevState;
    }
  }
}
