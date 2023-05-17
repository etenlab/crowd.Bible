import { LanguageInfo } from '@eten-lab/ui-kit';

export interface Votable {
  upVotes: number;
  downVotes: number;
  candidateId: Nanoid;
}

export interface SiteTextDto extends Votable {
  siteTextId: Nanoid;
  relationshipId: Nanoid;
  languageInfo: LanguageInfo;
  siteText: string;
  definition: string;
}

export interface SiteTextTranslationDto extends Votable {
  original: SiteTextDto;
  translatedSiteText: string;
  translatedDefinition: string;
  languageInfo: LanguageInfo;
}

export interface TranslatedSiteTextDto {
  siteTextId: Nanoid;
  siteText: string;
  translatedSiteText?: string;
  translationCnt: number;
}
