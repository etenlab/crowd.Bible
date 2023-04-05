import { MuiMaterial } from '@eten-lab/ui-kit';
import { CrowdBibleUI, Button, FiPlus, Typography } from '@eten-lab/ui-kit';

import { IonContent, useIonAlert } from '@ionic/react';
import { useCallback, useEffect, useState } from 'react';
import { LanguageDto } from '@/dtos/language.dto';
import { useDefinitionService } from '@/hooks/useDefinitionService';
import { VotableContent, VotableItem } from '@/services/definition.service';
import { useVote } from '../../hooks/useVote';
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
      ballotId: '23456789',
    },
    contents: [
      {
        content: 'some content1',
        upVotes: 10,
        downVotes: 11,
        id: '12341235',
        ballotId: '23456789',
      },
      {
        content: 'some content11',
        upVotes: 10,
        downVotes: 11,
        id: '12341236',
        ballotId: '23456789',
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
      ballotId: '23456789',
    },
    contents: [
      {
        content: 'some content4',
        upVotes: 30,
        downVotes: 31,
        id: '12341238',
        ballotId: '23456789',
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
      ballotId: '23456789',
    },
    contents: [
      {
        content: 'some content4',
        upVotes: 30,
        downVotes: 31,
        id: '12341240',
        ballotId: '23456789',
      },
    ],
    contentElectionId: '3456',
  },
];

const PADDING = 20;

