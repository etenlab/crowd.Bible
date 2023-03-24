import { NodeService } from './node.service';
import { InferType, object, Schema, string } from 'yup';
import { NodeRepository } from '@/repositories/node/node.repository';
import { CRUDService } from './crud-service';

export enum LexiconNodeType {
  Lexicon = 'lexicon',
  LexicalCategory = 'lexical_category',
  GramaticalCategory = 'grammatical_category',
  Grammeme = 'grammeme',
  Lexeme = 'lexeme',
  WordForm = 'word_form',
}

const lexiconSchema = object({
  id: string().uuid().required(),
  name: string().min(1).required(),
});
export type Lexicon = InferType<typeof lexiconSchema>;

const lexicalCategorySchema = object({});
export type LexicalCategory = InferType<typeof lexicalCategorySchema>;

const grammaticalCategorySchema = object({});
export type GrammaticalCategory = InferType<typeof grammaticalCategorySchema>;

const grammemeSchema = object({});
export type Grammeme = InferType<typeof grammemeSchema>;

const lexemeSchema = object({});
export type Lexeme = InferType<typeof lexemeSchema>;

const wordFormSchema = object({});
export type WordForm = InferType<typeof wordFormSchema>;

export default class LexiconService {
  public readonly lexica: CRUDService<Lexicon>;
  public readonly lexicalCategories: CRUDService<LexicalCategory>;
  public readonly grammaticalCategories: CRUDService<GrammaticalCategory>;
  public readonly grammemes: CRUDService<Grammeme>;
  public readonly lexemes: CRUDService<Lexeme>;
  public readonly wordForms: CRUDService<WordForm>;

  constructor(nodeService: NodeService, nodeRepo: NodeRepository) {
    const service = <T>(model: LexiconNodeType, schema: Schema<T>) =>
      new CRUDService(model, schema, nodeService, nodeRepo);
    this.lexica = service(LexiconNodeType.Lexicon, lexiconSchema);
    this.lexicalCategories = service(
      LexiconNodeType.LexicalCategory,
      lexicalCategorySchema,
    );
    this.grammaticalCategories = service(
      LexiconNodeType.GramaticalCategory,
      grammaticalCategorySchema,
    );
    this.grammemes = service(LexiconNodeType.Grammeme, grammemeSchema);
    this.lexemes = service(LexiconNodeType.Lexeme, lexemeSchema);
    this.wordForms = service(LexiconNodeType.WordForm, wordFormSchema);
  }
}
