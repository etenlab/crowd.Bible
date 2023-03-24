import { useHistory } from 'react-router-dom';
import { Fragment } from 'react';

import { MuiMaterial, useColorModeContext } from '@eten-lab/ui-kit';

import { Layout } from './Layout';
import { useVersificationContext } from '.';

const { Box, Stack, Divider } = MuiMaterial;

export function BookListPage() {
  const history = useHistory();
  const { bibles } = useVersificationContext();
  const { getColor } = useColorModeContext();

  return (
    <Layout>
      <Box my="5px">
        <Box
          sx={{
            color: getColor('gray'),
            textTransform: 'uppercase',
            opacity: 0.5,
            fontWeight: 500,
            letterSpacing: '0.05em',
          }}
        >
          Bible Books
        </Box>
        <Stack
          sx={{ fontSize: 16 }}
          divider={
            <Divider
              orientation="horizontal"
              flexItem
              style={{ borderColor: getColor('light-blue') }}
            />
          }
        >
          {bibles.map(
            ({ node_id: bibleId, propertyKeys, nestedRelationships }) => {
              const bibleName =
                propertyKeys.find(({ property_key }) => property_key === 'name')
                  ?.values[0]?.property_value.value || 'Bible';

              return (
                <Fragment key={bibleId}>
                  {nestedRelationships.map(
                    ({ toNode: { node_id: bookId, propertyKeys } }) => {
                      const bookName =
                        propertyKeys.find(
                          ({ property_key }) => property_key === 'name',
                        )?.values[0]?.property_value.value || 'Book';

                      return (
                        <div
                          key={bookId}
                          style={{
                            cursor: 'pointer',
                            padding: '14px 0',
                          }}
                          onClick={() =>
                            history.push(
                              `/versification/bible/${bibleId}/book/${bookId}`,
                            )
                          }
                        >
                          #{bookId} {bibleName}: {bookName}
                        </div>
                      );
                    },
                  )}
                </Fragment>
              );
            },
          )}
        </Stack>
      </Box>
    </Layout>
  );
}
