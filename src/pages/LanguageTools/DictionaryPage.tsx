import { useCallback, useEffect, useState, useMemo } from 'react';

import {
  MuiMaterial,
  Lang,
  Dialect,
  Region,
  LanguageInfo,
  LangSelector,
} from '@eten-lab/ui-kit';
import { CrowdBibleUI, Button, FiPlus, Typography } from '@eten-lab/ui-kit';

import { useAppContext } from '@/hooks/useAppContext';
import { useDictionaryTools } from '@/hooks/useDictionaryTools';
import { useTr } from '@/hooks/useTr';

import { VotableItem } from '@/dtos/votable-item.dto';
import { NodeTypeConst } from '@eten-lab/core';
import {
  FeedbackTypes,
  UpOrDownVote,
  VoteTypes,
} from '@/constants/common.constant';

import { PageLayout } from '@/components/Layout';

const { Box, Divider } = MuiMaterial;

const {
  TitleWithIcon,
  ItemsClickableList,
  ItemContentListEdit,
  SimpleFormDialog,
} = CrowdBibleUI;

// use as sample and for debugging purposes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MOCK_VOTABLE_ITEM_SAMPLE: Array<VotableItem> = [
  {
    title: {
      content: 'Word1',
      downVotes: 1,
      upVotes: 2,
      id: '12341234',
      candidateId: '23456789',
    },
    contents: [
      {
        content: 'some content1',
        upVotes: 10,
        downVotes: 11,
        id: '12341235',
        candidateId: '23456789',
      },
      {
        content: 'some content11',
        upVotes: 10,
        downVotes: 11,
        id: '12341236',
        candidateId: '23456789',
      },
    ],
    contentElectionId: '3456',
  },
  {
    title: {
      content: 'Word2',
      downVotes: 21,
      upVotes: 22,
      id: '12341237',
      candidateId: '23456789',
    },
    contents: [
      {
        content: 'some content4',
        upVotes: 30,
        downVotes: 31,
        id: '12341238',
        candidateId: '23456789',
      },
    ],
    contentElectionId: '3456',
  },
  {
    title: {
      content:
        'title content3 title content3 title content3 title content 3title content3',
      downVotes: 31,
      upVotes: 32,
      id: '12341239',
      candidateId: '23456789',
    },
    contents: [
      {
        content: 'some content4',
        upVotes: 30,
        downVotes: 31,
        id: '12341240',
        candidateId: '23456789',
      },
    ],
    contentElectionId: '3456',
  },
];

const PADDING = 20;

