import {
  MuiMaterial,
  Typography,
  useColorModeContext,
  BiMessageRounded,
  VoteButton,
} from '@eten-lab/ui-kit';

const { Stack, Divider, IconButton } = MuiMaterial;

type DescriptionItem = {
  id: string;
  content: string;
  vote: {
    upVotes: number;
    downVotes: number;
  };
  creator: string;
};

const descriptions: DescriptionItem[] = [
  {
    id: '1',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    vote: {
      upVotes: 42,
      downVotes: 15,
    },
    creator: 'ABC',
  },
  {
    id: '2',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    vote: {
      upVotes: 42,
      downVotes: 15,
    },
    creator: 'ABC',
  },
  {
    id: '3',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    vote: {
      upVotes: 42,
      downVotes: 15,
    },
    creator: 'ABC',
  },
  {
    id: '4',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    vote: {
      upVotes: 42,
      downVotes: 15,
    },
    creator: 'ABC',
  },
  {
    id: '5',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    vote: {
      upVotes: 42,
      downVotes: 15,
    },
    creator: 'ABC',
  },
  {
    id: '6',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    vote: {
      upVotes: 42,
      downVotes: 15,
    },
    creator: 'ABC',
  },
  {
    id: '7',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    vote: {
      upVotes: 42,
      downVotes: 15,
    },
    creator: 'ABC',
  },
];

function Voting({
  vote,
}: {
  vote: {
    upVotes: number;
    downVotes: number;
  };
}) {
  return (
    <Stack direction="row" gap="20px">
      <VoteButton count={vote.upVotes} onClick={() => console.log('Clicked')} />
      <VoteButton
        isLike={false}
        count={vote.downVotes}
        onClick={() => console.log('Clicked')}
      />
    </Stack>
  );
}

function Description({ description }: { description: DescriptionItem }) {
  const { content, vote, creator } = description;

  const { getColor } = useColorModeContext();

  const handleClickDiscussionButton = () => {
    // history.push(`/discussion/table-name/${text}/row/${id}`);
  };

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      sx={{ marginBottom: '12px', width: '100%' }}
    >
      <Stack gap="3px" sx={{ width: '100%' }}>
        <Typography
          variant="body3"
          sx={{ padding: '9px 0', color: getColor('dark') }}
        >
          {content}
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Voting vote={vote} />

          <IconButton onClick={handleClickDiscussionButton}>
            <BiMessageRounded
              style={{
                padding: '5px',
                borderRadius: '4px',
                background: getColor('light-blue'),
                color: getColor('gray'),
                fontSize: '26px',
              }}
            />
          </IconButton>
        </Stack>
        <Stack direction="row" gap="5px">
          <Typography
            variant="body3"
            sx={{ padding: '9px 0', color: getColor('gray') }}
          >
            Translation by
          </Typography>
          <Typography
            variant="body3"
            sx={{
              padding: '9px 0',
              color: getColor('blue-primary'),
              textDecoration: 'underline',
            }}
          >
            {creator}
          </Typography>
        </Stack>
      </Stack>
      <Divider />
    </Stack>
  );
}

export function DescriptionList() {
  return (
    <Stack sx={{ padding: '20px' }}>
      <Typography variant="overline" sx={{ opacity: 0.5 }}>
        List of Candidates
      </Typography>

      {descriptions.map((item) => (
        <Description key={item.id} description={item} />
      ))}
    </Stack>
  );
}
