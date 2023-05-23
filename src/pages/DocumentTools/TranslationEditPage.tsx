import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { IonContent } from '@ionic/react';

import { CrowdBibleUI, Typography, MuiMaterial } from '@eten-lab/ui-kit';

import { useWordSequence } from '@/hooks/useWordSequence';
import { useAppContext } from '@/hooks/useAppContext';

import { TranslationEditor } from '@/components/TranslationEditor';
import { WordSequenceDto } from '@/dtos/word-sequence.dto';

const { RangeSelectableTextArea } = CrowdBibleUI;
const { Stack } = MuiMaterial;

export function TranslationEditPage() {
  const { documentId, wordSequenceId } = useParams<{
    documentId: Nanoid;
    wordSequenceId?: Nanoid;
  }>();
  const { getWordSequenceById, getWordSequenceByDocumentId } =
    useWordSequence();
  const {
    states: {
      global: { singletons },
    },
  } = useAppContext();

  const [range, setRange] = useState<{
    start: number | null;
    end: number | null;
  }>({ start: null, end: null });
  const [originalWordSequence, setOriginalWordSequence] =
    useState<WordSequenceDto | null>(null);

  useEffect(() => {
    (async () => {
      if (!singletons || !documentId) {
        return;
      }

      if (!wordSequenceId) {
        const wordSequence = await getWordSequenceByDocumentId(documentId);

        if (!wordSequence) {
          return;
        }

        setOriginalWordSequence(wordSequence);
      } else {
        getWordSequenceById(wordSequenceId).then(setOriginalWordSequence);
      }
    })();
  }, [
    singletons,
    documentId,
    wordSequenceId,
    getWordSequenceById,
    getWordSequenceByDocumentId,
  ]);

  const handleChangeRange = ({
    start,
    end,
  }: {
    start: number | null;
    end: number | null;
  }) => {
    setRange({ start, end });
  };

  const translationEdit = wordSequenceId ? (
    <TranslationEditor
      subWordSequence={wordSequenceId}
      documentId={documentId}
    />
  ) : range.start !== null && range.end !== null && originalWordSequence ? (
    <TranslationEditor
      subWordSequence={{
        origin: originalWordSequence,
        range: {
          start: range.start,
          end: range.end,
        },
      }}
      documentId={documentId}
    />
  ) : null;

  const documentOriginalText = originalWordSequence
    ? originalWordSequence.text || ''
    : '';

  const originalTextComponent = wordSequenceId ? (
    <RangeSelectableTextArea
      text={documentOriginalText}
      range={{ start: null, end: null }}
      onChangeRange={() => {}}
    />
  ) : (
    <RangeSelectableTextArea
      text={documentOriginalText}
      range={range}
      onChangeRange={handleChangeRange}
    />
  );

  return (
    <IonContent>
      <Stack
        justifyContent="space-between"
        sx={{ height: 'calc(100vh - 68px)' }}
      >
        <Stack sx={{ padding: '20px', flexGrow: 1, overflowY: 'auto' }}>
          <Typography
            variant="overline"
            color="text.dark"
            sx={{
              paddingBottom: '16px',
              opacity: 0.5,
            }}
          >
            Original
          </Typography>
          {originalTextComponent}
        </Stack>
        <Stack sx={{ flexGrow: 1 }}>{translationEdit}</Stack>
      </Stack>
    </IonContent>
  );
}
