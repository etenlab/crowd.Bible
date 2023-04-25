import { IonContent, useIonAlert } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { Button, Input, CrowdBibleUI, Autocomplete } from '@eten-lab/ui-kit';
import { useSingletons } from '@/src/hooks/useSingletons';
import { LanguageDto } from '@/src/dtos/language.dto';
import { WordDto } from '@/src/dtos/word.dto';
import { RelationshipTypeConst } from '@/src/constants/graph.constant';

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

export const MapStringsListComponent = () => {
  const langIdRef = useRef('');
  const singletons = useSingletons();
  const [presentAlert] = useIonAlert();
  const [langs, setLangs] = useState<LanguageDto[]>([]);
  const [words, setWords] = useState<Item[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  useEffect(() => {
    const loadLanguages = async () => {
      if (!singletons) return;
      const langDtos = await singletons.graphThirdLayerService.getLanguages();
      setLangs(langDtos);
    };
    loadLanguages();
  }, [singletons]);

  // const loadMapStrings = async () => {
  //   if (!nodeService) return;
  //   const wordNodes = await nodeService.getWords();
  //   const words: Item[] = wordNodes.map((w) => WordMapper.entityToDto(w));
  //   setWords(words);
  // };

  const handleSelectLanguage = (value: string) => {
    setSelectedLanguage(value);
    const id = langs.find((l) => l.name === value)?.id;
    if (id) {
      langIdRef.current = id;
      getWordsBasedOnLang(id);
    }
  };

  const getWordsBasedOnLang = async (langId: string) => {
    if (!singletons) return;
    const res = await singletons.graphThirdLayerService.getUnTranslatedWords(
      langId,
    );
    console.log('rawNode', res);
    const wordList: Item[] = [];
    for (const node of res) {
      const wordInfo: Item = Object.create(null);
      wordInfo.id = node.id;
      for (const pk of node.propertyKeys) {
        wordInfo[pk.property_key] = undefined;
        if (pk.propertyValue && pk.propertyValue.property_value) {
          wordInfo[pk.property_key] = JSON.parse(
            pk.propertyValue.property_value,
          ).value;
        }
      }
      for (const relNode of node.toNodeRelationships?.at(0)?.fromNode
        ?.toNodeRelationships || []) {
        if (relNode.relationship_type === RelationshipTypeConst.WORD_TO_LANG) {
          wordInfo.langId = relNode.to_node_id;
        }
        if (
          relNode.relationship_type ===
          RelationshipTypeConst.WORD_TO_TRANSLATION
        ) {
          const translationNode = relNode.toNode.toNodeRelationships?.find(
            (nr) => nr.relationship_type === RelationshipTypeConst.WORD_TO_LANG,
          );
          if (translationNode) {
            if (translationNode.to_node_id === langIdRef.current) {
              wordInfo.translationLangId = translationNode.to_node_id;
              const jsonStrValue = relNode.toNode.propertyKeys.find(
                (pk) => pk.property_key === 'name',
              )?.propertyValue?.property_value;
              if (jsonStrValue) {
                wordInfo.translation = JSON.parse(jsonStrValue).value;
              }
              wordInfo.translatedWordId = relNode.toNode.id;
            }
          }
        }
      }
      wordList.push(wordInfo);
    }
    console.log('formatted wordList', wordList);
    setWords(wordList);
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
    if (!singletons) return;
    const translatedWordId = await singletons.graphThirdLayerService.createWord(
      word.translation!,
      word.translationLangId!,
    );
    singletons.graphThirdLayerService
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
                  label={
                    word.langId === langIdRef.current
                      ? 'Already in target language'
                      : ''
                  }
                  value={word.translation || ''}
                  onChange={(e) => {
                    const clonedList = [...words];
                    clonedList[idx].translation = e.target.value;
                    setWords(clonedList);
                  }}
                  disabled={word.langId === langIdRef.current}
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
