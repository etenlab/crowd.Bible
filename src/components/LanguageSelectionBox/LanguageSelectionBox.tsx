import { useState, useEffect } from 'react';
import {
  MuiMaterial,
  Autocomplete,
  Typography,
  useColorModeContext,
} from '@eten-lab/ui-kit';
import { LanguageDto } from '@/dtos/language.dto';

import { useAppContext } from '@/hooks/useAppContext';
import { useLanguage } from '@/hooks/useLanguage';

const { Stack } = MuiMaterial;

export function LangugeSelectionBox() {
  const {
    states: {
      global: { singletons },
      documentTools: { sourceLanguage, targetLanguage },
    },
    actions: { setSourceLanguage, setTargetLanguage },
  } = useAppContext();
  const { getColor } = useColorModeContext();
  const { getLanguages } = useLanguage();

  const [languageList, setLanguageList] = useState<LanguageDto[]>([]);

  useEffect(() => {
    if (singletons) {
      getLanguages().then(setLanguageList);
    }
  }, [singletons, getLanguages]);

  const handleSetSourceLanguage = (
    _event: React.SyntheticEvent<Element, Event>,
    value: LanguageDto | null,
  ) => {
    setSourceLanguage(value);
  };

  const handleSetTargetLanguage = (
    _event: React.SyntheticEvent<Element, Event>,
    value: LanguageDto | null,
  ) => {
    setTargetLanguage(value);
  };

  return (
    <Stack
      sx={{ padding: '20px', gap: '12px', background: getColor('light-blue') }}
    >
      <Typography variant="h2" color="text.dark">
        Documents
      </Typography>
      <Autocomplete
        label="Choose Source Language"
        options={languageList}
        value={sourceLanguage}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        onChange={handleSetSourceLanguage}
      />
      <Autocomplete
        label="Choose Target Language"
        options={languageList}
        value={targetLanguage}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        onChange={handleSetTargetLanguage}
      />
    </Stack>
  );
}
