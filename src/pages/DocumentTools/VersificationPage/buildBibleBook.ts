import { Node } from '@/models/node/node.entity';

export function buildBibleBook(bible: Node, bookId: string) {
  const bibleNamePropertyValue = bible.propertyKeys.find(
    ({ property_key }) => property_key === 'name',
  )?.propertyValues[0]?.property_value;
  const bibleName = bibleNamePropertyValue
    ? JSON.parse(bibleNamePropertyValue).value
    : '';
  const { toNode: book } = (bible.toNodeRelationships || []).find(
    ({ toNode: { id } }) => id === bookId,
  )!;
  const bookNamePropertyValue = book.propertyKeys.find(
    ({ property_key }) => property_key === 'name',
  )?.propertyValues[0]?.property_value;
  const bookName = bookNamePropertyValue
    ? JSON.parse(bookNamePropertyValue).value
    : '';
  const chapters = (book.toNodeRelationships || []).map(
    ({ toNode: { id, propertyKeys, toNodeRelationships = [] } }) => {
      const { id: pkId, propertyValues } = propertyKeys.find(
        ({ property_key }) => property_key === 'chapter-identifier',
      )!;

      return {
        id: id,
        identifier: {
          id: pkId,
          values: propertyValues.map(({ property_value, discussion }) => ({
            value: property_value
              ? (JSON.parse(property_value).value as string)
              : '',
            numUpVotes: 0,
            numDownVotes: 0,
            numPosts: discussion?.posts ? discussion.posts.length : 0,
          })),
        },
        verses: toNodeRelationships.map(
          ({ toNode: { id, propertyKeys, toNodeRelationships = [] } }) => {
            const { id: pkId, propertyValues } = propertyKeys.find(
              ({ property_key }) => property_key === 'verse-identifier',
            )!;
            const text = toNodeRelationships
              .map(({ toNode: wordSequence }) =>
                (wordSequence.toNodeRelationships || [])
                  .map(({ toNode: word }) => {
                    const propertyValue = word.propertyKeys.find(
                      ({ property_key }) => property_key === 'word_name',
                    )!.propertyValues[0].property_value;

                    return propertyValue
                      ? (JSON.parse(propertyValue).value as string)
                      : '';
                  })
                  .join(' '),
              )
              .join(' ');

            return {
              id: id,
              identifier: {
                id: pkId,
                values: propertyValues.map(
                  ({ property_value, discussion }) => ({
                    value: property_value
                      ? (JSON.parse(property_value).value as string)
                      : '',
                    numUpVotes: 0,
                    numDownVotes: 0,
                    numPosts: discussion?.posts ? discussion.posts.length : 0,
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
    bibleId: bible.id,
    bibleName,
    bookId: book.id,
    bookName,
    chapters,
  };
}
