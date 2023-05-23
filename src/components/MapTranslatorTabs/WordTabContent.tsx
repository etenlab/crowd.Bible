import { IonIcon } from '@ionic/react';
import React, { useCallback, useState } from 'react';

import {
  Input,
  Typography,
  LangSelector,
  LanguageInfo,
  Button,
  MuiMaterial,
} from '@eten-lab/ui-kit';

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
  compareLangInfo,
  langInfo2String,
  wordProps2LangInfo,
} from '@/utils/langUtils';
import { WordMapper } from '@/mappers/word.mapper';
import { useAppContext } from '@/hooks/useAppContext';

const { Box, Divider, Stack } = MuiMaterial;

type Item = {
  translations?: Array<WordDto & { isNew: boolean }>;
} & WordDto;

const PADDING = 15;

export const WordTabContent = () => {
  const {
    states: {
      global: { singletons },
    },
  } = useAppContext();
  const [words, setWords] = useState<Item[]>([]);
  const [sourceLangInfo, setSourceLangInfo] = useState<LanguageInfo>();
  const [targetLangInfo, setTargetLangInfo] = useState<LanguageInfo>();
  const [step, setStep] = useState(0);

  const getWordsWithLangs = useCallback(
    async (
      sourceLangInfo: LanguageInfo,
      targetLangInfo: LanguageInfo,
    ): Promise<Item[]> => {
      if (!singletons) return [];
      const wordNodes =
        await singletons.wordService.getWordsWithLangAndRelationships(
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
              await singletons.graphFirstLayerService.getNodesWithRelationshipsByIds(
                [relationship.to_node_id],
              )
            )[0];
            const translatedWord = WordMapper.entityToDto(translationNode);
            const translatedWordLangInfo = wordProps2LangInfo(translatedWord);

            if (compareLangInfo(translatedWordLangInfo, targetLangInfo)) {
              currWordItem.translations.push({
                ...translatedWord,
                isNew: false,
              });
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

  const handleTranslationChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      wordIdx: number,
      translationIdx: number,
    ) => {
      const w = [...words];
      w[wordIdx].translations![translationIdx][PropertyKeyConst.WORD] =
        e.target.value;
      setWords(w);
    },
    [words],
  );

  const addEmptyTranslation = useCallback(
    (wordIdx: number) => {
      const w = [...words];
      const emptyTranslation = {
        id: '',
        word: '',
        language: '',
        isNew: true,
      };
      if (w[wordIdx].translations) {
        w[wordIdx].translations?.push(emptyTranslation);
      } else {
        w[wordIdx].translations = [emptyTranslation];
      }
      setWords([...words]);
    },
    [words],
  );

  const storeTranslations = useCallback(async () => {
    for (const word of words) {
      if (!singletons) return;
      if (!word.translations)
        throw new Error(
          `No translation value is specified for word ${JSON.stringify(word)}`,
        );

      for (const translation of word.translations || []) {
        if (!translation.isNew) continue;
        const translationWordId =
          await singletons.wordService.createWordOrPhraseWithLang(
            translation.word,
            targetLangInfo!,
            NodeTypeConst.WORD,
          );
        await singletons.wordService.createWordTranslationRelationship(
          word.id,
          translationWordId,
        );
      }
    }
    setWords(await getWordsWithLangs(sourceLangInfo!, targetLangInfo!));
  }, [getWordsWithLangs, singletons, sourceLangInfo, targetLangInfo, words]);

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
          <Stack divider={<Divider />} width={'100%'}>
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
                  <Box flex={1} alignSelf={'flex-start'}>
                    <Typography variant="subtitle1" fontWeight={400}>
                      {word.word}
                    </Typography>
                  </Box>
                  <Box flex={1} alignSelf={'flex-start'}>
                    {word.translations && word.translations.length > 0 ? (
                      <Stack gap={`${PADDING}px`}>
                        {word.translations.map((translation, tIdx) => {
                          return (
                            <Input
                              fullWidth
                              key={tIdx}
                              label={
                                translation.isNew
                                  ? ''
                                  : 'Already in target language'
                              }
                              value={translation[PropertyKeyConst.WORD]}
                              onChange={(e) =>
                                handleTranslationChange(e, idx, tIdx)
                              }
                              disabled={!translation.isNew}
                            />
                          );
                        })}
                      </Stack>
                    ) : (
                      <></>
                    )}

                    <Button
                      variant={'text'}
                      sx={{ color: 'text.gray' }}
                      onClick={() => addEmptyTranslation(idx)}
                    >
                      + Add Translation
                    </Button>
                  </Box>
                </Box>
              );
            })}
          </Stack>
          <Button variant={'contained'} fullWidth onClick={storeTranslations}>
            Save
          </Button>
        </>
      ) : (
        <></>
      )}
    </Box>
  );
};
