import { useState, ChangeEventHandler } from 'react';
import {
  MuiMaterial,
  Autocomplete,
  Typography,
  BiLeftArrowAlt,
  CiSearch,
  SearchInput,
  useColorModeContext,
} from '@eten-lab/ui-kit';

const { Stack, IconButton } = MuiMaterial;

type LanguageDto = {
  id: string;
  name: string;
};

type HeadBoxProps = {
  back?: {
    action: () => void;
  };
  title: string;
  appTitle?: string;
  search?: {
    value: string;
    onChange: (str: string) => void;
    placeHolder: string;
  };
  languageSelector?: {
    languageList: LanguageDto[];
    source: LanguageDto;
    target: LanguageDto;
    onChangeSource(lang: LanguageDto | null): void;
    onChangeTarget(lang: LanguageDto | null): void;
  };
};

export function HeadBox({
  back,
  title,
  appTitle,
  search,
  languageSelector,
}: HeadBoxProps) {
  const { getColor } = useColorModeContext();

  const [openSearchBtn, setOpenSearchBtn] = useState<boolean>(false);

  const handleClickSearchButton = () => {
    setOpenSearchBtn((open) => !open);
  };

  const handleChangeSearchInput: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    search?.onChange(event.target.value);
  };

  const handleSetSourceLanguage = (
    _event: React.SyntheticEvent<Element, Event>,
    value: LanguageDto | null,
  ) => {
    languageSelector?.onChangeSource(value);
  };

  const handleSetTargetLanguage = (
    _event: React.SyntheticEvent<Element, Event>,
    value: LanguageDto | null,
  ) => {
    languageSelector?.onChangeTarget(value);
  };

  const backCom = back ? (
    <IconButton onClick={back.action}>
      <BiLeftArrowAlt />
    </IconButton>
  ) : null;

  const titleCom = appTitle ? (
    <Stack>
      <Typography variant="h2" color="text.dark">
        {appTitle}
      </Typography>
      <Typography variant="h2" color="text.dark">
        {title}
      </Typography>
    </Stack>
  ) : (
    <Typography variant="h2" color="text.dark">
      {title}
    </Typography>
  );

  const searchCom = search ? (
    <IconButton onClick={handleClickSearchButton}>
      <CiSearch />
    </IconButton>
  ) : null;

  const searchInputCom =
    openSearchBtn && search ? (
      <SearchInput
        label={search.placeHolder}
        value={search.value}
        onChange={handleChangeSearchInput}
      />
    ) : null;

  const languageCom = languageSelector ? (
    <>
      <Autocomplete
        label="Choose Source Language"
        options={languageSelector.languageList}
        value={languageSelector.source}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        onChange={handleSetSourceLanguage}
      />
      <Autocomplete
        label="Choose Target Language"
        options={languageSelector.languageList}
        value={languageSelector.target}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        onChange={handleSetTargetLanguage}
      />
    </>
  ) : null;

  return (
    <Stack
      sx={{ padding: '20px', gap: '12px', background: getColor('light-blue') }}
    >
      <Stack justifyContent="space-between" alignItems="center">
        <Stack justifyContent="flex-start" alignItems="center">
          {backCom}
          {titleCom}
        </Stack>
        {searchCom}
      </Stack>
      {searchInputCom}
      {languageCom}
    </Stack>
  );
}
