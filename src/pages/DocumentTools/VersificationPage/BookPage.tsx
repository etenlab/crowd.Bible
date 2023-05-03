import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { VersificationUI, MuiMaterial } from '@eten-lab/ui-kit';
import { Node } from '@eten-lab/models';

import { Layout } from './Layout';
import { buildBibleBook } from './buildBibleBook';
import { VersificationKeys, useVersificationContext } from '.';

const { Table, NodeFilter } = VersificationUI;
const { Box } = MuiMaterial;

export function BookPage() {
  const { bibleId, bookId } = useParams<{ bibleId: string; bookId: string }>();
  const { bibles, versificationKeys } = useVersificationContext();
  const bible = bibles.find(({ id }) => id === bibleId)!;

  return !bible ? null : (
    <Content
      bible={bible}
      versificationKeys={versificationKeys}
      bookId={bookId}
    />
  );
}

function Content({
  bible,
  versificationKeys,
  bookId,
}: {
  bible: Node;
  versificationKeys: VersificationKeys;
  bookId: string;
}) {
  const { onIdentifierAdd } = useVersificationContext();
  const [filteredChapterId, setFilteredChapterId] = useState<null | string>(
    null,
  );
  const [filteredVerseId, setFilteredVerseId] = useState<null | string>(null);
  const bibleBook = buildBibleBook(bible, versificationKeys, bookId);
  const filteredChapter = filteredChapterId
    ? bibleBook.chapters.find(({ id }) => (id || '') === filteredChapterId)
    : null;
  const filteredChapters = !filteredChapter
    ? bibleBook.chapters
    : [filteredChapter].map(({ id, identifier, verses }) => ({
        id,
        identifier,
        verses: !filteredVerseId
          ? verses
          : verses.filter(({ id }) => (id || '') === filteredVerseId),
      }));

  return (
    <Layout
      backRoute="/versification"
      breadcrumb={`${bibleBook.bibleName}: ${bibleBook.bookName}`}
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
                text: values[0]?.value || '',
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
                      text: values[0]?.value || '',
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
