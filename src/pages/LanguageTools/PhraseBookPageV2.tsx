import { CrowdBibleUI, Button, FiPlus, BiVolumeFull } from '@eten-lab/ui-kit';

import { IonContent } from '@ionic/react';
import {} from '@mui/material';
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

type SetPhraseVotesParams = {
  titleContent: string;
  upOrDown: 'upVote' | 'downVote';
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

  useEffect(() => {
    setPhrases(MOCK_PHRASES);
  }, []);

  const setPhraseVotes = ({ titleContent, upOrDown }: SetPhraseVotesParams) => {
    const phraseIdx = phrases.findIndex(
      (ph) => ph.title.content === titleContent,
    );
    phrases[phraseIdx].title[upOrDown] += 1;
    setPhrases([...phrases]);
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
                  onClick={() => alert('click!!!')}
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
                setPhraseVotes({
                  titleContent: id,
                  upOrDown: 'upVote',
                })
              }
              setDislikeItem={(id) =>
                setPhraseVotes({
                  titleContent: id,
                  upOrDown: 'downVote',
                })
              }
            ></ItemsClickableList>
          </Box>
        </Box>
      ) : (
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'start'}
          alignItems={'start'}
          padding={`${PADDING}px`}
        >
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
            <TitleWithIcon
              onClose={() => {}}
              onBack={() => setSelectedPhrase(null as unknown as Item)}
              withBackIcon={true}
              withCloseIcon={false}
              label={selectedPhrase.title.content}
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
          {selectedPhrase.contents.map(({ content, upVote, downVote }) => (
            <ListItem
              sx={{
                display: 'list-item',
                padding: 0,
                fontSize: '12px',
                lineHeight: '17px',
              }}
              key={content}
            >
              {content}
              <div>
                <VoteButtonGroup
                  likeCount={upVote}
                  dislikeCount={downVote}
                  like={false}
                  dislike={false}
                />
              </div>
            </ListItem>
          ))}
        </Box>
      )}
    </IonContent>
  );
}
