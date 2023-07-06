import { useAppContext } from '@/hooks/useAppContext';

import { langInfo2String } from '@/utils/langUtils';

import {
  MuiMaterial,
  LanguageInfo,
  DiArrowRight,
  useColorModeContext,
} from '@eten-lab/ui-kit';

import { useTr } from '@/hooks/useTr';

const { Stack, Typography } = MuiMaterial;

export function LanguageStatus({
  lang,
  noSelectedMsg,
}: {
  lang: LanguageInfo | null;
  noSelectedMsg?: string;
}) {
  const { tr } = useTr();

  return lang ? (
    <Typography variant="body2" color="text.gray">
      {langInfo2String(lang)}
    </Typography>
  ) : (
    <Typography variant="body2" color="text.red">
      {noSelectedMsg || tr('Not Selected Language')}
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
  const { tr } = useTr();

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ padding: '20px', paddingBotton: 0 }}
    >
      <Stack gap="6px">
        <LanguageStatus
          lang={sourceLanguage}
          noSelectedMsg={tr('Not Selected Source Language')}
        />
        <LanguageStatus
          lang={targetLanguage}
          noSelectedMsg={tr('Not Selected Target Language')}
        />
      </Stack>
      <DiArrowRight style={{ color: getColor('gray') }} />
    </Stack>
  );
}
