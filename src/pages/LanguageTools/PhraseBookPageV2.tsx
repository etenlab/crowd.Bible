import {
  CrowdBibleUI,
  Button,
  FiPlus,
  BiVolumeFull,
  Input,
} from '@eten-lab/ui-kit';

import { IonContent } from '@ionic/react';
import { useEffect, useState } from 'react';
import {
  IconButton,
  PaletteColor,
  Box,
  Divider,
  Typography,
  ListItem,
} from '@mui/material';
import { FiltersAndSearch } from '../../local-ui-kit/FiltersAndSearch';
import { ItemsClickableList } from '../../local-ui-kit/ItemsClickableList';
import { SimpleFormDialog } from '../../local-ui-kit/SimpleFormDialog';
import { DebounceInput } from 'react-debounce-input';

const { TitleWithIcon, VoteButtonGroup } = CrowdBibleUI;

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

type ItemContentListEditProps = {
  item: Item;
  onBack: () => void;
  buttonText: string;
  changeContent: (params: {
    itemTitleContent: string;
    contentIndex: number;
    newContent: Content;
  }) => void;
  addContent: (params: {
    itemTitleContent: string;
    newContent: Content;
  }) => void;
};

function ItemContentListEdit({
  item,
  onBack,
  buttonText,
  changeContent,
  addContent,
}: ItemContentListEditProps) {
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const [itemIdxEditting, setItemIdxEditting] = useState(
    null as unknown as number,
  );

  const changeContentVotes = (idx: number, upOrDown: TUpOrDownVote) => {
    const newContent: Content = {
      ...item.contents[idx],
      [upOrDown]: item.contents[idx][upOrDown] + 1,
    };
    changeContent({
      itemTitleContent: item.title.content,
      contentIndex: idx,
      newContent,
    });
  };

  const addNewContent = (value: string) => {
    const newContent: Content = {
      content: value,
      upVote: 0,
      downVote: 0,
    };
    addContent({ itemTitleContent: item.title.content, newContent });
  };

  const changeContentValue = (idx: number, newContentValue: string) => {
    const newContent: Content = {
      ...item.contents[idx],
      content: newContentValue,
    };
    changeContent({
      itemTitleContent: item.title.content,
      contentIndex: idx,
      newContent,
    });
  };

  return (
    <>
      <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
        <TitleWithIcon
          onClose={() => {}}
          onBack={onBack}
          withBackIcon={true}
          withCloseIcon={false}
          label={item.title.content}
        ></TitleWithIcon>
        <IconButton
          onClick={() => alert('sound!')}
          sx={{
            color: (theme) => (theme.palette.dark as PaletteColor).main,
            margitLeft: '20px',
          }}
        >
          <BiVolumeFull />
        </IconButton>
      </Box>
      {item.contents.map(({ content, upVote, downVote }, idx) => (
        <ListItem
          sx={{
            display: 'list-item',
            padding: 0,
            fontSize: '12px',
            lineHeight: '17px',
          }}
          key={content}
        >
          {itemIdxEditting === idx ? (
            // <Input value={content} onBlur={(v) => changeContentValue(idx, v.target.value)} />
            <DebounceInput
              element={Input}
              debounceTimeout={500}
              value={content}
              onChange={(v) => changeContentValue(idx, v.target.value)}
              onBlur={() => setItemIdxEditting(null as unknown as number)}
            />
          ) : (
            <Typography variant="body1" onClick={() => setItemIdxEditting(idx)}>
              {content}
            </Typography>
          )}
          <div>
            <VoteButtonGroup
              likeCount={upVote}
              dislikeCount={downVote}
              like={false}
              dislike={false}
              setDislike={() => changeContentVotes(idx, 'downVote')}
              setLike={() => changeContentVotes(idx, 'upVote')}
            />
          </div>
        </ListItem>
      ))}
      <Button
        fullWidth
        variant="contained"
        startIcon={<FiPlus />}
        onClick={() => setIsDialogOpened(true)}
      >
        {buttonText}
      </Button>
      <SimpleFormDialog
        title={'Enter new Definition'}
        isOpened={isDialogOpened}
        handleCancel={() => setIsDialogOpened(false)}
        handleOk={(value) => {
          addNewContent(value);
          setIsDialogOpened(false);
        }}
      />
    </>
  );
}
