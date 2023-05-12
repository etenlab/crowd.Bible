import { IonIcon, useIonAlert } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Box, Divider } from '@mui/material';
import { Input, Autocomplete, Button, Typography } from '@eten-lab/ui-kit';
import { useSingletons } from '@/src/hooks/useSingletons';
import { LanguageDto } from '@/src/dtos/language.dto';
import { WordDto } from '@/src/dtos/word.dto';
import { RelationshipTypeConst } from '@/src/constants/graph.constant';
import {
  StyledFilterButton,
  StyledSectionTypography,
} from './StyledComponents';
import { arrowForwardOutline } from 'ionicons/icons';

//#region types
type Item = {
  langId?: string;
  translation?: string;
  translatedWordId?: string;
  translationLangId?: string;
} & WordDto;
type LangInfo = {
  selectedLang?: string | null;
  selectedLangId?: string;
  langIdInput?: string;
};
//#endregion

const PADDING = 15;

export const WordTabContent = () => {
  const singletons = useSingletons();
  const [presentAlert] = useIonAlert();
  const [langs, setLangs] = useState<LanguageDto[]>([]);
  const [words, setWords] = useState<Item[]>([]);
  const [sourceLang, setSourceLang] = useState<LangInfo>({});
  const [targetLang, setTargetLang] = useState<LangInfo>({});
  const [step, setStep] = useState(0);

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

  const setSelectedLang = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<LangInfo>>,
  ) => {
    const id = langs.find((l) => l.name === value)?.id;
    setter((prevState) => {
      return { ...prevState, selectedLangId: id, selectedLang: value };
    });
  };

  const onShowStringListClick = () => {
    if (sourceLang.selectedLang && targetLang.selectedLang) {
      getWordsBasedOnLang(sourceLang.selectedLangId!);
      setStep(1);
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
            if (translationNode.to_node_id === targetLang.selectedLangId) {
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
      translationLangId: targetLang.selectedLangId,
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
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'start'}
      alignItems={'start'}
      width={'100%'}
    >
      {step === 0 ? (
        <>
          <Box width={'100%'}>
            <StyledSectionTypography>
              Select the source language
            </StyledSectionTypography>
            <Box
              display={'flex'}
              width={'100%'}
              gap={'20px'}
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Autocomplete
                options={langLabels}
                value={sourceLang.selectedLang}
                onChange={(_, value) => {
                  setSelectedLang(value!, setSourceLang);
                }}
                label=""
                sx={{
                  flex: 1,
                  borderColor: 'text.gray',
                  color: 'text.dark',
                  fontWeight: 700,
                }}
              />
              <Input label="" placeholder="Language ID" sx={{ flex: 1 }} />
            </Box>
          </Box>

          <Box width={'100%'}>
            <StyledSectionTypography>
              Select the target language
            </StyledSectionTypography>
            <Box
              display={'flex'}
              width={'100%'}
              gap={'20px'}
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Autocomplete
                options={langLabels}
                value={targetLang.selectedLang}
                onChange={(_, value) => {
                  setSelectedLang(value!, setTargetLang);
                }}
                label=""
                sx={{
                  flex: 1,
                  borderColor: 'text.gray',
                  color: 'text.dark',
                  fontWeight: 700,
                }}
              />
              <Input label="" placeholder="Language ID" sx={{ flex: 1 }} />
            </Box>
          </Box>

          <Button
            fullWidth
            onClick={onShowStringListClick}
            variant={'contained'}
            sx={{
              backgroundColor: 'text.blue-primary',
              color: 'text.white',
              fontSize: '14px',
              fontWeight: 800,
              padding: '14px 73px',
              marginTop: '20px',
              ':hover': {
                backgroundColor: 'text.blue-primary',
              },
            }}
          >
            Show String List
          </Button>
        </>
      ) : (
        <></>
      )}

      {step === 1 ? (
        <>
          <Box
            display={'flex'}
            width={'100%'}
            alignItems={'center'}
            justifyContent={'space-between'}
            padding="25px 0px"
          >
            <Box
              display={'flex'}
              alignItems={'center'}
              sx={{ fontSize: '20px' }}
            >
              <Typography
                fontWeight={600}
                color={'text.dark'}
                fontSize={'20px'}
                lineHeight={'28px'}
                paddingRight={'5px'}
              >
                {sourceLang.selectedLang}
              </Typography>
              <IonIcon icon={arrowForwardOutline}></IonIcon>
              <Typography
                fontWeight={600}
                color={'text.dark'}
                fontSize={'20px'}
                lineHeight={'28px'}
                paddingLeft={'5px'}
              >
                {targetLang.selectedLang}
              </Typography>
            </Box>
            <StyledFilterButton
              onClick={() => {
                setSourceLang({ selectedLang: '', langIdInput: '' });
                setTargetLang({ selectedLang: '', langIdInput: '' });
                setStep(0);
              }}
            />
          </Box>
          {words.map((word, idx) => {
            return (
              <>
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
                    <Typography variant="subtitle1" fontWeight={400}>
                      {word.name}
                    </Typography>
                  </Box>
                  <Box flex={1}>
                    <Input
                      fullWidth
                      label={
                        word.langId === targetLang.selectedLangId
                          ? 'Already in target language'
                          : ''
                      }
                      value={word.translation || ''}
                      onChange={(e) => {
                        const clonedList = [...words];
                        clonedList[idx].translation = e.target.value;
                        setWords(clonedList);
                      }}
                      disabled={word.langId === targetLang.selectedLangId}
                      onClick={(e) => {
                        if (!targetLang.selectedLangId) {
                          showAlert('Please choose target language!');
                          e.stopPropagation();
                          e.preventDefault();
                        }
                      }}
                      onBlur={(e) => {
                        onTranslationCapture(idx, e);
                      }}
                    />
                    <Button variant={'text'} sx={{ color: 'text.gray' }}>
                      + Add More
                    </Button>
                  </Box>
                </Box>
                <Divider style={{ width: '100%' }} />
              </>
            );
          })}
        </>
      ) : (
        <></>
      )}
    </Box>
  );
};
