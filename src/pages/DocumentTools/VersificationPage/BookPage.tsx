import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { VersificationUI, MuiMaterial } from '@eten-lab/ui-kit';

import { Bible } from './types';
import { Layout } from './Layout';
import { buildBibleBook } from './buildBibleBook';
import { useVersificationContext } from '.';

const { Table, NodeFilter } = VersificationUI;
const { Box } = MuiMaterial;

export function BookPage() {
  const { bibleId, bookId } = useParams<{ bibleId: string; bookId: string }>();
  const { bibles } = useVersificationContext();
  const bible = bibles.find(({ node_id }) => node_id.toString() === bibleId)!;

  return !bible ? null : <Content bible={bible} bookId={bookId} />;
}

function Content({ bible, bookId }: { bible: Bible; bookId: string }) {
  const { onIdentifierAdd } = useVersificationContext();
  const [filteredChapterId, setFilteredChapterId] = useState<null | string>(
    null,
  );
  const [filteredVerseId, setFilteredVerseId] = useState<null | string>(null);
  const bibleBook = buildBibleBook(bible, bookId);
  const filteredChapter = filteredChapterId
    ? bibleBook.chapters.find(({ id }) => id.toString() === filteredChapterId)
    : null;
  const filteredChapters = !filteredChapter
    ? bibleBook.chapters
    : [filteredChapter].map(({ id, identifier, verses }) => ({
        id,
        identifier,
        verses: !filteredVerseId
          ? verses
          : verses.filter(({ id }) => id.toString() === filteredVerseId),
      }));

  return (
    <Layout
      backRoute="/versification"
      breadcrumb={`#${bibleBook.bookId} ${bibleBook.bibleName}: ${bibleBook.bookName}`}
      headerContent={
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} mt={2}>
          <NodeFilter
            nodeType="chapter"
            value={filteredChapterId || ''}
            onChange={(value) => {
              setFilteredVerseId(null);
              setFilteredChapterId(value || null);
            }}
            options={bibleBook.chapters.map(
              ({ id, identifier: { values } }) => ({
                value: id.toString(),
                text: values[0].value,
              }),
            )}
          />
          <NodeFilter
            nodeType="verse"
            disabled={!filteredChapterId}
            value={filteredVerseId || ''}
            onChange={(value) => setFilteredVerseId(value || null)}
            options={
              filteredChapter
                ? filteredChapter.verses.map(
                    ({ id, identifier: { values } }) => ({
                      value: id.toString(),
                      text: values[0].value,
                    }),
                  )
                : []
            }
          />
        </Box>
      }
    >
      <Table
        bibleBook={{
          ...bibleBook,
          chapters: filteredChapters,
        }}
        onNewIdentifierSave={onIdentifierAdd}
      />
    </Layout>
  );
}
