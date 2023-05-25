import {
  MuiMaterial,
  Lang,
  Dialect,
  Region,
  LanguageInfo,
  LangSelector,
} from '@eten-lab/ui-kit';
import { CrowdBibleUI, Button, FiPlus, Typography } from '@eten-lab/ui-kit';

import { IonContent } from '@ionic/react';
import { useCallback, useEffect, useState } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import { VotableItem } from '@/dtos/votable-item.dto';
import { useDictionaryTools } from '@/hooks/useDictionaryTools';
import { NodeTypeConst } from '@/constants/graph.constant';

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
    actions: { setLoadingState, alertFeedback },
    logger,
  } = useAppContext();
  const [selectedWord, setSelectedWord] = useState<VotableItem | null>(null);
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const [words, setWords] = useState<VotableItem[]>([]);
  const definitionService = singletons?.definitionService;

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
    if (!definitionService) return;
    if (!selectedLanguageInfo) return;
    try {
      setLoadingState(true);
      logger.info({ context: { custom: 'context' } }, 'load words');
      const loadWords = async () => {
        const words: VotableItem[] = await definitionService.getVotableItems(
          selectedLanguageInfo,
          NodeTypeConst.WORD,
        );
        setWords(words);
      };
      loadWords();
    } catch (error) {
      logger.error(error);
      alertFeedback('error', 'Internal Error!');
    } finally {
      setLoadingState(false);
    }
  }, [
    alertFeedback,
    definitionService,
    selectedLanguageInfo,
    setLoadingState,
    logger,
  ]);

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const changeWordDefinitionVotes = useCallback(
    (candidateId: Nanoid | null, upOrDown: TUpOrDownVote) => {
      changeDefinitionVotes(words, selectedWord, candidateId, upOrDown);
    },
    [changeDefinitionVotes, selectedWord, words],
  );

  const handleAddWordButtonClick = useCallback(() => {
    if (!selectedLanguageInfo) {
      alertFeedback('error', 'Please select a language before adding a word');
      return;
    }
    setIsDialogOpened(true);
  }, [alertFeedback, selectedLanguageInfo]);

  return (
    <IonContent>
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
                label="Dictionary"
              ></TitleWithIcon>
            </Box>
          </Box>

          <LangSelector
            onChange={onChangeLang}
            setLoadingState={setLoadingState}
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
                  Words
                </Typography>
              </Box>
              <Box flex={1} width={1} minWidth={'140px'}>
                <Button
                  variant="contained"
                  startIcon={<FiPlus />}
                  fullWidth
                  onClick={handleAddWordButtonClick}
                >
                  New Word
                </Button>
              </Box>
            </Box>
            <Divider />
            <ItemsClickableList
              items={words}
              setSelectedItem={setSelectedWord}
              setLikeItem={(wordId) => changeItemVotes(wordId, 'upVote', words)}
              setDislikeItem={(wordId) =>
                changeItemVotes(wordId, 'downVote', words)
              }
            ></ItemsClickableList>
          </Box>
          <SimpleFormDialog
            title={'Enter new Word'}
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
            buttonText="New Definition"
            changeContentValue={changeWordDefinition}
            changeContentVotes={changeWordDefinitionVotes}
            addContent={addDefinitionToWord}
          />
        </Box>
      )}
    </IonContent>
  );
}
