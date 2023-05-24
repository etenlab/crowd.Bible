import { useRef, type Dispatch, useCallback } from 'react';

import {
  setSourceLanguage as setSourceLanguageAction,
  setTargetLanguage as setTargetLanguageAction,
} from '@/reducers/documentTools.actions';

import { LanguageInfo } from '@eten-lab/ui-kit/dist/LangSelector/LangSelector';
import { type ActionType } from '@/reducers/index';

interface UseDocumentTools {
  dispatch: Dispatch<ActionType<unknown>>;
}

export function useDocumentTools({ dispatch }: UseDocumentTools) {
  const dispatchRef = useRef<{ dispatch: Dispatch<ActionType<unknown>> }>({
    dispatch,
  });

  const setSourceLanguage = useCallback((lang: LanguageInfo | null) => {
    dispatchRef.current.dispatch(setSourceLanguageAction(lang));
  }, []);

  const setTargetLanguage = useCallback((lang: LanguageInfo | null) => {
    dispatchRef.current.dispatch(setTargetLanguageAction(lang));
  }, []);

  return {
    setSourceLanguage,
    setTargetLanguage,
  };
}
