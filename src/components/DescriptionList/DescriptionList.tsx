import { ChangeEventHandler } from 'react';

import {
  MuiMaterial,
  Typography,
  useColorModeContext,
  BiMessageRounded,
  VoteButton,
  Radio,
} from '@eten-lab/ui-kit';

const { Stack, Divider, IconButton } = MuiMaterial;

// const descriptions: DescriptionItem[] = [
//   {
//     id: '1',
//     content:
//       'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
//     vote: {
//       upVotes: 42,
//       downVotes: 15,
//     },
//     creator: 'ABC',
//   },
//   {
//     id: '2',
//     content:
//       'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
//     vote: {
//       upVotes: 42,
//       downVotes: 15,
//     },
//     creator: 'ABC',
//   },
//   {
//     id: '3',
//     content:
//       'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
//     vote: {
//       upVotes: 42,
//       downVotes: 15,
//     },
//     creator: 'ABC',
//   },
//   {
//     id: '4',
//     content:
//       'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
//     vote: {
//       upVotes: 42,
//       downVotes: 15,
//     },
//     creator: 'ABC',
//   },
//   {
//     id: '5',
//     content:
//       'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
//     vote: {
//       upVotes: 42,
//       downVotes: 15,
//     },
//     creator: 'ABC',
//   },
//   {
//     id: '6',
//     content:
//       'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
//     vote: {
//       upVotes: 42,
//       downVotes: 15,
//     },
//     creator: 'ABC',
//   },
//   {
//     id: '7',
//     content:
//       'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
//     vote: {
//       upVotes: 42,
//       downVotes: 15,
//     },
//     creator: 'ABC',
//   },
// ];

function Voting({
  vote,
  onChangeVote,
}: {
  vote: {
    upVotes: number;
    downVotes: number;
    candidateId: string;
  };
  onChangeVote(candidateId: Nanoid, voteValue: boolean): void;
}) {
  const handleToggleVote = async (voteValue: boolean) => {
    onChangeVote(vote.candidateId, voteValue);
  };

  return (
    <Stack direction="row" gap="20px">
      <VoteButton count={vote.upVotes} onClick={() => handleToggleVote(true)} />
      <VoteButton
        isLike={false}
        count={vote.downVotes}
        onClick={() => handleToggleVote(false)}
      />
    </Stack>
  );
}

export type DescriptionItem = {
  id: string;
  title?: string;
  description?: string;
  vote: {
    upVotes: number;
    downVotes: number;
    candidateId: string;
  };
};

type DescriptionProps = {
  content: DescriptionItem;
  checked?: boolean;
  onSelectRadio?: (id: string) => void;
  onClickDiscussionBtn(): void;
  onChangeVote(candidateId: Nanoid, voteValue: boolean): void;
};

function Description({
  content,
  checked,
  onSelectRadio,
  onClickDiscussionBtn,
  onChangeVote,
}: DescriptionProps) {
  const { getColor } = useColorModeContext();

  const { id, title, description, vote } = content;

  const handleChangeRadio: ChangeEventHandler<HTMLInputElement> = (event) => {
    onSelectRadio!(event.target.value);
  };

  const radioCom =
    checked !== undefined ? (
      <Radio
        sx={{ marginLeft: '-9px' }}
        checked={checked}
        onChange={handleChangeRadio}
        value={id}
        name="site-text-translation-radio-button"
      />
    ) : null;

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      sx={{ marginBottom: '12px', width: '100%' }}
    >
      {radioCom}
      <Stack gap="3px" sx={{ width: '100%' }}>
        <Typography
          variant="subtitle1"
          sx={{ padding: '9px 0', color: getColor('dark') }}
        >
          {title}
        </Typography>
        <Typography
          variant="body3"
          sx={{ padding: '9px 0', color: getColor('dark') }}
        >
          {description}
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Voting vote={vote} onChangeVote={onChangeVote} />

          <IconButton onClick={onClickDiscussionBtn}>
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
            Name
          </Typography>
        </Stack>
      </Stack>
      <Divider />
    </Stack>
  );
}

type DescriptionListProps = {
  items: DescriptionItem[];
  checkedId?: Nanoid;
  onSelectRadio?: (descriptionId: string) => void;
  onClickDiscussionBtn(descriptionId: Nanoid): void;
  onChangeVote(candidateId: Nanoid, voteValue: boolean): void;
};

export function DescriptionList({
  items,
  checkedId,
  onSelectRadio,
  onClickDiscussionBtn,
  onChangeVote,
}: DescriptionListProps) {
  return (
    <Stack sx={{ padding: '20px' }}>
      <Typography variant="overline" sx={{ opacity: 0.5 }}>
        List of Candidates
      </Typography>

      {items.map((item) => (
        <Description
          key={item.id}
          content={item}
          checked={item.id === checkedId}
          onSelectRadio={onSelectRadio}
          onClickDiscussionBtn={() => onClickDiscussionBtn(item.id)}
          onChangeVote={onChangeVote}
        />
      ))}
    </Stack>
  );
}
