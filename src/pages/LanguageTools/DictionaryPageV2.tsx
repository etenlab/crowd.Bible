import { MuiMaterial } from '@eten-lab/ui-kit';
import { CrowdBibleUI, Button, FiPlus, Typography } from '@eten-lab/ui-kit';

import { IonContent } from '@ionic/react';
import { useEffect, useState } from 'react';
import useDefinitionService from '../../hooks/useDefinitionService';
const { Box, Divider } = MuiMaterial;

const {
  TitleWithIcon,
  FiltersAndSearch,
  ItemsClickableList,
  SimpleFormDialog,
  ItemContentListEdit,
} = CrowdBibleUI;

type Content = {
  content: string;
  upVote: number;
  downVote: number;
};

type Item = {
  title: Content;
  contents: Content[];
};

type TUpOrDownVote = 'upVote' | 'downVote';

type SetWordVotesParams = {
  titleContent: string;
  upOrDown: TUpOrDownVote;
};

const MOCK_ETHNOLOGUE_OPTIONS = ['Ethnologue1', 'Ethnologue2'];
const MOCK_DICTIONARY: Array<Item> = [
  {
    title: {
      content: 'Word1',
      downVote: 1,
      upVote: 2,
    },
    contents: [
      {
        content: 'some content1',
        upVote: 10,
        downVote: 11,
      },
      {
        content: 'some content11',
        upVote: 10,
        downVote: 11,
      },
    ],
  },
  {
    title: {
      content: 'Word2',
      downVote: 21,
      upVote: 22,
    },
    contents: [
      {
        content: 'some content4',
        upVote: 30,
        downVote: 31,
      },
    ],
  },
  {
    title: {
      content:
        'title content3 title content3 title content3 title content 3title content3',
      downVote: 31,
      upVote: 32,
    },
    contents: [
      {
        content: 'some content4',
        upVote: 30,
        downVote: 31,
      },
    ],
  },
];

const PADDING = 20;

export function DictionaryPageV2() {
  const [words, setWords] = useState([] as Array<Item>);
  const [selectedWord, setSelectedWord] = useState(null as unknown as Item);
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const definitionService = useDefinitionService();

  useEffect(() => {
    setWords(MOCK_DICTIONARY);
  }, []);

  const changeWordVotes = ({ titleContent, upOrDown }: SetWordVotesParams) => {
    const wordIdx = words.findIndex((w) => w.title.content === titleContent);
    words[wordIdx].title[upOrDown] += 1;
    setWords([...words]);
  };

  const addNewWord = (value: string) => {
    setWords([
      ...words,
      {
        title: { content: value, upVote: 0, downVote: 0 },
        contents: [],
      },
    ]);
    setIsDialogOpened(false);
  };

  const changeItemContent = ({
    itemTitleContent, // this is title's, content (type string), i.e. value of the title of the word - using here as uniq id
    contentIndex,
    newContent, // this is another content (type Content), i.e. content of the Item. Don't mix up these 'contents'.
  }: {
    itemTitleContent: string;
    contentIndex: number;
    newContent: Content;
  }) => {
    const itemIdx = words.findIndex(
      (w) => w.title.content === itemTitleContent,
    );

    words[itemIdx].contents[contentIndex] = newContent;

    setWords([...words]);
  };

  const addDefinition = ({
    itemTitleContent, // this is title's, content (type string), i.e. value of the title of the word - using here as uniq id
    newContent: newDefinition, // this is another content (type Content), i.e. content of the Item. Don't mix up these 'contents'.
  }: {
    itemTitleContent: string;
    newContent: Content;
  }) => {
    // local state for testing
    const itemIdx = words.findIndex(
      (ph) => ph.title.content === itemTitleContent,
    );
    if (!definitionService) {
      words[itemIdx].contents.push(newDefinition);
      setWords(words);
      alert(
        'definition service is not ready yet, try in a second (TODO - disable button if not ready )',
      );
      return;
    }

    //use API to change appropriate node

    const newDefinitionNodeId = definitionService.createDefinition(
      newDefinition.content,
      'someLangUUIDHere',
    );
    console.log('[newDefinitionNodeId]', definitionService);
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
            setEthnologue={() => console.log('setEthnologue!')}
            setLanguage={(l: string) => console.log('setLanguage! ' + l)}
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
            title={'Enter new Phrase'}
            isOpened={isDialogOpened}
            handleCancel={() => setIsDialogOpened(false)}
            handleOk={addNewWord}
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
            onBack={() => setSelectedWord(null as unknown as Item)}
            buttonText="New Definition"
            changeContent={changeItemContent}
            addContent={addDefinition}
          />
        </Box>
      )}
    </IonContent>
  );
}
