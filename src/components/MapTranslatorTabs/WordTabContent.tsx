import { IonIcon } from '@ionic/react';
import React, { useCallback, useState } from 'react';

import {
  Input,
  Typography,
  LanguageInfo,
  Button,
  MuiMaterial,
  DiArrowRight,
  LangSelector,
} from '@eten-lab/ui-kit';
import { CrowdBibleUI } from '@eten-lab/ui-kit';
import {
  NodeTypeConst,
  PropertyKeyConst,
} from '@/src/constants/graph.constant';
import { StyledFilterButton } from './StyledComponents';
import { arrowForwardOutline } from 'ionicons/icons';
import { langInfo2String } from '@/utils/langUtils';
import { useAppContext } from '@/hooks/useAppContext';
import {
  WordItem,
  useMapTranslationTools,
} from '@/hooks/useMapTranslationTools';
import { VotableItem } from '@/dtos/votable-item.dto';
import { ElectionTypeConst, LoggerService } from '@eten-lab/core';
import { UpOrDownVote, VoteTypes } from '@/constants/common.constant';
import { BottomButtons } from './BottomButtons';

const { ItemContentListEdit } = CrowdBibleUI;
const { Box, Divider, Stack } = MuiMaterial;
const logger = new LoggerService();

export enum Steps {
  GET_LANGUAGES = 0,
  INPUT_TRANSLATIONS = 1,
  VOTE = 2,
}

const PADDING = 15;

