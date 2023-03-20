import {
  Autocomplete,
  Button,
  FiPlus,
  Input,
  BiVolumeFull,
} from '@eten-lab/ui-kit';

import { CrowdBibleUI } from '@eten-lab/ui-kit';
import { IonContent } from '@ionic/react';
import { Box, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  ListItemButton,
  ListItemText,
  Typography,
  ListItem,
  IconButton,
  PaletteColor,
} from '@mui/material';

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
  const [selectedTerm, setSelectedTerm] = useState(null as unknown as Item);

  useEffect(() => {
    setPhrases(MOCK_PHRASES);
  }, []);

  return (
    <IonContent>
      {!selectedTerm ? (
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

          <Box
            width={'100%'}
            padding={`${PADDING}px 0 ${PADDING}px`}
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            gap={`${PADDING}px`}
          >
            <Box flex={1}>
              <Autocomplete
                fullWidth
                options={MOCK_ETHNOLOGUE_OPTIONS}
                label="Ethnologue"
              ></Autocomplete>
            </Box>
            <Box flex={1}>
              <Input fullWidth label="Language ID"></Input>
            </Box>
          </Box>
          <Box display={'flex'} flexDirection="column" width={1}>
            <Box width={1} paddingBottom={`${PADDING}px`}>
              <Input fullWidth label="Search..."></Input>
            </Box>

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
            {phrases.map((kt) => (
              <Box display={'flex'} key={kt.title.content}>
                <Box flex={4}>
                  <ListItemButton onClick={() => setSelectedTerm(kt)}>
                    <ListItemText primary={kt.title.content} color="dark" />
                  </ListItemButton>
                </Box>
                <Box display={'flex'} flex={1}>
                  <VoteButtonGroup
                    item
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    like
                    dislike
                    likeCount={kt.title.upVote}
                    dislikeCount={kt.title.downVote}
                    setDislike={() => console.log('dis')}
                    setLike={() => console.log('like')}
                  ></VoteButtonGroup>
                </Box>
              </Box>
            ))}
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
              onBack={() => setSelectedTerm(null as unknown as Item)}
              withBackIcon={true}
              withCloseIcon={false}
              label={selectedTerm.title.content}
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
          {selectedTerm.contents.map(({ content, upVote, downVote }) => (
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
