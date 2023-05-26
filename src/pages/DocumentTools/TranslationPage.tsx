import { useState, useEffect, useMemo, type MouseEvent } from 'react';
import { useParams } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import {
  FiPlus,
  Button,
  Typography,
  MuiMaterial,
  CrowdBibleUI,
  useColorModeContext,
} from '@eten-lab/ui-kit';

import { TranslationList } from '@/components/TranslationList';
import { Link } from '@/components/Link';

import { useWordSequence } from '@/hooks/useWordSequence';
import { useAppContext } from '@/hooks/useAppContext';
import { useTranslation } from '@/hooks/useTranslation';

import { WordSequenceDto, SubWordSequenceDto } from '@/dtos/word-sequence.dto';

import { RouteConst } from '@/constants/route.constant';

import { compareLangInfo } from '@/utils/langUtils';

const { DotsText } = CrowdBibleUI;
const { Stack, Backdrop } = MuiMaterial;

export function TranslationPage() {
  const { documentId } = useParams<{ documentId: Nanoid }>();
  const { getColor } = useColorModeContext();
  const {
    getWordSequenceByDocumentId,
    getWordSequenceById,
    listSubWordSequenceByWordSequenceId,
  } = useWordSequence();

  const { getRecommendedWordSequenceTranslation } = useTranslation();

  const {
    states: {
      global: { singletons },
      documentTools: { sourceLanguage },
    },
  } = useAppContext();

  const [selectedSubWordSequenceId, setSelectedSubWordSequenceId] =
    useState<Nanoid | null>(null);
  const [originalWordSequence, setOriginalWordSequence] =
    useState<WordSequenceDto | null>(null);
  const [subWordSequences, setSubWordSequences] = useState<
    SubWordSequenceDto[]
  >([]);

  useEffect(() => {
    (async () => {
      if (singletons && documentId && sourceLanguage) {
        const original = await getWordSequenceByDocumentId(documentId);

        if (!original) {
          return;
        }

        const wordSequence = compareLangInfo(
          original.languageInfo,
          sourceLanguage,
        )
          ? original
          : await getRecommendedWordSequenceTranslation(
              original.id,
              original.languageInfo,
              sourceLanguage,
            );

        if (!wordSequence) {
          return;
        }

        const subWordSequences = await listSubWordSequenceByWordSequenceId(
          wordSequence.id,
        );

        setOriginalWordSequence(wordSequence);
        setSubWordSequences(subWordSequences);
      }
    })();
  }, [
    documentId,
    singletons,
    sourceLanguage,
    getWordSequenceById,
    getWordSequenceByDocumentId,
    listSubWordSequenceByWordSequenceId,
    getRecommendedWordSequenceTranslation,
  ]);

  const handleDotClick = (id: unknown) => {
    setSelectedSubWordSequenceId(id as Nanoid);
  };

  const handleClose = () => {
    setSelectedSubWordSequenceId(null);
  };

  const handleCancelBubbling = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const origin = useMemo(() => {
    if (!originalWordSequence) {
      return {
        text: '',
        ranges: [],
      };
    }

    return {
      text: originalWordSequence.text,
      ranges: subWordSequences.map(({ id, position, length }) => ({
        id,
        start: position,
        end: position + length - 1,
      })),
    };
  }, [originalWordSequence, subWordSequences]);

  const backdropOpened = selectedSubWordSequenceId ? true : false;
  const goToEditorLink = selectedSubWordSequenceId
    ? `${RouteConst.TRANSLATION_EDIT}/${documentId}/${selectedSubWordSequenceId}`
    : `${RouteConst.TRANSLATION_EDIT}/${documentId}`;

  return (
    <IonContent>
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
        <DotsText
          text={origin.text}
          ranges={origin.ranges}
          onSelect={handleDotClick}
          dotColor="blue-primary"
          selectedColor="light-blue"
        />
        <Link to={goToEditorLink}>
          <Button
            variant="contained"
            startIcon={<FiPlus />}
            fullWidth
            sx={{ margin: '10px 0' }}
          >
            Add My Translation
          </Button>
        </Link>

        {/* <Link to="/translation-candidates"> */}
        <Link to="">
          <Button
            variant="text"
            fullWidth
            sx={{ margin: '10px 0' }}
            endIcon
            disabled={true}
          >
            Go To Translation List
          </Button>
        </Link>
      </Stack>
      <Backdrop
        open={backdropOpened}
        onClick={handleClose}
        sx={{
          alignItems: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        }}
      >
        <Stack
          sx={{
            borderRadius: '20px 20px 0 0',
            borderTop: `1px solid ${getColor('middle-gray')}`,
            boxShadow: '0px 0px 20px rgba(4, 16, 31, 0.1)',
            height: '400px',
            width: '100%',
            padding: '0 20px 20px',
            background: getColor('white'),
          }}
          onClick={handleCancelBubbling}
        >
          <TranslationList
            documentId={documentId}
            wordSequenceId={selectedSubWordSequenceId}
            isCheckbox={false}
          />
        </Stack>
      </Backdrop>
    </IonContent>
  );
}