export const WordTabContent = () => {
  const {
    states: {
      global: { singletons },
      documentTools: { sourceLanguage, targetLanguage },
    },
    actions: { setSourceLanguage, setTargetLanguage },
  } = useAppContext();
  const [words, setWords] = useState<WordItem[]>([]);
  const [step, setStep] = useState<Steps>(Steps.GET_LANGUAGES);
  const { getWordsWithLangs, changeTranslationVotes } =
    useMapTranslationTools();
  const [wordsVotableItems, setWordsVotableItems] = useState<VotableItem[]>([]);

  const handleChangeTranslationVotes = useCallback(
    (candidateId: Nanoid | null, vote: 'upVote' | 'downVote') => {
      const upOrDown: UpOrDownVote =
        vote === 'upVote' ? VoteTypes.UP : VoteTypes.DOWN;
      changeTranslationVotes(
        wordsVotableItems,
        setWordsVotableItems,
        candidateId,
        upOrDown,
      );
    },
    [changeTranslationVotes, wordsVotableItems],
  );

  const handleSetSourceLanguage = useCallback(
    (_langTag: string, langInfo: LanguageInfo) => {
      setSourceLanguage(langInfo);
    },
    [setSourceLanguage],
  );

  const handleSetTargetLanguage = useCallback(
    (_langTag: string, langInfo: LanguageInfo) => {
      setTargetLanguage(langInfo);
    },
    [setTargetLanguage],
  );

  const getWordsAsVotableItems = useCallback(
    async (
      forLangInfo: LanguageInfo,
      contentLangInfo: LanguageInfo,
    ): Promise<Array<VotableItem>> => {
      if (!singletons) {
        logger.error({ at: 'getWordsAsVotableItems' }, 'No singletons');
        return [];
      }
      const wordsAsVotableItems =
        await singletons.definitionService.getVotableItems(
          forLangInfo,
          NodeTypeConst.WORD,
          undefined,
          ElectionTypeConst.TRANSLATION,
          contentLangInfo,
        );

      return wordsAsVotableItems;
    },
    [singletons],
  );

  const onShowStringListClick = useCallback(async () => {
    if (sourceLanguage && targetLanguage) {
      setWords(await getWordsWithLangs(sourceLanguage, targetLanguage));
      setStep(Steps.INPUT_TRANSLATIONS);
    }
  }, [getWordsWithLangs, sourceLanguage, targetLanguage]);

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
    if (!sourceLanguage)
      throw new Error(`No sourceLangInfo when storeTranslations`);
    if (!targetLanguage)
      throw new Error(`No sourceLangInfo when storeTranslations`);
    const savedWordIds: string[] = [];
    for (const word of words) {
      if (!singletons) return;
      if (!word.translations)
        throw new Error(
          `No translation value is specified for word ${JSON.stringify(word)}`,
        );

      for (const translation of word.translations || []) {
        if (!translation.isNew) continue;
        if (translation.word.length < 1) continue;
        const translationWordId =
          await singletons.wordService.createOrFindWordOrPhraseWithLang(
            translation.word,
            targetLanguage!,
            NodeTypeConst.WORD,
          );
        await singletons.wordService.createWordTranslationRelationship(
          word.id,
          translationWordId,
        );
        savedWordIds.push(word.id);
      }
    }
    // TODO may be optimised if invent special methods to get words prefiltered by map also (not only language)
    const allWordsAsVotableItems = await getWordsAsVotableItems(
      sourceLanguage,
      targetLanguage,
    );
    const existingWordIds = words.map((w) => w.id);
    const onlyWordInAnyMap = allWordsAsVotableItems.filter((w) =>
      [...savedWordIds, ...existingWordIds].includes(w.title.id as string),
    );
    setWordsVotableItems(onlyWordInAnyMap);
    setStep(Steps.VOTE);
  }, [
    getWordsAsVotableItems,
    singletons,
    sourceLanguage,
    targetLanguage,
    words,
  ]);

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'start'}
      alignItems={'start'}
      width={'100%'}
    >
      {step === Steps.GET_LANGUAGES ? (
        <>
          <Box width={'100%'}>
            <LangSelector
              label="Select the source language"
              selected={sourceLanguage || undefined}
              onChange={handleSetSourceLanguage}
            />
          </Box>

          <Box width={'100%'}>
            <LangSelector
              label="Select the target language"
              selected={targetLanguage || undefined}
              onChange={handleSetTargetLanguage}
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

      {step === Steps.INPUT_TRANSLATIONS ? (
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
                {langInfo2String(sourceLanguage || undefined)}
              </Typography>
              <DiArrowRight />
              <Typography
                fontWeight={600}
                color={'text.dark'}
                fontSize={'20px'}
                lineHeight={'28px'}
                paddingLeft={'5px'}
              >
                {langInfo2String(targetLanguage || undefined)}
              </Typography>
            </Box>
            <StyledFilterButton
              onClick={() => {
                setStep(0);
              }}
            />
          </Box>
          <Stack divider={<Divider />} width={'100%'} paddingBottom={'40px'}>
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
          <BottomButtons
            setStep={() => setStep(Steps.GET_LANGUAGES)}
            storeTranslations={storeTranslations}
          ></BottomButtons>
        </>
      ) : (
        <></>
      )}

      {step === Steps.VOTE ? (
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
                {langInfo2String(sourceLanguage || undefined)}
              </Typography>
              <IonIcon icon={arrowForwardOutline}></IonIcon>
              <Typography
                fontWeight={600}
                color={'text.dark'}
                fontSize={'20px'}
                lineHeight={'28px'}
                paddingLeft={'5px'}
              >
                {langInfo2String(targetLanguage || undefined)}
              </Typography>
            </Box>
            <StyledFilterButton
              onClick={() => {
                setStep(0);
              }}
            />
          </Box>
          <Stack divider={<Divider />} width={'100%'}>
            {wordsVotableItems.map((w, i) => (
              <ItemContentListEdit
                key={i}
                item={w}
                onBack={() => setStep(Steps.INPUT_TRANSLATIONS)}
                buttonText="New Definition"
                changeContentValue={() => {}}
                changeContentVotes={handleChangeTranslationVotes}
                addContent={() => {}}
                customTitle={
                  <Typography variant="body1">{w.title.content}</Typography>
                }
              />
            ))}
          </Stack>
          <BottomButtons setStep={() => setStep(Steps.INPUT_TRANSLATIONS)} />
        </>
      ) : (
        <></>
      )}
    </Box>
  );
};
