import { MuiMaterial } from '@eten-lab/ui-kit';
import { CrowdBibleUI, Button, FiPlus, Typography } from '@eten-lab/ui-kit';

import { IonContent } from '@ionic/react';
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

export function DictionaryPageV2() {
  const [selectedWord, setSelectedWord] = useState<VotableItem | null>(null);
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const definitionService = useDefinitionService();
  const [words, setWords] = useState<VotableItem[]>([]);

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
    [selectedLanguageId, definitionService, words],
  );

  const changeDefinition = useCallback(
    ({
      contentIndex,
      newContent,
    }: {
      contentIndex: number;
      newContent: VotableContent;
    }) => {
      if (!selectedWord?.title?.id) {
        throw new Error(`There is no selected word to change definition`);
      }
      const wordIdx = words.findIndex(
        (w) => w.title.id === selectedWord?.title.id,
      );
      words[wordIdx].contents[contentIndex] = newContent;
      setWords([...words]);
    },
    [selectedWord?.title.id, words],
  );

  const addDefinition = async ({
    newContent,
  }: {
    newContent: VotableContent;
  }) => {
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
    words[wordIdx].contents.push({
      ...newContent,
      id: newDefinitionNodeId,
    });
    setWords(words);
  };

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
                  onClick={() => setIsDialogOpened(true)}
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
