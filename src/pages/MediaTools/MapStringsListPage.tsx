import { IonContent } from '@ionic/react';
import { useState } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { Button, Input, CrowdBibleUI, Autocomplete } from '@eten-lab/ui-kit';

type Item = {
  label: string;
  value?: string;
};

const { TitleWithIcon } = CrowdBibleUI;

const PADDING = 15;
const MOCK_MAP_STRINGS: Item[] = [
  { label: 'map string 1' },
  { label: 'map string 2' },
  { label: 'map string 3' },
  { label: 'map string 4' },
  { label: 'map string 5' },
];
const MOCK_LANGUAGE_OPTIONS = ['Language1', 'Language2'];

export const MapStringsListPage = () => {
  const [mapStrings, setMapStrings] = useState<Item[]>([...MOCK_MAP_STRINGS]);
  const [languages, setLanguages] = useState<string[]>([
    ...MOCK_LANGUAGE_OPTIONS,
  ]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const handleSelectLanguage = (value: string) => {
    setSelectedLanguage(value);
  };

  return (
    <IonContent>
      <Box
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'start'}
        alignItems={'start'}
        paddingTop={`${PADDING}px`}
      >
        <Box
          width={'100%'}
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Button variant={'text'} href={'/map-list'}>
            Map List
          </Button>
          <Button variant={'text'} href={'/map-strings-list'} disabled>
            String List
          </Button>
        </Box>

        <Box
          width={'100%'}
          padding={`${PADDING}px 0 ${PADDING}px`}
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          margin={`25px 0px`}
          gap={`${PADDING}px`}
        >
          <Box flex={1} alignSelf={'center'}>
            <TitleWithIcon
              onClose={() => {
                //
              }}
              onBack={() => {
                //
              }}
              withBackIcon={false}
              withCloseIcon={false}
              label="Target Language"
            ></TitleWithIcon>
          </Box>
          <Box flex={1}>
            <Autocomplete
              fullWidth
              options={languages}
              value={selectedLanguage}
              onChange={(_, value) => {
                handleSelectLanguage(value || '');
              }}
              label=""
            ></Autocomplete>
          </Box>
        </Box>

        <Box
          width={'100%'}
          padding={`${PADDING}px 0 ${PADDING}px`}
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          gap={`${PADDING}px`}
        >
          <Typography variant="caption" color={'primary'} fontWeight={700}>
            String List
          </Typography>
          <Typography variant="caption" color={'primary'} fontWeight={700}>
            Translation
          </Typography>
        </Box>

        <Divider style={{ width: '100%' }} />

        {mapStrings.map((stringItem, idx) => {
          return (
            <Box
              key={idx}
              width={'100%'}
              padding={`${PADDING}px 0 ${PADDING}px`}
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              gap={`${PADDING}px`}
            >
              <Box flex={1} alignSelf={'center'}>
                <Typography variant="h6">{stringItem.label}</Typography>
              </Box>
              <Box flex={1}>
                <Input fullWidth label=""></Input>
              </Box>
            </Box>
          );
        })}
      </Box>
    </IonContent>
  );
};
