import { useCallback } from 'react';
import { useAppContext } from '@/hooks/useAppContext';

import { ElectionTypeConst } from '@/constants/voting.constant';

export function useVote() {
  const {
    states: {
      global: { singletons, user },
    },
    actions: { alertFeedback, setLoadingState },
    logger,
  } = useAppContext();

  const createOrFindElection = useCallback(
    async (
      electionType: ElectionTypeConst,
      electionRef: Nanoid,
      refTableName: string,
      candidateRefTableName: string,
    ) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at createOrFindElection');
        return null;
      }

      try {
        setLoadingState(true);
        const electionId = await singletons.votingService.createOrFindElection(
          electionType,
          electionRef,
          refTableName,
          candidateRefTableName,
        );

        setLoadingState(false);
        alertFeedback('success', 'Created a new Election!');

        return electionId;
      } catch (err) {
        logger.error(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState, logger],
  );

  const getElectionById = useCallback(
    async (electionId: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at listElections');
        return null;
      }

      try {
        setLoadingState(true);
        const result = await singletons.votingService.getElectionById(
          electionId,
        );
        setLoadingState(false);
        return result;
      } catch (err) {
        logger.error(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState, logger],
  );

  const getElectionByRef = useCallback(
    async (
      electionType: ElectionTypeConst,
      electionRef: Nanoid,

      refTableName: string,
    ) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at listElections');
        return null;
      }

      try {
        setLoadingState(true);
        const result = await singletons.votingService.getElectionByRef(
          electionType,
          electionRef,
          refTableName,
        );
        setLoadingState(false);
        return result;
      } catch (err) {
        logger.error(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState, logger],
  );

  const getElectionFull = useCallback(
    async (electionId: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at getElectionFull');
        return [];
      }

      try {
        setLoadingState(true);
        const result = await singletons.votingService.getElectionFull(
          electionId,
        );
        setLoadingState(false);
        return result;
      } catch (err) {
        logger.error(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return [];
      }
    },
    [singletons, alertFeedback, setLoadingState, logger],
  );

  const addCandidate = useCallback(
    async (electionId: Nanoid, candidateRef: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at addBallotEntry');
        return null;
      }

      try {
        setLoadingState(true);
        const ballotEntryId = await singletons.votingService.addCandidate(
          electionId,
          candidateRef,
        );

        setLoadingState(false);
        alertFeedback('success', 'Created a new Election!');

        return ballotEntryId;
      } catch (err) {
        logger.error(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState, logger],
  );

  const getCandidateById = useCallback(
    async (electionId: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at listElections');
        return null;
      }

      try {
        setLoadingState(true);
        const result = await singletons.votingService.getCandidateById(
          electionId,
        );
        setLoadingState(false);
        return result;
      } catch (err) {
        logger.error(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState, logger],
  );

  const getCandidateByRef = useCallback(
    async (electionId: Nanoid, candidateRef: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at getBallotEntryId');
        return null;
      }

      try {
        setLoadingState(true);
        const result = await singletons.votingService.getCandidateByRef(
          electionId,
          candidateRef,
        );
        setLoadingState(false);
        return result;
      } catch (err) {
        logger.error(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState, logger],
  );

  const getVotesStats = useCallback(
    async (candidateId: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at getVotesStats');
        return null;
      }

      try {
        setLoadingState(true);
        const result = await singletons.votingService.getVotesStats(
          candidateId,
        );
        setLoadingState(false);
        return result;
      } catch (err) {
        logger.error(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState, logger],
  );

  const addVote = useCallback(
    async (candidateId: Nanoid, vote: boolean | null) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at addVote');
        return null;
      }

      if (!user) {
        alertFeedback('error', 'Not exists log in user!');
        return null;
      }

      try {
        setLoadingState(true);
        const userDto = await singletons.userService.createOrFindUser(
          user.userEmail,
        );

        await singletons.votingService.addVote(candidateId, userDto.id, vote);

        setLoadingState(false);
        alertFeedback('success', 'Created a new Vote!');

        return true;
      } catch (err) {
        logger.error(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, user, setLoadingState, logger],
  );

  const toggleVote = useCallback(
    async (candidateId: Nanoid, vote: boolean | null) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at toggleVote');
        return null;
      }

      if (!user) {
        alertFeedback('error', 'Not exists log in user!');
        return null;
      }

      try {
        setLoadingState(true);
        const userDto = await singletons.userService.createOrFindUser(
          user.userEmail,
        );

        const voteEntity = await singletons.votingService.getVoteByRef(
          candidateId,
          userDto.id,
        );

        let voteValue: boolean | null;

        if (!voteEntity) {
          voteValue = vote;
        } else {
          voteValue = vote === voteEntity.vote ? null : vote;
        }

        await addVote(candidateId, voteValue);
        setLoadingState(false);

        return true;
      } catch (err) {
        logger.error(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, user, addVote, setLoadingState, logger],
  );

  return {
    createOrFindElection,
    getElectionById,
    getElectionByRef,
    getElectionFull,
    addCandidate,
    getCandidateById,
    getCandidateByRef,
    getVotesStats,
    addVote,
    toggleVote,
  };
}
