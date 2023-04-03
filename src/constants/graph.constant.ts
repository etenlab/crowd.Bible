export class NodeTypeConst {
  static readonly TABLE = 'table';
  static readonly TABLE_COLUMN = 'table-column';
  static readonly TABLE_ROW = 'table-row';
  static readonly TABLE_CELL = 'table-cell';

  static readonly ELECTION = 'election';
  static readonly BALLOT_ENTRY = 'ballot-entry';

  static readonly LEXICON = 'lexicon';
  static readonly LEXICAL_CATEGORY = 'lexical_category';
  static readonly GRAMATICAL_CATEGORY = 'grammatical_category';
  static readonly GRAMMEME = 'grammeme';
  static readonly LEXEME = 'lexeme';
  static readonly WORD_FORM = 'word_form';

  static readonly DOCUMENT = 'document';

  static readonly MAP = 'map';
  static readonly WORD = 'word';
  static readonly WORD_SEQUENCE = 'word-sequence';

  static readonly LANGUAGE = 'language';
  static readonly MAP_LANG = 'map-language';

  static readonly DEFINITION = 'definition';
  static readonly PHRASE = 'phrase';
}

export class RelationshipTypeConst {
  static readonly TABLE_TO_COLUMN = 'table-to-column';
  static readonly TABLE_TO_ROW = 'table-to-row';
  static readonly TABLE_COLUMN_TO_CELL = 'table-column-to-cell';
  static readonly TABLE_ROW_TO_CELL = 'table-row-to-cell';

  static readonly ELECTION_TO_BALLOT_ENTRY = 'election-to-ballot-entry';

  static readonly WORD_TO_LANG = 'word-to-language-entry';
  static readonly WORD_MAP = 'word-map';
  static readonly WORD_TO_TRANSLATION = 'word-to-translation';
  static readonly WORD_SEQUENCE_TO_WORD = 'word-sequence-to-word';
  static readonly WORD_SEQUENCE_TO_LANGUAGE_ENTRY =
    'word-sequence-to-language-entry';
  static readonly WORD_SEQUENCE_TO_DOCUMENT = 'word-sequence-to-document';
  static readonly WORD_SEQUENCE_TO_CREATOR = 'word-sequence-to-creator';
  static readonly WORD_SEQUENCE_TO_WORD_SEQUENCE =
    'word-sequence-to-word-sequence';
  static readonly WORD_SEQUENCE_TO_TRANSLATION = 'word-sequence-to-translation';

  static readonly WORD_TO_DEFINITION = 'word-to-definition';
  static readonly PHRASE_TO_DEFINITION = 'phrase-to-definition';
  static readonly PHRASE_TO_LANG = 'phrase-to-language-entry';
}

export class PropertyKeyConst {
  static readonly NAME = 'name';

  static readonly TABLE_NAME = 'table_name';
  static readonly ROW_ID = 'row_id';
  static readonly ELECTION_ID = 'election_id';

  static readonly IMPORT_UID = 'import-uid';
  static readonly TEXT = 'text';
}
