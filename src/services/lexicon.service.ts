import { NodeService } from './node.service';
import { InferType, object, Schema, string } from 'yup';
import { NodeRepository } from '@/repositories/node/node.repository';
import { baseSchema, BaseType, CRUDService } from './crud-service';

export enum LexiconNodeType {
  Lexicon = 'lexicon',
  LexicalCategory = 'lexical_category',
  GramaticalCategory = 'grammatical_category',
  Grammeme = 'grammeme',
  Lexeme = 'lexeme',
  WordForm = 'word_form',
}

const lexiconSchema = baseSchema.concat(
  object({
    name: string().min(1).required(),
  }),
);
export type Lexicon = InferType<typeof lexiconSchema>;

const lexicalCategorySchema = baseSchema.concat(
  object({
    name: string().min(1).required(),
  }),
);
export type LexicalCategory = InferType<typeof lexicalCategorySchema>;

const grammaticalCategorySchema = baseSchema.concat(
  object({
    name: string().min(1).required(),
  }),
);
export type GrammaticalCategory = InferType<typeof grammaticalCategorySchema>;

const grammemeSchema = baseSchema.concat(
  object({
    name: string().min(1).required(),
  }),
);
export type Grammeme = InferType<typeof grammemeSchema>;

const lexemeSchema = baseSchema.concat(
  object({
    lemma: string().min(1).required(),
  }),
);
export type Lexeme = InferType<typeof lexemeSchema>;

const wordFormSchema = baseSchema.concat(
  object({
    text: string().min(1).required(),
  }),
);
export type WordForm = InferType<typeof wordFormSchema>;

export default class LexiconService {
  public readonly lexica: CRUDService<Lexicon>;
  public readonly lexicalCategories: CRUDService<LexicalCategory>;
  public readonly grammaticalCategories: CRUDService<GrammaticalCategory>;
  public readonly grammemes: CRUDService<Grammeme>;
  public readonly lexemes: CRUDService<Lexeme>;
  public readonly wordForms: CRUDService<WordForm>;

  constructor(nodeService: NodeService, nodeRepo: NodeRepository) {
    const service = <T extends BaseType>(
      model: LexiconNodeType,
      schema: Schema<T>,
    ) => new CRUDService(model, schema, nodeService, nodeRepo);
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
