import { useAppContext } from '@/hooks/useAppContext';

import { langInfo2String } from '@/utils/langUtils';

import {
  MuiMaterial,
  LanguageInfo,
  BiRightArrowAlt,
  useColorModeContext,
} from '@eten-lab/ui-kit';

const { Stack, Typography } = MuiMaterial;

export function LanguageStatus({ lang }: { lang: LanguageInfo | null }) {
  return lang ? (
    <Typography variant="body2" color="text.gray">
      {langInfo2String(lang)}
    </Typography>
  ) : (
    <Typography variant="body2" color="text.red">
      Not Selected Source Language
    </Typography>
  );
}

export function LanguageStatusBar() {
  const { getColor } = useColorModeContext();
  const {
    states: {
      documentTools: { sourceLanguage, targetLanguage },
    },
  } = useAppContext();

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ padding: '20px', paddingBotton: 0 }}
    >
      <Stack gap="6px">
        <LanguageStatus lang={sourceLanguage} />
        <LanguageStatus lang={targetLanguage} />
      </Stack>
      <BiRightArrowAlt style={{ color: getColor('gray'), fontSize: '24px' }} />
    </Stack>
  );
}
