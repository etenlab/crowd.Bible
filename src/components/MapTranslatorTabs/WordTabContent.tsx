import { IonIcon, useIonAlert } from '@ionic/react';
import React, { useCallback, useEffect, useState } from 'react';
import { Box, Divider } from '@mui/material';
import {
  Input,
  Autocomplete,
  Button,
  Typography,
  LangSelector,
  LanguageInfo,
} from '@eten-lab/ui-kit';
import { useSingletons } from '@/src/hooks/useSingletons';
import { WordDto } from '@/src/dtos/word.dto';
import {
  NodeTypeConst,
  PropertyKeyConst,
  RelationshipTypeConst,
} from '@/src/constants/graph.constant';
import {
  StyledFilterButton,
  StyledSectionTypography,
} from './StyledComponents';
import { arrowForwardOutline } from 'ionicons/icons';
import {
  langInfo2String,
  langInfo2tag,
  wordProps2LangInfo,
} from '../../utils/langUtils';
import { useAppContext } from '../../hooks/useAppContext';
import { WordMapper } from '../../mappers/word.mapper';

type Item = {
  // langInfo?: LanguageInfo;
  // translations?: string[];
  // translationsLangInfo?: LanguageInfo;
  translations?: WordDto[];
} & WordDto;

const PADDING = 15;

