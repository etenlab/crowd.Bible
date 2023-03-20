import { Autocomplete, Button, FiPlus, Input } from '@eten-lab/ui-kit';
import { CrowdBibleUI } from '@eten-lab/ui-kit';
import { IonContent } from '@ionic/react';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { FiltersAndSearch } from '../local-ui-kit/FiltersAndSearch';
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
      content: 'title content',
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
        content: 'some content122',
        upVote: 10,
        downVote: 11,
      },
    ],
  },
  {
    title: {
      content: 'title content2',
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
];

const PADDING = 20;

export function KeyTermsPage() {
  const [keyTerms, setKeyTerms] = useState([] as Array<Item>);
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
          <Box flex={1} width={1} minWidth={'140px'}>
            <Button
              variant="contained"
              startIcon={<FiPlus />}
              fullWidth
              onClick={() => alert('click!')}
            >
              New Word
            </Button>
          </Box>
        </Box>

        <FiltersAndSearch
          ethnologueOptions={MOCK_ETHNOLOGUE_OPTIONS}
          setEthnologue={() => console.log('setEthnologue!')}
          setLanguage={(l) => console.log('setLanguage! ' + l)}
          setSearch={(s) => console.log('setSearch' + s)}
        />

        <Box display={'flex'} flexDirection="column" width={1}>
          <WordTable
            items={keyTerms}
            label_1="Key Term"
            label_2="Definition"
          ></WordTable>
        </Box>
      </Box>
    </IonContent>
  );
}
