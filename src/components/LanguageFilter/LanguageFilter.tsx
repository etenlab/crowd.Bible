import { useMemo, useState, useEffect } from 'react';

import {
  Button,
  MuiMaterial,
  CrowdBibleUI,
  LangSelector,
  LanguageInfo,
  useColorModeContext,
} from '@eten-lab/ui-kit';

import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import { compareLangInfo } from '@/utils/langUtils';

const { Stack } = MuiMaterial;
const { TitleWithIcon } = CrowdBibleUI;

export function LanguageFilter() {
  const {
    states: {
      documentTools: { sourceLanguage, targetLanguage },
    },
    actions: {
      setSourceLanguage,
      setTargetLanguage,
      clearModalCom,
      createLoadingStack,
    },
  } = useAppContext();
  const { tr } = useTr();
  const { getColor } = useColorModeContext();

  const [source, setSource] = useState<LanguageInfo | null>(null);
  const [target, setTarget] = useState<LanguageInfo | null>(null);

  useEffect(() => {
    if (sourceLanguage) {
      setSource(sourceLanguage);
    }
    if (targetLanguage) {
      setTarget(targetLanguage);
    }
  }, [sourceLanguage, targetLanguage]);

  const { startLoading, stopLoading } = useMemo(
    () => createLoadingStack(),
    [createLoadingStack],
  );

  const handleLoadingState = (loading: boolean) => {
    if (loading) {
      startLoading();
    } else {
      stopLoading();
    }
  };

  const handleSetSourceLanguage = (
    _langTag: string,
    selected: LanguageInfo,
  ) => {
    if (compareLangInfo(selected, sourceLanguage)) return;
    setSource(selected);
  };

  const handleSetTargetLanguage = (
    _langTag: string,
    selected: LanguageInfo,
  ) => {
    if (compareLangInfo(selected, targetLanguage)) return;
    setTarget(selected);
  };

  const handleClickSaveButton = () => {
    setSourceLanguage(source);
    setTargetLanguage(target);
    clearModalCom();
  };

  return (
    <Stack
      gap="20px"
      sx={{
        borderRadius: '0 0 10px 10px',
        boxShadow: '0px 10px 10px 0px rgba(4, 16, 31, 0.10)',
        background: getColor('bg-main'),
        padding: '20px',
      }}
    >
      <TitleWithIcon
        label={tr('Filter')}
        withBackIcon
        onClose={clearModalCom}
        onBack={() => {}}
      />
      <LangSelector
        label={tr('Select the source language')}
        selected={sourceLanguage || undefined}
        onChange={handleSetSourceLanguage}
        setLoadingState={handleLoadingState}
      />
      <LangSelector
        label={tr('Select the target language')}
        selected={targetLanguage || undefined}
        onChange={handleSetTargetLanguage}
        setLoadingState={handleLoadingState}
      />
      <Button variant="contained" onClick={handleClickSaveButton}>
        {tr('Save')}
      </Button>
    </Stack>
  );
}
