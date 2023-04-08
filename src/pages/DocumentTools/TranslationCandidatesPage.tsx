import { useHistory } from 'react-router';
import { IonContent } from '@ionic/react';

import { Button, MuiMaterial, BiLeftArrowAlt } from '@eten-lab/ui-kit';

// import { TranslationList } from '@/components/TranslationList';

const { Stack } = MuiMaterial;

// export const mockTranslations = [
//   {
//     id: 1,
//     text: '1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
//     voted: 42,
//     unvoted: 15,
//   },
//   {
//     id: 2,
//     text: '2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
//     voted: 42,
//     unvoted: 15,
//   },
//   {
//     id: 3,
//     text: '1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
//     voted: 42,
//     unvoted: 15,
//   },
//   {
//     id: 4,
//     text: '1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
//     voted: 42,
//     unvoted: 15,
//   },
//   {
//     id: 5,
//     text: '1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
//     voted: 42,
//     unvoted: 15,
//   },
// ] as TranslationType[];

export function TranslationCandidatesPage() {
  const history = useHistory();

  const GoToTranslationPage = () => {
    history.push('/translation');
  };

  return (
    <IonContent>
      <Stack sx={{ padding: '20px' }}>
        <Button
          variant="text"
          color="dark"
          onClick={GoToTranslationPage}
          sx={{ width: '123px' }}
        >
          <BiLeftArrowAlt style={{ fontSize: '24px' }} />
          Translation
        </Button>
        {/* <TranslationList translations={mockTranslations} /> */}
      </Stack>
    </IonContent>
  );
}
