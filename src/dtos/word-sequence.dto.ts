import { Votable } from './site-text.dto';

export interface WordSequenceDto {
  id: string;
  text: string;
  languageId: Nanoid;
  documentId?: Nanoid;
  creatorId: Nanoid;
  importUid?: string;
}

export interface SubWordSequenceDto extends WordSequenceDto {
  parentWordSequenceId: Nanoid;
  position: number;
  length: number;
}

export interface WordSequenceTranslationDto extends Votable {
  originalId: Nanoid;
  translationId: Nanoid;
}
