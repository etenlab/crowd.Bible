import { useState, type MouseEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import {
  CrowdBibleUI,
  Button,
  Typography,
  MuiMaterial,
  FiPlus,
  colors,
} from '@eten-lab/ui-kit';

import { TranslationList } from '../components/TranslationList';

import { mockTranslations } from './TranslationCandidatesPage';

const { DotsText } = CrowdBibleUI;
const { Stack, Backdrop } = MuiMaterial;

export const mockDocument =
  '1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 2. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 3. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 4. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 5. From its medieval origins to the digital era, learn everything there is to know about the ubiquitous lorem ipsum passage. 6. Ut enim ad minim veniam, quis nostrud exercitation. 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 2. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 3. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 4. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 5. From its medieval origins to the digital era, learn everything there is to know about the ubiquitous lorem ipsum passage. 6. Ut enim ad minim veniam, quis nostrud exercitation.';

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

export function TranslationPage() {
  const history = useHistory();
  const [opened, setOpened] = useState<boolean>(false);

  const handleDotClick = (id: number) => {
    setOpened(true);
  };

  const handleClose = () => {
    setOpened(false);
  };

  const handleCancelBubbling = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const handleGoToEditPage = () => {
    history.push('/translation-edit');
  };

  const handleGoToTranslationCandidatesPage = () => {
    history.push('/translation-candidates');
  };

  return (
    <IonContent>
      <Stack sx={{ padding: '20px', flexGrow: 1, overflowY: 'auto' }}>
        <Typography
          variant="overline"
          sx={{
            paddingBottom: '16px',
            color: colors.dark,
            opacity: 0.5,
          }}
        >
          Original
        </Typography>
        <DotsText
          text={mockDocument}
          ranges={mockRanges}
          onSelect={handleDotClick}
          dotColor="blue-primary"
          selectedColor="light-blue"
        />
        <Button
          variant="contained"
          startIcon={<FiPlus />}
          fullWidth
          onClick={handleGoToEditPage}
          sx={{ margin: '10px 0' }}
        >
          Add My Translation
        </Button>
        <Button
          variant="text"
          fullWidth
          onClick={handleGoToTranslationCandidatesPage}
          sx={{ margin: '10px 0' }}
          endIcon
        >
          Go To Translation List
        </Button>
      </Stack>
      <Backdrop
        open={opened}
        onClick={handleClose}
        sx={{
          alignItems: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        }}
      >
        <Stack
          sx={{
            borderRadius: '20px 20px 0 0',
            borderTop: `1px solid ${colors['middle-gray']}`,
            boxShadow: '0px 0px 20px rgba(4, 16, 31, 0.1)',
            height: '400px',
            padding: '0 20px 20px',
            background: colors.white,
          }}
          onClick={handleCancelBubbling}
        >
          <TranslationList translations={mockTranslations} isCheckbox={false} />
        </Stack>
      </Backdrop>
    </IonContent>
  );
}
