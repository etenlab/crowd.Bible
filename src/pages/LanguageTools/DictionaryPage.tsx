import { MuiMaterial } from '@eten-lab/ui-kit';
import { CrowdBibleUI, Button, FiPlus, Typography } from '@eten-lab/ui-kit';

import { IonContent, useIonAlert } from '@ionic/react';
import { useCallback, useEffect, useState } from 'react';
import { LanguageDto } from '../../dtos/lang.dto';
import { useDefinitionService } from '../../hooks/useDefinitionService';
import { VotableContent, VotableItem } from '../../services/definition.service';
const { Box, Divider } = MuiMaterial;

const {
  TitleWithIcon,
  ItemsClickableList,
  ItemContentListEdit,
  SimpleFormDialog,
  FiltersAndSearch,
} = CrowdBibleUI;

type TUpOrDownVote = 'upVote' | 'downVote';

type SetWordVotesParams = {
  titleContent: string;
  upOrDown: TUpOrDownVote;
};

const MOCK_ETHNOLOGUE_OPTIONS = ['Ethnologue1', 'Ethnologue2'];

// use as sample and for debugging purposes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MOCK_VOTABLE_ITEM_SAMPLE: Array<VotableItem> = [
  {
    title: {
      content: 'Word1',
      downVote: 1,
      upVote: 2,
      id: '12341234',
    },
    contents: [
      {
        content: 'some content1',
        upVote: 10,
        downVote: 11,
        id: '12341235',
      },
      {
        content: 'some content11',
        upVote: 10,
        downVote: 11,
        id: '12341236',
      },
    ],
  },
  {
    title: {
      content: 'Word2',
      downVote: 21,
      upVote: 22,
      id: '12341237',
    },
    contents: [
      {
        content: 'some content4',
        upVote: 30,
        downVote: 31,
        id: '12341238',
      },
    ],
  },
  {
    title: {
      content:
        'title content3 title content3 title content3 title content 3title content3',
      downVote: 31,
      upVote: 32,
      id: '12341239',
    },
    contents: [
      {
        content: 'some content4',
        upVote: 30,
        downVote: 31,
        id: '12341240',
      },
    ],
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

  const changeWordVotes = ({ titleContent, upOrDown }: SetWordVotesParams) => {
    const wordIdx = words.findIndex((w) => w.title.content === titleContent);
    words[wordIdx].title[upOrDown] += 1;
    setWords([...words]);
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
      const newWordNodeId = await definitionService.createWord(
        word,
        selectedLanguageId,
      );
      setWords([
        ...words,
        {
          title: {
            content: word,
            upVote: 0,
            downVote: 0,
            id: newWordNodeId,
          },
          contents: [],
        },
      ]);
      setIsDialogOpened(false);
    },
    [definitionService, selectedLanguageId, words, presentAlert],
  );

  const changeDefinition = useCallback(
    async ({
      contentIndex,
      newContent,
    }: {
      contentIndex: number;
      newContent: VotableContent;
    }) => {
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
      if (!newContent.id) {
        throw new Error(`!newContent.id: Definition doesn't have an id`);
      }
      const wordIdx = words.findIndex(
        (w) => w.title.id === selectedWord?.title.id,
      );
      await definitionService.updateDefinition(
        newContent.id,
        newContent.content,
      );
      words[wordIdx].contents[contentIndex] = newContent;
      setWords([...words]);
    },
    [definitionService, selectedWord?.title.id, words],
  );

  const addDefinition = useCallback(
    async ({ newContent }: { newContent: VotableContent }) => {
      if (!definitionService) {
        throw new Error(`!definitionService when addDefinition`);
      }
      if (!selectedWord?.title?.id) {
        throw new Error(`There is no selected word to add definition`);
      }
      const wordNodeId = selectedWord?.title?.id;
      const newDefinitionNodeId = await definitionService.createDefinition(
        newContent.content,
        wordNodeId,
      );
      const wordIdx = words.findIndex((word) => word.title.id === wordNodeId);
      const existingDefinition = words[wordIdx].contents.find(
        (d) => d.content === newContent.content,
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
      words[wordIdx].contents.push({
        ...newContent,
        id: newDefinitionNodeId,
      });
      setSelectedWord(words[wordIdx]);
      setWords([...words]);
    },
    [definitionService, presentAlert, selectedWord?.title?.id, words],
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
              setLikeItem={(id) =>
                changeWordVotes({
                  titleContent: id,
                  upOrDown: 'upVote',
                })
              }
              setDislikeItem={(id) =>
                changeWordVotes({
                  titleContent: id,
                  upOrDown: 'downVote',
                })
              }
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
            changeContent={changeDefinition}
            addContent={addDefinition}
          />
        </Box>
      )}
    </IonContent>
  );
}