export function DictionaryPage() {
  const {
    states: {
      global: { singletons },
    },
    actions: { createLoadingStack, alertFeedback },
    logger,
  } = useAppContext();
  const { tr } = useTr();

  const [selectedWord, setSelectedWord] = useState<VotableItem | null>(null);
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const [words, setWords] = useState<VotableItem[]>([]);
  const votableItemsService = singletons?.votableItemsService;

  const [selectedLanguageInfo, setSelectedLanguageInfo] = useState<
    LanguageInfo | undefined
  >(undefined);

  const {
    addItem,
    changeItemVotes,
    addDefinition,
    changeDefinitionValue,
    changeDefinitionVotes,
  } = useDictionaryTools(NodeTypeConst.WORD, setWords, setIsDialogOpened);

  const onChangeLang = useCallback(
    (
      langTag: string, // it isn't needed for now
      selected: {
        lang: Lang;
        dialect: Dialect | undefined;
        region: Region | undefined;
      },
    ): void => {
      setSelectedLanguageInfo(selected);
    },
    [setSelectedLanguageInfo],
  );

  useEffect(() => {
    if (!votableItemsService) return;
    if (!selectedLanguageInfo) return;

    const { startLoading, stopLoading } = createLoadingStack();

    try {
      startLoading();
      logger.info({ at: 'DictionaryPage' }, 'load words');
      const loadWords = async () => {
        const words: VotableItem[] = await votableItemsService.getVotableItems(
          selectedLanguageInfo,
          NodeTypeConst.WORD,
        );
        setWords(words);
      };
      loadWords();
    } catch (error) {
      logger.error(error);
      alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
    } finally {
      stopLoading();
    }
  }, [
    alertFeedback,
    selectedLanguageInfo,
    createLoadingStack,
    logger,
    votableItemsService,
  ]);

  const { startLoading, stopLoading } = useMemo(
    () => createLoadingStack(),
    [createLoadingStack],
  );

  const addWord = useCallback(
    (newWord: string) => {
      addItem(NodeTypeConst.WORD, words, newWord, selectedLanguageInfo || null);
    },
    [addItem, selectedLanguageInfo, words],
  );

  const addDefinitionToWord = useCallback(
    (text: string) => {
      addDefinition(text, words, selectedWord, setSelectedWord);
    },
    [addDefinition, selectedWord, words],
  );

  const changeWordDefinition = useCallback(
    (definitionId: Nanoid | null, newValue: string) => {
      changeDefinitionValue(words, selectedWord, definitionId, newValue);
    },
    [changeDefinitionValue, selectedWord, words],
  );

  const changeWordDefinitionVotes = useCallback(
    (candidateId: Nanoid | null, vote: 'upVote' | 'downVote') => {
      const upOrDown: UpOrDownVote =
        vote === 'upVote' ? VoteTypes.UP : VoteTypes.DOWN;
      changeDefinitionVotes(words, selectedWord, candidateId, upOrDown);
    },
    [changeDefinitionVotes, selectedWord, words],
  );

  const handleAddWordButtonClick = useCallback(() => {
    if (!selectedLanguageInfo) {
      alertFeedback(
        FeedbackTypes.ERROR,
        'Please select a language before adding a word',
      );
      return;
    }
    setIsDialogOpened(true);
  }, [alertFeedback, selectedLanguageInfo]);

  const handleLoadingState = (loading: boolean) => {
    if (loading) {
      startLoading();
    } else {
      stopLoading();
    }
  };

  return (
    <PageLayout>
      {!selectedWord ? (
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'start'}
          alignItems={'start'}
          padding={`${PADDING}px`}
        >
          <Box
            width={1}
            flexDirection={'row'}
            display={'flex'}
            justifyContent={'space-between'}
          >
            <Box flex={3}>
              <TitleWithIcon
                onClose={() => {}}
                onBack={() => {}}
                withBackIcon={false}
                withCloseIcon={false}
                label={tr('Dictionary')}
              ></TitleWithIcon>
            </Box>
          </Box>

          <LangSelector
            onChange={onChangeLang}
            setLoadingState={handleLoadingState}
            selected={selectedLanguageInfo}
          ></LangSelector>

          <Box display={'flex'} flexDirection="column" width={1}>
            <Box
              width={1}
              flexDirection={'row'}
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Box flex={3}>
                <Typography variant="subtitle1" color={'text.gray'}>
                  {tr('Words')}
                </Typography>
              </Box>
              <Box flex={1} width={1} minWidth={'140px'}>
                <Button
                  variant="contained"
                  startIcon={<FiPlus />}
                  fullWidth
                  onClick={handleAddWordButtonClick}
                >
                  {tr('New Word')}
                </Button>
              </Box>
            </Box>
            <Divider />
            <ItemsClickableList
              items={words}
              setSelectedItem={setSelectedWord}
              setLikeItem={(wordId) =>
                changeItemVotes(wordId, VoteTypes.UP, words)
              }
              setDislikeItem={(wordId) =>
                changeItemVotes(wordId, VoteTypes.DOWN, words)
              }
            ></ItemsClickableList>
          </Box>
          <SimpleFormDialog
            title={tr('Enter new Word')}
            isOpened={isDialogOpened}
            handleCancel={() => setIsDialogOpened(false)}
            handleOk={(newWord) => addWord(newWord)}
          />
        </Box>
      ) : (
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'start'}
          alignItems={'start'}
          padding={`${PADDING}px`}
        >
          <ItemContentListEdit
            item={selectedWord}
            onBack={() => setSelectedWord(null as unknown as VotableItem)}
            buttonText={tr('New Definition')}
            changeContentValue={changeWordDefinition}
            changeContentVotes={changeWordDefinitionVotes}
            addContent={addDefinitionToWord}
            isAddable={true}
          />
        </Box>
      )}
    </PageLayout>
  );
}
