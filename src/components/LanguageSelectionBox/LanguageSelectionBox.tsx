import {
  LangSelector,
  LanguageInfo,
  MuiMaterial,
  Typography,
  useColorModeContext,
} from '@eten-lab/ui-kit';

import { useAppContext } from '@/hooks/useAppContext';

const { Stack } = MuiMaterial;

export function LanguageSelectionBox() {
  const {
    states: {
      documentTools: { sourceLanguage, targetLanguage },
    },
    actions: { setSourceLanguage, setTargetLanguage, setLoadingState },
  } = useAppContext();
  const { getColor } = useColorModeContext();

  const handleSetSourceLanguage = (
    _langTag: string,
    selected: LanguageInfo,
  ) => {
    setSourceLanguage(selected);
  };

  const handleSetTargetLanguage = (
    _langTag: string,
    selected: LanguageInfo,
  ) => {
    setTargetLanguage(selected);
  };

  return (
    <Stack
      sx={{ padding: '20px', gap: '12px', background: getColor('light-blue') }}
    >
      <Typography variant="h2" color="text.dark">
        Documents
      </Typography>
      <LangSelector
        selected={sourceLanguage || undefined}
        onChange={handleSetSourceLanguage}
        setLoadingState={setLoadingState}
      />
      <LangSelector
        selected={targetLanguage || undefined}
        onChange={handleSetTargetLanguage}
        setLoadingState={setLoadingState}
      />
    </Stack>
  );
}
