import { useState, useEffect, useMemo, type MouseEvent } from 'react';
import { useParams } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import {
  CrowdBibleUI,
  Button,
  Typography,
  MuiMaterial,
  FiPlus,
  useColorModeContext,
} from '@eten-lab/ui-kit';

import { TranslationList } from '@/components/TranslationList';
import { Link } from '@/components/Link';

import { useWordSequence } from '@/hooks/useWordSequence';
import { useAppContext } from '@/hooks/useAppContext';

import { WordSequenceDto, SubWordSequenceDto } from '@/dtos/word-sequence.dto';

const { DotsText } = CrowdBibleUI;
const { Stack, Backdrop } = MuiMaterial;

export const mockRanges = [
  {
    id: 0,
    start: 1,
    end: 10,
  },
  {
    id: 1,
    start: 15,
    end: 35,
  },
  {
    id: 2,
    start: 40,
    end: 60,
  },
  {
    id: 3,
    start: 65,
    end: 75,
  },
  {
    id: 4,
    start: 80,
    end: 90,
  },
];

export const mockDocument =
  '1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 2. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 3. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 4. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 5. From its medieval origins to the digital era, learn everything there is to know about the ubiquitous lorem ipsum passage. 6. Ut enim ad minim veniam, quis nostrud exercitation. 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 2. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 3. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 4. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 5. From its medieval origins to the digital era, learn everything there is to know about the ubiquitous lorem ipsum passage. 6. Ut enim ad minim veniam, quis nostrud exercitation.';

export function TranslationPage() {
  const { documentId } = useParams<{ documentId: Nanoid }>();
  const { getColor } = useColorModeContext();
  const {
    getWordSequenceByDocumentId,
    getWordSequenceById,
    listSubWordSequenceByWordSequenceId,
  } = useWordSequence();
  const {
    states: {
      global: { singletons },
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
      if (singletons && documentId) {
        const wordSequenceId = await getWordSequenceByDocumentId(documentId);

        if (!wordSequenceId) {
          return;
        }

        const wordSequence = await getWordSequenceById(wordSequenceId);
        const subWordSequences = await listSubWordSequenceByWordSequenceId(
          wordSequenceId,
        );

        setOriginalWordSequence(wordSequence);
        setSubWordSequences(subWordSequences);
      }
    })();
  }, [
    documentId,
    singletons,
    getWordSequenceById,
    getWordSequenceByDocumentId,
    listSubWordSequenceByWordSequenceId,
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
    ? `/translation-edit/${documentId}/${selectedSubWordSequenceId}`
    : `/translation-edit/${documentId}`;

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
            disabled={true}
          >
            Add My Translation
          </Button>
        </Link>

        <Link to="/translation-candidates">
          <Button variant="text" fullWidth sx={{ margin: '10px 0' }} endIcon>
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
