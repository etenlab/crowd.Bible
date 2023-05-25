import { LanguageInfo } from '@eten-lab/ui-kit';
import { Votable } from './site-text.dto';

export interface DefinitionDto extends Votable {
  wordId: Nanoid;
  wordText: string;
  definitionId: Nanoid;
  definitionText: string;
  languageInfo: LanguageInfo;
  relationshipId: Nanoid;
}
