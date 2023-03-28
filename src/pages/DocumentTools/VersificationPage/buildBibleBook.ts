import { Bible } from './types';

export function buildBibleBook(bible: Bible, bookId: string) {
  const bibleName =
    bible.propertyKeys.find(({ property_key }) => property_key === 'name')
      ?.values[0]?.property_value.value || 'Bible';
  const { toNode: book } = bible.nestedRelationships.find(
    ({ toNode: { node_id } }) => node_id.toString() === bookId,
  )!;
  const bookName =
    book.propertyKeys.find(({ property_key }) => property_key === 'name')
      ?.values[0]?.property_value.value || 'Book';
  const chapters = book.nestedRelationships.map(
    ({ toNode: { node_id, propertyKeys, nestedRelationships } }) => {
      const { node_property_key_id, values } = propertyKeys.find(
        ({ property_key }) => property_key === 'chapter-identifier',
      )!;

      return {
        id: node_id,
        identifier: {
          id: node_property_key_id,
          values: values.map(
            ({ upVotes, downVotes, posts, property_value: { value } }) => ({
              value,
              numUpVotes: upVotes,
              numDownVotes: downVotes,
              numPosts: posts.length,
            }),
          ),
        },
        verses: nestedRelationships.map(
          ({ toNode: { node_id, propertyKeys, nestedRelationships } }) => {
            const { node_property_key_id, values } = propertyKeys.find(
              ({ property_key }) => property_key === 'verse-identifier',
            )!;
            const text = nestedRelationships
              .map(({ toNode: wordSequence }) =>
                wordSequence.nestedRelationships
                  .map(
                    ({ toNode: word }) =>
                      word.propertyKeys.find(
                        ({ property_key }) => property_key === 'word_name',
                      )!.values[0].property_value.value,
                  )
                  .join(' '),
              )
              .join(' ');

            return {
              id: node_id,
              identifier: {
                id: node_property_key_id,
                values: values.map(
                  ({
                    upVotes,
                    downVotes,
                    posts,
                    property_value: { value },
                  }) => ({
                    value,
                    numUpVotes: upVotes,
                    numDownVotes: downVotes,
                    numPosts: posts.length,
                  }),
                ),
              },
              text,
            };
          },
        ),
      };
    },
  );

  return {
    bibleId: bible.node_id,
    bibleName,
    bookId: book.node_id,
    bookName,
    chapters,
  };
}