export function DictionaryPage() {
  const [selectedWord, setSelectedWord] = useState<VotableItem | null>(null);
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const definitionService = useDefinitionService();
  const [words, setWords] = useState<VotableItem[]>([]);
  const [presentAlert] = useIonAlert();

  const [selectedLanguageId, setSelectedLanguageId] = useState<
    string | null | undefined
  >(null);
  const [langs, setLangs] = useState<LanguageDto[]>([]);

  const { getVotesStats, toggleVote } = useVote();

  const handleSelectLanguage = (value: string): void => {
    const id = langs.find((l) => l.name === value)?.id;
    setSelectedLanguageId(id);
  };

  useEffect(() => {
    const loadLanguages = async () => {
      if (!definitionService) return;
      const langDtos = await definitionService.getLanguages();
      setLangs(langDtos);
    };
    loadLanguages();
  }, [definitionService]);

  useEffect(() => {
    if (!definitionService) return;
    if (!selectedLanguageId) return;
    const loadWords = async () => {
      const words: VotableItem[] =
        await definitionService.getWordsAsVotableItems(selectedLanguageId);
      setWords(words);
    };
    loadWords();
  }, [definitionService, selectedLanguageId]);

  const voteContentUp = (ballotId: Nanoid | null) => {
    // const wordIdx = words.findIndex((w) => w.title.content === titleContent);
    // words[wordIdx].title[upOrDown] += 1;
    // setWords([...words]);
  };
  const voteContentDown = (ballotId: Nanoid | null) => {
    // const wordIdx = words.findIndex((w) => w.title.content === titleContent);
    // words[wordIdx].title[upOrDown] += 1;
    // setWords([...words]);
  };

  const addWord = useCallback(
    async (word: string) => {
      if (!definitionService || !selectedLanguageId) {
        throw new Error(
          `!definitionService || !selectedLanguageId when addNewWord`,
        );
      }
      const existingWord = words.find((w) => w.title.content === word);
      if (existingWord) {
        presentAlert({
          header: 'Alert',
          subHeader: 'Such a word already exists!',
          message: 'Use existing word to add a new definition, if you want to.',
          buttons: ['Ok'],
        });
        setIsDialogOpened(false);
        return;
      }
      const { wordId, electionId } =
        await definitionService.createWordAndDefinitionsElection(
          word,
          selectedLanguageId,
        );
      setWords([
        ...words,
        {
          title: {
            content: word,
            upVotes: 0,
            downVotes: 0,
            id: wordId,
            ballotId: null, /// TODO: change when figure out with voting on words
          },
          contents: [],
          contentElectionId: electionId,
        },
      ]);
      setIsDialogOpened(false);
    },
    [definitionService, selectedLanguageId, words, presentAlert],
  );

  const changeDefinitionVotes = useCallback(
    async (ballotId: Nanoid | null, upOrDown: TUpOrDownVote) => {
      if (!selectedWord?.title?.id) {
        throw new Error(
          `!selectedWord?.title?.id: There is no selected word to vote for definition`,
        );
      }
      if (!ballotId) {
        throw new Error(
          `!ballotId: There is no assigned ballot ID for this definition`,
        );
      }

      const wordIdx = words.findIndex(
        (w) => w.title.id === selectedWord?.title.id,
      );

      await toggleVote(ballotId, upOrDown === 'upVote'); // if not upVote, it calculated as false and toggleVote treats false as downVote
      const votes = await getVotesStats(ballotId);

      const definitionIndex = words[wordIdx].contents.findIndex(
        (d) => d.ballotId === ballotId,
      );

      if (definitionIndex < 0) {
        throw new Error(`Can't find definition by ballotId ${ballotId}`);
      }

      words[wordIdx].contents[definitionIndex] = {
        ...words[wordIdx].contents[definitionIndex],
        upVotes: votes?.up || 0,
        downVotes: votes?.down || 0,
      };
      setWords([...words]);
    },
    [getVotesStats, selectedWord?.title.id, toggleVote, words],
  );

  const changeDefinitionValue = useCallback(
    async (definitionId: Nanoid | null, newContentValue: string) => {
      if (!selectedWord?.title?.id) {
        throw new Error(
          `!selectedWord?.title?.id: There is no selected word to change definition`,
        );
      }
      if (!definitionService) {
        throw new Error(
          `!definitionService: Definition service is not present`,
        );
      }
      if (!definitionId) {
        throw new Error(`!definitionId: Definition doesn't have an id`);
      }
      const wordIdx = words.findIndex(
        (w) => w.title.id === selectedWord?.title.id,
      );
      await definitionService.updateDefinitionValue(
        definitionId,
        newContentValue,
      );
      const definitionIndex = words[wordIdx].contents.findIndex(
        (d) => d.id === definitionId,
      );
      words[wordIdx].contents[definitionIndex].content = newContentValue;
      setWords([...words]);
    },
    [definitionService, selectedWord?.title.id, words],
  );

  const addDefinition = useCallback(
    async (newContentValue: string) => {
      if (!definitionService) {
        throw new Error(`!definitionService when addDefinition`);
      }
      if (!selectedWord?.title?.id) {
        throw new Error(`There is no selected word to add definition`);
      }
      if (!selectedWord.contentElectionId) {
        throw new Error(
          `There is no ElectionId at Word id ${selectedWord.title.id}`,
        );
      }

      const wordIdx = words.findIndex(
        (word) => word.title.id === selectedWord.title.id,
      );
      const existingDefinition = words[wordIdx].contents.find(
        (d) => d.content === newContentValue,
      );
      if (existingDefinition) {
        presentAlert({
          header: 'Alert',
          subHeader: 'Such a definition of the word already exists!',
          message:
            'You can vote for the existing definition or enter another one.',
          buttons: ['Ok'],
        });
        setIsDialogOpened(false);
        return;
      }

      const { definitionId, ballotEntryId } =
        await definitionService.createDefinition(
          newContentValue,
          selectedWord.title.id,
          selectedWord.contentElectionId,
        );

      words[wordIdx].contents.push({
        content: newContentValue,
        upVotes: 0,
        downVotes: 0,
        id: definitionId,
        ballotId: ballotEntryId,
      } as VotableContent);
      setSelectedWord(words[wordIdx]);
      setWords([...words]);
    },
    [
      definitionService,
      presentAlert,
      selectedWord?.contentElectionId,
      selectedWord?.title.id,
      words,
    ],
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
              setLikeItem={voteContentUp}
              setDislikeItem={voteContentDown}
            ></ItemsClickableList>
          </Box>
          <SimpleFormDialog
            title={'Enter new Word'}
            isOpened={isDialogOpened}
            handleCancel={() => setIsDialogOpened(false)}
            handleOk={addWord}
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
            changeContentValue={changeDefinitionValue}
            changeContentVotes={changeDefinitionVotes}
            addContent={addDefinition}
          />
        </Box>
      )}
    </IonContent>
  );
}
