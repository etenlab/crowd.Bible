import { Autocomplete, Button, FiPlus, Input } from '@eten-lab/ui-kit';
import { CrowdBibleUI } from '@eten-lab/ui-kit';
import { IonContent } from '@ionic/react';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { WordTableV2 } from '../local-ui-kit/WordTable-v2';
const { TitleWithIcon, WordTable } = CrowdBibleUI;

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
const MOCK_KEY_TERMS: Array<Item> = [
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

const button = (
  <Button
    variant="contained"
    startIcon={<FiPlus />}
    onClick={() => alert('click!')}
  >
    New Word
  </Button>
);

export function KeyTermsPageV2() {
  const [keyTerms, setKeyTerms] = useState([] as Array<any>);
  useEffect(() => {
    setKeyTerms(MOCK_KEY_TERMS);
  }, []);

  return (
    <IonContent>
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
              label="Key Terms"
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
          <WordTableV2
            items={keyTerms}
            label_1="Phrase"
            label_2={button}
          ></WordTableV2>
        </Box>
      </Box>
    </IonContent>
  );
}
