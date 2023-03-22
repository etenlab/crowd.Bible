import { MuiMaterial } from '@eten-lab/ui-kit';
import { CrowdBibleUI, Button, FiPlus, Typography } from '@eten-lab/ui-kit';

import { IonContent } from '@ionic/react';
import { useEffect, useState } from 'react';
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

type SetPhraseVotesParams = {
  titleContent: string;
  upOrDown: TUpOrDownVote;
};

const MOCK_ETHNOLOGUE_OPTIONS = ['Ethnologue1', 'Ethnologue2'];
const MOCK_PHRASES: Array<Item> = [
  {
    title: {
      content: 'title content title content title content',
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
      content: 'title content2 title content2 title content2',
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

export function PhraseBookPageV2() {
  const [phrases, setPhrases] = useState([] as Array<Item>);
  const [selectedPhrase, setSelectedPhrase] = useState(null as unknown as Item);
  const [isDialogOpened, setIsDialogOpened] = useState(false);

  useEffect(() => {
    setPhrases(MOCK_PHRASES);
  }, []);

  const changePhraseVotes = ({
    titleContent,
    upOrDown,
  }: SetPhraseVotesParams) => {
    const phraseIdx = phrases.findIndex(
      (ph) => ph.title.content === titleContent,
    );
    phrases[phraseIdx].title[upOrDown] += 1;
    setPhrases([...phrases]);
  };

  const addNewPhrase = (value: string) => {
    setPhrases([
      ...phrases,
      {
        title: { content: value, upVote: 0, downVote: 0 },
        contents: [],
      },
    ]);
    setIsDialogOpened(false);
  };

  const changePhraseContent = ({
    itemTitleContent, // this is title's, content (type string), i.e. value of the title of the phrase - using here as uniq id
    contentIndex,
    newContent, // this is another content (type Content), i.e. content of the Item. Don't mix up these 'contents'.
  }: {
    itemTitleContent: string;
    contentIndex: number;
    newContent: Content;
  }) => {
    const phraseIdx = phrases.findIndex(
      (ph) => ph.title.content === itemTitleContent,
    );

    // const newPhrases = [...phrases];
    phrases[phraseIdx].contents[contentIndex] = newContent;

    setPhrases([...phrases]);
  };

  const addPhraseContent = ({
    itemTitleContent, // this is title's, content (type string), i.e. value of the title of the phrase - using here as uniq id
    newContent, // this is another content (type Content), i.e. content of the Item. Don't mix up these 'contents'.
  }: {
    itemTitleContent: string;
    newContent: Content;
  }) => {
    const phraseIdx = phrases.findIndex(
      (ph) => ph.title.content === itemTitleContent,
    );
    // const newPhrases = [...phrases];
    phrases[phraseIdx].contents.push(newContent);
    setPhrases(phrases);
  };

  return (
    <IonContent>
      {!selectedPhrase ? (
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
                label="Phrases"
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
                <Typography variant="subtitle1" sx={{ color: '#8F8F8F' }}>
                  Phrase
                </Typography>
              </Box>
              <Box flex={1} width={1} minWidth={'140px'}>
                <Button
                  variant="contained"
                  startIcon={<FiPlus />}
                  fullWidth
                  onClick={() => setIsDialogOpened(true)}
                >
                  New Phrase
                </Button>
              </Box>
            </Box>
            <Divider />
            <ItemsClickableList
              items={phrases}
              setSelectedItem={setSelectedPhrase}
              setLikeItem={(id) =>
                changePhraseVotes({
                  titleContent: id,
                  upOrDown: 'upVote',
                })
              }
              setDislikeItem={(id) =>
                changePhraseVotes({
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
            handleOk={addNewPhrase}
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
            item={selectedPhrase}
            onBack={() => setSelectedPhrase(null as unknown as Item)}
            buttonText="New Definition"
            changeContent={changePhraseContent}
            addContent={addPhraseContent}
          />
        </Box>
      )}
    </IonContent>
  );
}
