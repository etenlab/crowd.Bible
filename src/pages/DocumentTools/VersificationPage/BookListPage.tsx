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
          {bibles.map(({ id: bibleId, propertyKeys, toNodeRelationships }) => {
            const propertyValue = propertyKeys.find(
              ({ property_key }) => property_key === 'name',
            )?.propertyValues[0]?.property_value;
            const bibleName = propertyValue
              ? JSON.parse(propertyValue).value
              : '';

            return (
              <Fragment key={bibleId}>
                {(toNodeRelationships || []).map(
                  ({ toNode: { id: bookId, propertyKeys } }, index) => {
                    const propertyValue = propertyKeys.find(
                      ({ property_key }) => property_key === 'name',
                    )?.propertyValues[0]?.property_value;
                    const bookName = propertyValue
                      ? JSON.parse(propertyValue).value
                      : '';

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
                        #{index + 1} {bibleName}: {bookName}
                      </div>
                    );
                  },
                )}
              </Fragment>
            );
          })}
        </Stack>
      </Box>
    </Layout>
  );
}
