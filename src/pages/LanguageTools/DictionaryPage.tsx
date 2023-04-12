import { MuiMaterial } from '@eten-lab/ui-kit';
import { CrowdBibleUI, Button, FiPlus, Typography } from '@eten-lab/ui-kit';

import { IonContent, useIonAlert } from '@ionic/react';
import { useCallback, useEffect, useState } from 'react';
import { LanguageWithElecitonsDto } from '@/dtos/language.dto';
import { useAppContext } from '../../hooks/useAppContext';
import { useDefinition } from '../../hooks/useDefinition';
import { VotableItem } from '../../dtos/votable-item.dto';
const { Box, Divider } = MuiMaterial;

const {
  TitleWithIcon,
  ItemsClickableList,
  ItemContentListEdit,
  SimpleFormDialog,
  FiltersAndSearch,
} = CrowdBibleUI;

const MOCK_ETHNOLOGUE_OPTIONS = ['Ethnologue1', 'Ethnologue2'];

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
  } = useAppContext();
  const [selectedWord, setSelectedWord] = useState<VotableItem | null>(null);
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const [words, setWords] = useState<VotableItem[]>([]);
  const [presentAlert] = useIonAlert();
  const definitionService = singletons?.definitionService;

  const [selectedLanguageId, setSelectedLanguageId] = useState<
    string | null | undefined
  >(null);
  const [langs, setLangs] = useState<LanguageWithElecitonsDto[]>([]);
  const {
    addItem,
    changeItemVotes,
    addDefinition,
    changeDefinitionValue,
    changeDefinitionVotes,
  } = useDefinition(
    'word',
    setWords,
    langs,
    selectedLanguageId,
    setIsDialogOpened,
  );

  const handleSelectLanguage = (value: string): void => {
    const id = langs.find((l) => l.name === value)?.id;
    setSelectedLanguageId(id);
  };

  useEffect(() => {
    try {
      setLoadingState(true);
      const loadLanguages = async () => {
        if (!definitionService) return;
        const langDtos = await definitionService.getLanguages();
        setLangs(langDtos);
      };
      loadLanguages();
      setLoadingState(false);
    } catch (error) {
      console.log(error);
      alertFeedback('error', 'Internal Error!');
    } finally {
      setLoadingState(false);
    }
  }, [alertFeedback, definitionService, setLoadingState]);

  useEffect(() => {
    if (!definitionService) return;
    if (!selectedLanguageId) return;
    try {
      setLoadingState(true);
      const langsElectionWordsId = langs.find(
        (l) => l.id === selectedLanguageId,
      )?.electionWordsId;
      if (!langsElectionWordsId) {
        throw new Error(
          `Language id ${selectedLanguageId} does't have electionWordsId to elect words`,
        );
      }
      const loadWords = async () => {
        const words: VotableItem[] =
          await definitionService.getWordsAsVotableItems(
            selectedLanguageId,
            langsElectionWordsId,
          );
        setWords(words);
      };
      loadWords();
    } catch (error) {
      console.log(error);
      alertFeedback('error', 'Internal Error!');
    } finally {
      setLoadingState(false);
    }
  }, [
    alertFeedback,
    definitionService,
    langs,
    selectedLanguageId,
    setLoadingState,
  ]);

  const addWord = (newWord: string) => {
    addItem(words, newWord);
  };

  const changeWordVotes = useCallback(
    (candidateId: Nanoid | null, upOrDown: TUpOrDownVote) => {
      changeItemVotes(candidateId, upOrDown, words);
    },
    [changeItemVotes, words],
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
    (candidateId: Nanoid | null, upOrDown: TUpOrDownVote) => {
      changeDefinitionVotes(words, selectedWord, candidateId, upOrDown);
    },
    [changeDefinitionVotes, selectedWord, words],
  );

  const handleAddWordButtonClick = useCallback(() => {
    if (!selectedLanguageId) {
      presentAlert({
        header: 'Alert',
        subHeader: 'No Language selected!',
        message: 'Before adding a word, select language',
        buttons: ['Ok'],
      });
      return;
    }
    setIsDialogOpened(true);
  }, [presentAlert, selectedLanguageId]);

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

          <FiltersAndSearch
            ethnologueOptions={MOCK_ETHNOLOGUE_OPTIONS}
            languageOptions={langs.map((l) => l.name)}
            setEthnologue={() => console.log('setEthnologue!')}
            setLanguage={handleSelectLanguage}
            setSearch={(s: string) => console.log('setSearch' + s)}
          />
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
              setLikeItem={(ballotId) => changeWordVotes(ballotId, 'upVote')}
              setDislikeItem={(ballotId) =>
                changeWordVotes(ballotId, 'downVote')
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
