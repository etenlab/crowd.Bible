export interface Votable {
  upVotes: number;
  downVotes: number;
  candidateId: Nanoid;
}

export interface SiteTextDto extends Votable {
  siteTextId: Nanoid;
  relationshipId: Nanoid;
  languageId: Nanoid;
  siteText: string;
  definition: string;
}

export interface SiteTextTranslationDto extends Votable {
  original: SiteTextDto;
  translatedSiteText: string;
  translatedDefinition: string;
  languageId: Nanoid;
}

export interface TranslatedSiteTextDto {
  siteTextId: Nanoid;
  siteText: string;
  translatedSiteText?: string;
  translationCnt: number;
}
