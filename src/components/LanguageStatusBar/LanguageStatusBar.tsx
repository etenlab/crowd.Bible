import { useRef, useEffect, useState, useCallback } from 'react';

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
  onChangeWidth,
}: {
  lang: LanguageInfo | null;
  noSelectedMsg?: string;
  onChangeWidth?(width: number): void;
}) {
  const { tr } = useTr();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const divElement = ref.current;

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentBoxSize) {
            if (onChangeWidth) {
              onChangeWidth(entry.contentBoxSize[0].inlineSize);
            }
          }
        }
      });

      resizeObserver.observe(divElement);
    }
  }, [onChangeWidth]);

  return (
    <Stack ref={ref}>
      {lang ? (
        <Typography variant="body2" color="text.gray">
          {langInfo2String(lang)}
        </Typography>
      ) : (
        <Typography variant="body2" color="text.red">
          {noSelectedMsg || tr('Not Selected Language')}
        </Typography>
      )}
    </Stack>
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

  const ref = useRef<HTMLDivElement>(null);

  const [sourceWidth, setSourceWidth] = useState<number>(0);
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    if (ref.current) {
      const divElement = ref.current;

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentBoxSize) {
            setContainerWidth(entry.contentBoxSize[0].inlineSize);
          }
        }
      });

      resizeObserver.observe(divElement);
    }
  }, []);

  const handleChangeWidthSource = useCallback((width: number) => {
    setSourceWidth(width);
  }, []);

  const handleChangeWidthTarget = useCallback((width: number) => {
    setTargetWidth(width);
  }, []);

  const downmode =
    sourceWidth + targetWidth + 60 > containerWidth ? true : false;

  return (
    <Stack gap="12px" sx={{ padding: '20px', paddingBotton: 0 }}>
      <Typography variant="overline" color="text.gray" sx={{ opacity: '0.5' }}>
        {tr('Filter')}
      </Typography>
      <Stack
        ref={ref}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack
          gap="6px"
          direction={downmode ? 'column' : 'row'}
          justifyContent="flex-start"
          alignItems={downmode ? 'flex-start' : 'center'}
        >
          <LanguageStatus
            lang={sourceLanguage}
            noSelectedMsg={tr('Not Selected Source Language')}
            onChangeWidth={handleChangeWidthSource}
          />
          {downmode ? null : (
            <DiArrowRight style={{ color: getColor('gray') }} />
          )}
          <LanguageStatus
            lang={targetLanguage}
            noSelectedMsg={tr('Not Selected Target Language')}
            onChangeWidth={handleChangeWidthTarget}
          />
        </Stack>
        {downmode ? <DiArrowRight style={{ color: getColor('gray') }} /> : null}
      </Stack>
    </Stack>
  );
}
