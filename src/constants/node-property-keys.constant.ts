export class LanguageNodesKeysConst {
  static readonly NAME = 'name';
}

export class TranslationNodesKeysConst {
  static readonly LEMMA = 'lemma';
  static readonly XLIT = 'xlit';
  static readonly PRON = 'pron';
  static readonly DERIVATION = 'derivation';
  static readonly STRONGS_DEF = 'strongs_def';
  static readonly KJV_DEF = 'kjv_def';
  static readonly STRONGS_ID = 'strongs_id';
}

export class DefinitionNodesKeysConst {
  static readonly TEXT = 'text';
}

export type TNodesKeysConst =
  | LanguageNodesKeysConst
  | TranslationNodesKeysConst
  | DefinitionNodesKeysConst;
