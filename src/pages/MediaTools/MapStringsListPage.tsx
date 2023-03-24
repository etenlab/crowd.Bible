import { IonContent } from '@ionic/react';
import { useEffect, useState } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { Button, Input, CrowdBibleUI, Autocomplete } from '@eten-lab/ui-kit';
import useNodeServices from '@/src/hooks/useNodeServices';
import { LanguageDto } from '@/src/dtos/lang.dto';

const { TitleWithIcon } = CrowdBibleUI;

//#region types
type Item = {
  label: string;
  value?: string;
};
//#endregion

const PADDING = 15;

export const MapStringsListPage = () => {
  const { nodeService } = useNodeServices();
  const [langs, setLangs] = useState<LanguageDto[]>([]);
  const [words, setWords] = useState<Item[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  useEffect(() => {
    loadLanguages();
    loadMapStrings();
  }, [nodeService]);

  const loadLanguages = async () => {
    if (!nodeService) return;
    const langDtos = await nodeService.getLanguages();
    setLangs(langDtos);
  };

  const loadMapStrings = async () => {
    if (!nodeService) return;
    const wordNodes = await nodeService.getWords();
    const words: Item[] = [];
    for (const node of wordNodes) {
      const strJson = node.propertyKeys.at(0)?.propertyValue?.property_value;
      if (strJson) {
        const valObj = JSON.parse(strJson);
        if (valObj.value) words.push({ value: node.id, label: valObj.value });
      }
    }
    setWords(words);
  };

  const handleSelectLanguage = (value: string) => {
    setSelectedLanguage(value);
  };

  const langLabels = langs.map((l) => l.name);
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
              onClose={() => {}}
              onBack={() => {}}
              withBackIcon={false}
              withCloseIcon={false}
              label="Target Language"
            ></TitleWithIcon>
          </Box>
          <Box flex={1}>
            <Autocomplete
              fullWidth
              options={langLabels}
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

        {words.map((stringItem, idx) => {
          return (
            <Box
              key={idx}
              width={'100%'}
              padding={`10px 25px`}
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
