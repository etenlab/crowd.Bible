import { IonContent, useIonAlert } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { Button, Input, CrowdBibleUI, Autocomplete } from '@eten-lab/ui-kit';
import useNodeServices from '@/src/hooks/useNodeServices';
import { LanguageDto } from '@/src/dtos/lang.dto';
import { WordDto } from '@/src/dtos/word.dto';
import { WordMapper } from '@/src/mappers/word.mapper';
import { NodeTypeConst } from '@/src/constants/node-type.constant';

const { TitleWithIcon } = CrowdBibleUI;

//#region types
type Item = {
  langId?: string;
  translation?: string;
  translatedWordId?: string;
  translationLangId?: string;
} & WordDto;
//#endregion

const PADDING = 15;

export const MapStringsListPage = () => {
  const langIdRef = useRef('');
  const { nodeService } = useNodeServices();
  const [presentAlert] = useIonAlert();
  const [langs, setLangs] = useState<LanguageDto[]>([]);
  const [words, setWords] = useState<Item[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  useEffect(() => {
    loadLanguages();
    // loadMapStrings();
  }, [nodeService]);

  const loadLanguages = async () => {
    if (!nodeService) return;
    const langDtos = await nodeService.getLanguages();
    setLangs(langDtos);
  };

  const loadMapStrings = async () => {
    if (!nodeService) return;
    const wordNodes = await nodeService.getWords();
    const words: Item[] = wordNodes.map((w) => WordMapper.entityToDto(w));
    setWords(words);
  };

  const handleSelectLanguage = (value: string) => {
    setSelectedLanguage(value);
    const id = langs.find((l) => l.name === value)?.id;
    if (id) {
      langIdRef.current = id;
      getWordsBasedOnLang(id);
    }
  };

  const getWordsBasedOnLang = async (langId: string) => {
    if (!nodeService) return;
    const res = await nodeService.getUnTranslatedWords(langId);
    console.log(res);
    setWords(res.map((w) => WordMapper.entityToDto(w)));
  };

  const onTranslationCapture = (
    idx: number,
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => {
    const value = e.target.value?.trim();
    if (!value) return;
    const stateCopy = [...words];
    stateCopy[idx] = {
      ...stateCopy[idx],
      translation: value,
      translationLangId: langIdRef.current,
    };
    storeTranslation(stateCopy[idx]);
  };

  const storeTranslation = async (word: Item) => {
    if (!nodeService) return;
    const translatedWordId = await nodeService.createWord(
      word.translation!,
      word.translationLangId!,
    );
    nodeService
      .createWordTranslationRelationship(word.id, translatedWordId)
      .then((res) => {
        console.log('word translation created', res);
      });
  };

  const showAlert = (msg: string) => {
    presentAlert({
      header: 'Alert',
      subHeader: 'Important Message!',
      message: msg,
      buttons: ['Ok'],
    });
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

        {words.map((word, idx) => {
          return (
            <Box
              key={idx}
              width={'100%'}
              padding={`10px 0px`}
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              gap={`${PADDING}px`}
            >
              <Box flex={1} alignSelf={'center'}>
                <Typography variant="h6">{word.name}</Typography>
              </Box>
              <Box flex={1}>
                <Input
                  fullWidth
                  label=""
                  onClick={(e) => {
                    if (!langIdRef.current) {
                      showAlert('Please choose target language!');
                      e.stopPropagation();
                      e.preventDefault();
                    }
                  }}
                  onBlur={(e) => {
                    onTranslationCapture(idx, e);
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </Box>
    </IonContent>
  );
};
