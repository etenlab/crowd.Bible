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
  vote?: {
    upVotes: number;
    downVotes: number;
    candidateId: string;
  };
};

type DescriptionProps = {
  content: DescriptionItem;
  radioBtn?: {
    checkedId: Nanoid | null;
    onSelectRadio: (descriptionId: string) => void;
  };
  discussionBtn?: {
    onClickDiscussionBtn(descriptionId: Nanoid): void;
  };
  voteBtn?: {
    onChangeVote(
      candidateId: Nanoid,
      voteValue: boolean,
      descriptionId: Nanoid,
    ): void;
  };
  onClick?: () => void;
};

function Description({
  content,
  radioBtn,
  discussionBtn,
  voteBtn,
  onClick,
}: DescriptionProps) {
  const { getColor } = useColorModeContext();

  const { id, title, description, vote } = content;

  const handleChangeRadio: ChangeEventHandler<HTMLInputElement> = (event) => {
    radioBtn?.onSelectRadio!(event.target.value);
  };

  const radioCom = radioBtn ? (
    <Radio
      sx={{ marginLeft: '-9px' }}
      checked={radioBtn.checkedId === content.id}
      onChange={handleChangeRadio}
      value={id}
      name="site-text-translation-radio-button"
    />
  ) : null;

  const titleCom = title ? (
    <Typography
      variant="subtitle1"
      sx={{ padding: '9px 0', color: getColor('dark') }}
    >
      {title}
    </Typography>
  ) : null;

  const voteCom =
    vote && voteBtn ? (
      <Voting
        vote={vote}
        onChangeVote={(candidateId: Nanoid, voteValue: boolean) =>
          voteBtn.onChangeVote(candidateId, voteValue, id)
        }
      />
    ) : null;

  const discussionCom = discussionBtn ? (
    <IconButton onClick={() => discussionBtn.onClickDiscussionBtn(content.id)}>
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
  ) : null;

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      sx={{ marginBottom: '12px', width: '100%' }}
    >
      {radioCom}
      <Stack gap="3px" sx={{ width: '100%' }}>
        {titleCom}
        <Typography
          variant="body3"
          sx={{
            padding: '9px 0',
            color: getColor('dark'),
            cursor: onClick ? 'pointer' : 'inherit',
          }}
          onClick={onClick}
        >
          {description}
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {voteCom}
          {discussionCom}
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
  title: string;
  items: DescriptionItem[];
  radioBtn?: {
    checkedId: Nanoid | null;
    onSelectRadio: (descriptionId: string) => void;
  };
  discussionBtn?: {
    onClickDiscussionBtn(descriptionId: Nanoid): void;
  };
  voteBtn?: {
    onChangeVote(
      candidateId: Nanoid,
      voteValue: boolean,
      descriptionId: Nanoid,
    ): void;
  };
  onClickRow?: (descriptionId: Nanoid) => void;
};

export function DescriptionList({
  title,
  items,
  radioBtn,
  discussionBtn,
  voteBtn,
  onClickRow,
}: DescriptionListProps) {
  return (
    <Stack sx={{ padding: '20px' }}>
      <Typography variant="overline" sx={{ opacity: 0.5 }}>
        {title}
      </Typography>

      {items.map((item) => (
        <Description
          key={item.id}
          content={item}
          radioBtn={radioBtn}
          discussionBtn={discussionBtn}
          voteBtn={voteBtn}
          onClick={() => {
            onClickRow && onClickRow(item.id);
          }}
        />
      ))}
    </Stack>
  );
}
