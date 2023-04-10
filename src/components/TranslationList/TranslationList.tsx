import { useState, useEffect } from 'react';

import {
  Tabs,
  Button,
  MuiMaterial,
  Typography,
  useColorModeContext,
  Checkbox,
  BiMessageRounded,
  FiPlus,
  VoteButton,
} from '@eten-lab/ui-kit';

import { Link } from '@/components/Link';

import { useAppContext } from '@/hooks/useAppContext';
import { useWordSequence } from '@/src/hooks/useWordSequence';
import { useVote } from '@/src/hooks/useVote';

import { WordSequenceWithVote } from '@/dtos/word-sequence.dto';

const { Stack, Divider, IconButton } = MuiMaterial;

function Voting({
  vote,
  onChangeVote,
}: {
  vote: VotesStatsRow;
  onChangeVote(): void;
}) {
  const { toggleVote } = useVote();

  const handleToggleVote = async (voteValue: boolean) => {
    await toggleVote(vote.candidateId, voteValue);
    onChangeVote();
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

function Translation({
  translation,
  isCheckbox,
  onChangeVote,
}: {
  translation: WordSequenceWithVote;
  isCheckbox: boolean;
  onChangeVote: (translationId: Nanoid, ballotEntryId: Nanoid) => void;
}) {
  const { id, wordSequence, vote } = translation;

  const { getColor } = useColorModeContext();

  const handleClickDiscussionButton = () => {
    // history.push(`/discussion/table-name/${text}/row/${id}`);
  };

  const checkbox = isCheckbox ? <Checkbox sx={{ marginLeft: '-9px' }} /> : null;

  return (
    <>
      <Stack
        direction="row"
        alignItems="flex-start"
        sx={{ marginBottom: '12px', width: '100%' }}
      >
        {checkbox}
        <Stack gap="3px" sx={{ width: '100%' }}>
          <Typography
            variant="body3"
            sx={{ padding: '9px 0', color: getColor('dark') }}
          >
            {wordSequence}
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Voting
              vote={vote}
              onChangeVote={() => onChangeVote(id, vote.candidateId)}
            />

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
        </Stack>
      </Stack>
      <Divider />
    </>
  );
}

interface TranslationListProps {
  documentId: Nanoid | null;
  wordSequenceId: Nanoid | null;
  isCheckbox?: boolean;
}

export function TranslationList({
  documentId,
  wordSequenceId,
  isCheckbox = true,
}: TranslationListProps) {
  const {
    listTranslationsByDocumentId,
    listTranslationsByWordSequenceId,
    listMyTranslationsByDocumentId,
    listMyTranslationsByWordSequenceId,
  } = useWordSequence();
  const { getVotesStats } = useVote();
  const {
    states: {
      global: { singletons },
    },
  } = useAppContext();
  const [currentTab, setCurrentTab] = useState<'all' | 'mine'>('all');
  const [translations, setTranslations] = useState<WordSequenceWithVote[]>([]);

  useEffect(() => {
    if (!documentId || !singletons) {
      return;
    }

    if (!wordSequenceId) {
      if (currentTab === 'all') {
        listTranslationsByDocumentId(documentId).then(setTranslations);
      } else if (currentTab === 'mine') {
        listMyTranslationsByDocumentId(documentId).then(setTranslations);
      }
    } else {
      if (currentTab === 'all') {
        listTranslationsByWordSequenceId(wordSequenceId).then(setTranslations);
      } else if (currentTab === 'mine') {
        listMyTranslationsByWordSequenceId(wordSequenceId).then(
          setTranslations,
        );
      }
    }
  }, [
    singletons,
    documentId,
    wordSequenceId,
    currentTab,
    listTranslationsByDocumentId,
    listTranslationsByWordSequenceId,
    listMyTranslationsByWordSequenceId,
    listMyTranslationsByDocumentId,
  ]);

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: 'all' | 'mine',
  ) => {
    setCurrentTab(newValue);
  };

  const addMyTranslationComponent =
    currentTab === 'mine' ? (
      <Link to={`/translation-edit/${documentId}/${wordSequenceId}`}>
        <Button
          variant="contained"
          startIcon={<FiPlus />}
          fullWidth
          sx={{ margin: '10px 0' }}
        >
          Add My Translation
        </Button>
      </Link>
    ) : null;

  const handleChangeVote = async (
    translationId: Nanoid,
    ballotEntryId: Nanoid,
  ) => {
    const vote = await getVotesStats(ballotEntryId);

    if (!vote) {
      return;
    }

    setTranslations((translations) =>
      translations.map((translation) => {
        if (translation.id === translationId) {
          return {
            ...translation,
            vote,
          };
        }
        return translation;
      }),
    );
  };

  return (
    <>
      <Tabs
        tabs={[
          { value: 'all', label: 'All Translations' },
          { value: 'mine', label: 'My Translations' },
        ]}
        value={currentTab}
        onChange={handleTabChange}
      />
      {addMyTranslationComponent}

      <Stack sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {translations.map((item) => (
          <Translation
            key={item.id}
            translation={item}
            isCheckbox={isCheckbox}
            onChangeVote={handleChangeVote}
          />
        ))}
      </Stack>
    </>
  );
}
