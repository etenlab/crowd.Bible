import { useCallback } from 'react';
import { useAppContext } from '@/hooks/useAppContext';

import { FeedbackTypes } from '@/constants/common.constant';
import { ElectionTypeConst } from '@eten-lab/core';

export function useVote() {
  const {
    states: {
      global: { singletons, user },
    },
    actions: { alertFeedback, createLoadingStack },
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
        alertFeedback(
          FeedbackTypes.ERROR,
          'Internal Error! at createOrFindElection',
        );
        return null;
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const electionId = await singletons.votingService.createOrFindElection(
          electionType,
          electionRef,
          refTableName,
          candidateRefTableName,
        );

        stopLoading();
        alertFeedback(FeedbackTypes.SUCCESS, 'Created a new Election!');

        return electionId;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, createLoadingStack, logger],
  );

  const getElectionById = useCallback(
    async (electionId: Nanoid) => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at listElections');
        return null;
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const result = await singletons.votingService.getElectionById(
          electionId,
        );
        stopLoading();
        return result;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, createLoadingStack, logger],
  );

  const getElectionByRef = useCallback(
    async (
      electionType: ElectionTypeConst,
      electionRef: Nanoid,

      refTableName: string,
    ) => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at listElections');
        return null;
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const result = await singletons.votingService.getElectionByRef(
          electionType,
          electionRef,
          refTableName,
        );
        stopLoading();
        return result;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, createLoadingStack, logger],
  );

  const getElectionFull = useCallback(
    async (electionId: Nanoid) => {
      if (!singletons) {
        alertFeedback(
          FeedbackTypes.ERROR,
          'Internal Error! at getElectionFull',
        );
        return [];
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const result = await singletons.votingService.getElectionFull(
          electionId,
        );
        stopLoading();
        return result;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return [];
      }
    },
    [singletons, alertFeedback, createLoadingStack, logger],
  );

  const addCandidate = useCallback(
    async (electionId: Nanoid, candidateRef: Nanoid) => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at addBallotEntry');
        return null;
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const ballotEntryId = await singletons.votingService.addCandidate(
          electionId,
          candidateRef,
        );

        stopLoading();
        alertFeedback(FeedbackTypes.SUCCESS, 'Created a new Election!');

        return ballotEntryId;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, createLoadingStack, logger],
  );

  const getCandidateById = useCallback(
    async (electionId: Nanoid) => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at listElections');
        return null;
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const result = await singletons.votingService.getCandidateById(
          electionId,
        );
        stopLoading();
        return result;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, createLoadingStack, logger],
  );

  const getCandidateByRef = useCallback(
    async (electionId: Nanoid, candidateRef: Nanoid) => {
      if (!singletons) {
        alertFeedback(
          FeedbackTypes.ERROR,
          'Internal Error! at getBallotEntryId',
        );
        return null;
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const result = await singletons.votingService.getCandidateByRef(
          electionId,
          candidateRef,
        );
        stopLoading();
        return result;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, createLoadingStack, logger],
  );

  const getVotesStats = useCallback(
    async (candidateId: Nanoid) => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at getVotesStats');
        return null;
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const result = await singletons.votingService.getVotesStats(
          candidateId,
        );
        stopLoading();
        return result;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, createLoadingStack, logger],
  );

  const addVote = useCallback(
    async (candidateId: Nanoid, vote: boolean | null) => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at addVote');
        return null;
      }

      if (!user) {
        alertFeedback(FeedbackTypes.ERROR, 'Not exists log in user!');
        return null;
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const userDto = await singletons.userService.createOrFindUser(
          user.email,
        );

        await singletons.votingService.addVote(candidateId, userDto.id, vote);

        stopLoading();
        alertFeedback(FeedbackTypes.SUCCESS, 'Created a new Vote!');

        return true;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, user, createLoadingStack, logger],
  );

  const toggleVote = useCallback(
    async (candidateId: Nanoid, vote: boolean | null) => {
      if (!singletons) {
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error! at toggleVote');
        return null;
      }

      if (!user) {
        alertFeedback(FeedbackTypes.ERROR, 'Not exists log in user!');
        return null;
      }

      const { startLoading, stopLoading } = createLoadingStack();

      try {
        startLoading();
        const userDto = await singletons.userService.createOrFindUser(user.kid);

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
        stopLoading();

        return true;
      } catch (err) {
        logger.error(err);
        stopLoading();
        alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, user, addVote, createLoadingStack, logger],
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
