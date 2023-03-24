type Node<T> = {
  node_id: number;
  node_type: T;
  propertyKeys: {
    node_property_key_id: number;
    property_key: string;
    values: {
      property_value: {
        value: string;
      };
      upVotes: number;
      downVotes: number;
      posts: {
        id: number;
      }[];
    }[];
  }[];
};
type NestedRelationships<T> = {
  nestedRelationships: {
    toNode: T;
  }[];
};

export type Bible = Node<'bible'> & NestedRelationships<Book>;
export type Book = Node<'book'> & NestedRelationships<Chapter>;
export type Chapter = Node<'chapter'> & NestedRelationships<Verse>;
export type Verse = Node<'verse'> & NestedRelationships<WordSequence>;
type WordSequence = Node<'word-sequence'> & NestedRelationships<Word>;
type Word = Node<'word'>;

type VersificationChapterConfig = {
  type: 'CHAPTER';
  value: string;
  values: string[];
  bibleId: number;
  bookId: number;
  chapterId: number;
  node_property_key_id: number;
};
type VersificationVerseConfig = {
  type: 'VERSE';
  value: string;
  values: string[];
  bibleId: number;
  bookId: number;
  chapterId: number;
  verseId: number;
  node_property_key_id: number;
};
export type VersificationConfig =
  | VersificationChapterConfig
  | VersificationVerseConfig;
