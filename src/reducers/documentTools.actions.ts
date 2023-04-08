import { LanguageDto } from '@/dtos/language.dto';

export const actions = {
  SET_SOURCE_LANGUAGE: 'SET_SOURCE_LANGUAGE',
  SET_TARGET_LANGUAGE: 'SET_TARGET_LANGUAGE',
};

export function setSourceLanguage(lang: LanguageDto | null) {
  return {
    type: actions.SET_SOURCE_LANGUAGE,
    payload: lang,
  };
}

export function setTargetLanguage(lang: LanguageDto | null) {
  return {
    type: actions.SET_TARGET_LANGUAGE,
    payload: lang,
  };
}
