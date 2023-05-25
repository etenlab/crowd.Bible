import { LanguageInfo } from '@eten-lab/ui-kit';

export interface DocumentDto {
  id: Nanoid;
  name: string;
  languageInfo: LanguageInfo;
}

/**
 * @deprecated
 * just using test purpose
 */
export interface AppDto {
  id: Nanoid;
  name: string;
  organizationName: string;
  languageInfo: LanguageInfo;
}
