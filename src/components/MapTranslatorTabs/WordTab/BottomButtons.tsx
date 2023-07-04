import { Button, TbArrowBack, MuiMaterial } from '@eten-lab/ui-kit';
import { Steps } from './WordTabContent';
import { useTr } from '@/hooks/useTr';
const { Box, Stack, styled } = MuiMaterial;
const PADDING = 15;
export type BottomButtonsProps = {
  setStep: React.Dispatch<React.SetStateAction<Steps>>;
  storeTranslations?: () => void;
};

export function BottomButtons({
  setStep,
  storeTranslations,
}: BottomButtonsProps) {
  const { tr } = useTr();
  return (
    <StickyStack direction={'row'} spacing={`${PADDING}px`}>
      <Box flexGrow={1}>
        <Button
          variant={'contained'}
          fullWidth
          onClick={() => setStep(Steps.GET_LANGUAGES)}
        >
          <TbArrowBack />
          {tr('Back')}
        </Button>
      </Box>
      {storeTranslations ? (
        <Box flexGrow={1}>
          <Button variant={'contained'} fullWidth onClick={storeTranslations}>
            {tr('Save')}
          </Button>
        </Box>
      ) : (
        <></>
      )}
    </StickyStack>
  );
}

const StickyStack = styled(Stack)(({ theme }) => {
  return {
    width: '100%',
    position: 'sticky',
    zIndex: `5`,
    bottom: `0`,
    padding: `${PADDING}px`,
    backgroundColor: theme.palette.background.default,
  };
});
