import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { VersificationUI, MuiMaterial } from '@eten-lab/ui-kit';

import { Node } from '@/models/node/node.entity';

import { Layout } from './Layout';
import { buildBibleBook } from './buildBibleBook';
import { NodePropertyValueDatas, useVersificationContext } from '.';

const { Table, NodeFilter } = VersificationUI;
const { Box } = MuiMaterial;

export function BookPage() {
  const { bibleId, bookId } = useParams<{ bibleId: string; bookId: string }>();
  const { bibles, nodePropertyValueDatas } = useVersificationContext();
  const bible = bibles.find(({ id }) => id === bibleId)!;

  return !bible ? null : (
    <Content
      bible={bible}
      nodePropertyValueDatas={nodePropertyValueDatas}
      bookId={bookId}
    />
  );
}

function Content({
  bible,
  nodePropertyValueDatas,
  bookId,
}: {
  bible: Node;
  nodePropertyValueDatas: NodePropertyValueDatas;
  bookId: string;
}) {
  const { onIdentifierAdd } = useVersificationContext();
  const [filteredChapterId, setFilteredChapterId] = useState<null | string>(
    null,
  );
  const [filteredVerseId, setFilteredVerseId] = useState<null | string>(null);
  const bibleBook = buildBibleBook(bible, nodePropertyValueDatas, bookId);
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
