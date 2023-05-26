import { useState, useEffect, useCallback } from 'react';

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
import { useWordSequence } from '@/hooks/useWordSequence';
import { useVote } from '@/hooks/useVote';
import { useTranslation } from '@/hooks/useTranslation';

import {
  WordSequenceDto,
  WordSequenceTranslationDto,
} from '@/dtos/word-sequence.dto';

import { RouteConst } from '@/constants/route.constant';

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
}: {
  translation: WordSequenceTranslationDto;
  isCheckbox: boolean;
}) {
  const { translationId, candidateId } = translation;

  const { getColor } = useColorModeContext();
  const { getWordSequenceById } = useWordSequence();
  const { getVotesStats } = useVote();
  const {
    states: {
      global: { singletons },
    },
  } = useAppContext();

  const [translatedWordSequence, setTranslatedWordSequence] =
    useState<WordSequenceDto | null>(null);

  const [voteStats, setVoteStats] = useState<VotesStatsRow | null>(null);

  const reloadTranslation = useCallback(async () => {
    if (!singletons) {
      return;
    }

    const wordSequence = await getWordSequenceById(translationId);
    setTranslatedWordSequence(wordSequence);
    const _voteStats = await getVotesStats(candidateId);
    setVoteStats(_voteStats);
  }, [
    singletons,
    candidateId,
    getVotesStats,
    translationId,
    getWordSequenceById,
  ]);

  useEffect(() => {
    reloadTranslation();
  }, [reloadTranslation]);

  const handleClickDiscussionButton = () => {
    // history.push(`/discussion/table-name/${text}/row/${id}`);
  };

  const handleChangeVote = () => {
    reloadTranslation();
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
            {translatedWordSequence?.text || 'No Translation Exists'}
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {voteStats ? (
              <Voting vote={voteStats} onChangeVote={handleChangeVote} />
            ) : null}
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
  const { listTranslationsByWordSequenceId } = useTranslation();
  const {
    states: {
      global: { singletons },
    },
  } = useAppContext();
  const [currentTab, setCurrentTab] = useState<'all' | 'mine'>('all');
  const [translations, setTranslations] = useState<
    WordSequenceTranslationDto[]
  >([]);

  useEffect(() => {
    if (!documentId || !singletons) {
      return;
    }

    if (!wordSequenceId) {
      // if (currentTab === 'all') {
      //   listTranslationsByDocumentId(documentId).then(setTranslations);
      // } else if (currentTab === 'mine') {
      //   listMyTranslationsByDocumentId(documentId).then(setTranslations);
      // }
    } else {
      if (currentTab === 'all') {
        listTranslationsByWordSequenceId(wordSequenceId).then(setTranslations);
      } else if (currentTab === 'mine') {
        listTranslationsByWordSequenceId(wordSequenceId, true).then(
          setTranslations,
        );
      }
    }
  }, [
    singletons,
    documentId,
    wordSequenceId,
    currentTab,
    listTranslationsByWordSequenceId,
  ]);

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: 'all' | 'mine',
  ) => {
    setCurrentTab(newValue);
  };

  const addMyTranslationComponent =
    currentTab === 'mine' ? (
      <Link
        to={`${RouteConst.TRANSLATION_EDIT}/${documentId}/${wordSequenceId}`}
      >
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
            key={item.translationId}
            translation={item}
            isCheckbox={isCheckbox}
          />
        ))}
      </Stack>
    </>
  );
}
