import { LanguageInfo } from '@eten-lab/ui-kit';

export const actions = {
  SET_SOURCE_LANGUAGE: 'SET_SOURCE_LANGUAGE',
  SET_TARGET_LANGUAGE: 'SET_TARGET_LANGUAGE',
};

export function setSourceLanguage(lang: LanguageInfo | null) {
  return {
    type: actions.SET_SOURCE_LANGUAGE,
    payload: lang,
  };
}

export function setTargetLanguage(lang: LanguageInfo | null) {
  return {
    type: actions.SET_TARGET_LANGUAGE,
    payload: lang,
  };
}
