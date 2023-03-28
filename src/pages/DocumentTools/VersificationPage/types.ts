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
type Book = Node<'book'> & NestedRelationships<Chapter>;
type Chapter = Node<'chapter'> & NestedRelationships<Verse>;
type Verse = Node<'verse'> & NestedRelationships<WordSequence>;
type WordSequence = Node<'word-sequence'> & NestedRelationships<Word>;
type Word = Node<'word'>;
