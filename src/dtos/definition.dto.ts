import { LanguageInfo } from '@eten-lab/ui-kit';

export interface DefinitionDto {
  wordId: Nanoid;
  wordText: string;
  definitionId: Nanoid;
  definitionText: string;
  languageInfo: LanguageInfo;
  relationshipId: Nanoid;
}