export const WordTabContent = () => {
  const {
    actions: { alertFeedback },
  } = useAppContext();
  const singletons = useSingletons();
  const [words, setWords] = useState<Item[]>([]);
  const [sourceLangInfo, setSourceLangInfo] = useState<LanguageInfo>();
  const [targetLangInfo, setTargetLangInfo] = useState<LanguageInfo>();
  const [step, setStep] = useState(0);

  const getWordsWithLangs = useCallback(
    async (
      sourceLangInfo: LanguageInfo,
      targetLangInfo: LanguageInfo,
      // TODO: change to Item[] VotableItem[] if we need voting on translations
    ): Promise<Item[]> => {
      if (!singletons) return [];
      const wordNodes =
        await singletons.graphThirdLayerService.getWordsWithLangAndRelationships(
          sourceLangInfo,
          [RelationshipTypeConst.WORD_MAP],
        );
      if (!wordNodes) return [];
      const wordItemList: Array<Item> = [];

      for (const wordNode of wordNodes) {
        const currWordItem: Item = WordMapper.entityToDto(wordNode);
        currWordItem.translations = [];

        for (const relationship of wordNode.toNodeRelationships || []) {
          if (
            relationship.relationship_type ===
            RelationshipTypeConst.WORD_TO_TRANSLATION
          ) {
            const translationNode = (
              await singletons.graphFirstLayerService.getNodesByIds([
                relationship.to_node_id,
              ])
            )[0];

            let isMatchesTargetLang = true;
            const translatedWord = WordMapper.entityToDto(translationNode);
            isMatchesTargetLang =
              isMatchesTargetLang &&
              translatedWord[PropertyKeyConst.LANGUAGE_TAG] ===
                targetLangInfo.lang.tag;

            isMatchesTargetLang =
              isMatchesTargetLang &&
              (translatedWord[PropertyKeyConst.REGION_TAG] || undefined) ===
                targetLangInfo.region?.tag;

            isMatchesTargetLang =
              isMatchesTargetLang &&
              (translatedWord[PropertyKeyConst.DIALECT_TAG] || undefined) ===
                targetLangInfo.dialect?.tag;

            if (isMatchesTargetLang) {
              currWordItem.translations.push(translatedWord);
            }
          }
        }
        wordItemList.push(currWordItem);
      }
      return wordItemList;
    },
    [singletons],
  );

  const onShowStringListClick = useCallback(async () => {
    if (sourceLangInfo && targetLangInfo) {
      setWords(await getWordsWithLangs(sourceLangInfo, targetLangInfo));
      setStep(1);
    }
  }, [getWordsWithLangs, sourceLangInfo, targetLangInfo]);

  // const getWordsBasedOnLang = async (langInfo: LanguageInfo) => {
  //   if (!singletons) return;
  //   const res = await singletons.graphThirdLayerService.getUnTranslatedWords();
  //   const wordList: Item[] = [];
  //   for (const node of res) {
  //     const wordInfo: Item = Object.create(null);
  //     wordInfo.id = node.id;
  //     for (const pk of node.propertyKeys) {
  //       wordInfo[pk.property_key] = undefined;
  //       if (pk.propertyValue && pk.propertyValue.property_value) {
  //         wordInfo[pk.property_key] = JSON.parse(
  //           pk.propertyValue.property_value,
  //         ).value;
  //       }
  //     }
  //     for (const relNode of node.toNodeRelationships?.at(0)?.fromNode
  //       ?.toNodeRelationships || []) {
  //       if (relNode.relationship_type === RelationshipTypeConst.WORD_TO_LANG) {
  //         //!!! change discovering lang forom node to props
  //         wordInfo.langId = relNode.to_node_id;
  //       }
  //       if (
  //         relNode.relationship_type ===
  //         RelationshipTypeConst.WORD_TO_TRANSLATION
  //       ) {
  //         const translationNode = relNode.toNode.toNodeRelationships?.find(
  //           (nr) => nr.relationship_type === RelationshipTypeConst.WORD_TO_LANG, //!!! remove because we check lang not by node but by props
  //         );
  //         if (translationNode) {
  //           // if (translationNode.to_node_id === targetLang.selectedLangId) {
  //           wordInfo.translationLangId = translationNode.to_node_id;
  //           const jsonStrValue = relNode.toNode.propertyKeys.find(
  //             (pk) => pk.property_key === 'name',
  //           )?.propertyValue?.property_value;
  //           if (jsonStrValue) {
  //             wordInfo.translation = JSON.parse(jsonStrValue).value;
  //           }
  //           wordInfo.translatedWordId = relNode.toNode.id;
  //           // }
  //         }
  //       }
  //     }
  //     wordList.push(wordInfo);
  //   }
  //   console.log('formatted wordList', wordList);
  //   setWords(wordList);
  // };

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
      translationLangInfo: targetLangInfo,
    };
    storeTranslations(stateCopy[idx]);
  };

  const storeTranslations = async (word: Item) => {
    if (!singletons) return;
    if (!word.translations)
      throw new Error(
        `No translation value is specified for word ${JSON.stringify(word)}`,
      );

    for (const translation of word.translations || []) {
      if (!translation.language)
        throw new Error(
          `No translation language is specified for word ${JSON.stringify(
            word,
          )}`,
        );
      const translatedWordId =
        await singletons.graphThirdLayerService.createWordOrPhraseWithLang(
          translation.name,
          wordProps2LangInfo({ language: translation.language }),
          NodeTypeConst.WORD,
        );
      singletons.graphThirdLayerService
        .createWordTranslationRelationship(word.id, translatedWordId)
        .then((res) => {
          console.log('word translation created', res);
        });
    }
  };

  // const langLabels = langs.map((l) => l.name);
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
            <LangSelector
              onChange={(_langTag: string, langInfo: LanguageInfo) =>
                setSourceLangInfo(langInfo)
              }
            />
          </Box>

          <Box width={'100%'}>
            <StyledSectionTypography>
              Select the target language
            </StyledSectionTypography>
            <LangSelector
              onChange={(_langTag: string, langInfo: LanguageInfo) =>
                setTargetLangInfo(langInfo)
              }
            />
          </Box>

          <Button
            fullWidth
            onClick={onShowStringListClick}
            variant={'contained'}
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
                {langInfo2String(sourceLangInfo)}
              </Typography>
              <IonIcon icon={arrowForwardOutline}></IonIcon>
              <Typography
                fontWeight={600}
                color={'text.dark'}
                fontSize={'20px'}
                lineHeight={'28px'}
                paddingLeft={'5px'}
              >
                {langInfo2String(targetLangInfo)}
              </Typography>
            </Box>
            <StyledFilterButton
              onClick={() => {
                setSourceLangInfo(undefined);
                setTargetLangInfo(undefined);
                setStep(0);
              }}
            />
          </Box>
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
                  <Typography variant="subtitle1" fontWeight={400}>
                    {word.name}
                  </Typography>
                </Box>
                <Box flex={1}>
                  <Input
                    fullWidth
                    label={
                      word.langId === targetLangInfo
                        ? 'Already in target language'
                        : ''
                    }
                    value={word.translation || ''} //!!!!
                    onChange={(e) => {
                      const clonedList = [...words];
                      clonedList[idx].translation = e.target.value;
                      setWords(clonedList);
                    }}
                    // disabled={
                    //   langInfo2tag(word.langInfo) ===
                    //   langInfo2tag(targetLangInfo)
                    // }
                    onClick={(e) => {
                      if (!targetLangInfo) {
                        alertFeedback('info', 'Please choose target language!');
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
            );
          })}
        </>
      ) : (
        <></>
      )}
    </Box>
  );
};
