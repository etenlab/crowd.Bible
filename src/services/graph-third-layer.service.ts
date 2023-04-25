import { FindOptionsWhere } from 'typeorm';

import { UserService } from './user.service';
import { DocumentService } from './document.service';
import { WordService } from './word.service';
import { PhraseService } from './phrase.service';
import { LanguageService } from './language.service';
import { WordSequenceService } from './word-sequence.service';
import { MapService } from './map.service';

import { Node, Relationship } from '@/src/models';

import { MapDto } from '@/dtos/map.dto';
import { LanguageDto } from '@/dtos/language.dto';
import { DocumentDto } from '@/dtos/document.dto';
import { UserDto } from '@/dtos/user.dto';
import {
  WordSequenceDto,
  WordSequenceWithSubDto,
} from '@/dtos/word-sequence.dto';

/**
 * @deprecated
 * This service will be depreciated as soon as possible.
 * Don't put new features any more!
 * If you've worked with this service, refactor into a specific service.
 */
export class GraphThirdLayerService {
  constructor(
    private readonly userService: UserService,
    private readonly documentService: DocumentService,
    private readonly wordService: WordService,
    private readonly phraseService: PhraseService,
    private readonly wordSequenceService: WordSequenceService,
    private readonly languageService: LanguageService,
    private readonly mapService: MapService,
  ) {}

  async createUser(email: string): Promise<UserDto> {
    return this.userService.createOrFindUser(email);
  }

  async getUser(email: string): Promise<UserDto | null> {
    return this.userService.getUser(email);
  }

  async createDocument(name: string): Promise<DocumentDto> {
    return this.documentService.createOrFindDocument(name);
  }

  async getDocument(name: string): Promise<DocumentDto | null> {
    return this.documentService.getDocument(name);
  }

  async listDocument(): Promise<DocumentDto[]> {
    return this.documentService.listDocument();
  }

  async createOrFindWord({
    word,
    languageId,
    mapId,
    siteText,
  }: {
    word: string;
    languageId: Nanoid;
    siteText?: boolean;
    mapId?: Nanoid;
  }): Promise<Nanoid> {
    return this.wordService.createOrFindWord({
      word,
      languageId,
      mapId,
      siteText,
    });
  }

  async createWords(
    words: string[],
    langId: Nanoid,
    mapId?: Nanoid,
  ): Promise<Nanoid[]> {
    return this.wordService.createWords(words, langId, mapId);
  }

  async getWord(word: string, language: Nanoid): Promise<Nanoid | null> {
    return this.wordService.getWord(word, language);
  }

  async getWords(
    relQuery?:
      | FindOptionsWhere<Relationship>
      | FindOptionsWhere<Relationship>[],
    additionalRelations: string[] = [],
  ): Promise<Node[]> {
    return this.wordService.getWords(relQuery, additionalRelations);
  }

  async getMapWords(mapId: Nanoid) {
    return this.wordService.getMapWords(mapId);
  }

  async getUnTranslatedWords(langId: Nanoid) {
    return this.wordService.getUnTranslatedWords(langId);
  }

  async createWordTranslationRelationship(
    from: Nanoid,
    to: Nanoid,
  ): Promise<Nanoid> {
    return this.wordService.createWordTranslationRelationship(from, to);
  }

  async createOrFindPhrase({
    phrase,
    languageId,
    siteText,
  }: {
    phrase: string;
    languageId: Nanoid;
    siteText?: boolean;
  }): Promise<Nanoid> {
    return this.phraseService.createOrFindPhrase({
      phrase,
      languageId,
      siteText,
    });
  }

  async getPhrase(phrase: string, languageId: Nanoid): Promise<Nanoid | null> {
    return this.phraseService.getPhrase(phrase, languageId);
  }

  async createWordSequence({
    text,
    creatorId,
    languageId,
    documentId,
    withWordsRelationship = true,
  }: {
    text: string;
    creatorId: Nanoid;
    languageId: Nanoid;
    documentId?: Nanoid;
    withWordsRelationship?: boolean;
  }): Promise<Node> {
    return this.wordSequenceService.createWordSequence({
      text,
      creatorId,
      languageId,
      documentId,
      withWordsRelationship,
    });
  }

  async createSubWordSequence(
    parentWordSequenceId: Nanoid,
    subText: string,
    position: number,
    len: number,
    creator: Nanoid,
  ): Promise<Node> {
    return this.wordSequenceService.createSubWordSequence(
      parentWordSequenceId,
      subText,
      position,
      len,
      creator,
    );
  }

  async getOriginWordSequenceByDocumentId(
    documentId: Nanoid,
    withSubWordSequence = false,
  ): Promise<WordSequenceDto | WordSequenceWithSubDto | null> {
    return this.wordSequenceService.getOriginWordSequenceByDocumentId(
      documentId,
      withSubWordSequence,
    );
  }

  async getWordSequenceById(
    wordSequenceId: Nanoid,
  ): Promise<WordSequenceDto | null> {
    return this.wordSequenceService.getWordSequenceById(wordSequenceId);
  }

  async getText(word_sequence_id: Nanoid): Promise<string | null> {
    return this.wordSequenceService.getTextFromWordSequenceId(word_sequence_id);
  }

  async appendWordSequence(from: Nanoid, to: Nanoid): Promise<Relationship> {
    return this.wordSequenceService.appendWordSequence(from, to);
  }

  async getWordSequence(text: string): Promise<Nanoid[]> {
    return this.wordSequenceService.getWordSequence(text);
  }

  async listTranslationsByDocumentId(
    documentId: Nanoid,
    languageId: Nanoid,
    userId?: Nanoid,
  ) {
    return this.wordSequenceService.listTranslationsByDocumentId(
      documentId,
      languageId,
      userId,
    );
  }

  async listTranslationsByWordSequenceId(
    wordSequenceId: Nanoid,
    languageId: Nanoid,
    userId?: Nanoid,
  ) {
    return this.wordSequenceService.listTranslationsByWordSequenceId(
      wordSequenceId,
      languageId,
      userId,
    );
  }

  async createLanguage(language: string): Promise<Nanoid> {
    return this.languageService.createOrFindLanguage(language);
  }

  async getLanguage(name: string): Promise<Nanoid | null> {
    return this.languageService.getLanguage(name);
  }

  async getLanguages(): Promise<LanguageDto[]> {
    return this.languageService.getLanguages();
  }

  async saveMap(
    langId: Nanoid,
    mapInfo: {
      name: string;
      map: string;
      ext: string;
    },
  ): Promise<Nanoid | null> {
    return this.mapService.saveMap(langId, mapInfo);
  }

  async getMap(mapId: Nanoid): Promise<MapDto | null> {
    return this.mapService.getMap(mapId);
  }

  async getMaps(langId?: Nanoid) {
    return this.mapService.getMaps(langId);
  }
}
