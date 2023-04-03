import { useCallback } from 'react';
import { useAppContext } from '@/hooks/useAppContext';

export function useVote() {
  const {
    states: {
      global: { singletons, user },
    },
    actions: { alertFeedback },
  } = useAppContext();

  const listElections = useCallback(
    async (tableName: TablesName, rowId: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error!');
        return [];
      }

      try {
        return singletons.votingService.listElections(tableName, rowId);
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        return [];
      }
    },
    [singletons, alertFeedback],
  );

  const getElectionFull = useCallback(
    async (electionId: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error!');
        return [];
      }

      try {
        return singletons.votingService.getElectionFull(electionId);
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        return [];
      }
    },
    [singletons, alertFeedback],
  );

  const createElection = useCallback(
    async (tableName: TablesName, rowId: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error!');
        return null;
      }

      try {
        const electionId = await singletons.votingService.createElection(
          tableName,
          rowId,
        );

        alertFeedback('success', 'Created a new Election!');

        return electionId;
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback],
  );

  const addBallotEntry = useCallback(
    async (electionId: Nanoid, ballotEntryTarget: BallotEntryTarget) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error!');
        return null;
      }

      try {
        const ballotEntryId = await singletons.votingService.addBallotEntry(
          electionId,
          ballotEntryTarget,
        );

        alertFeedback('success', 'Created a new Election!');

        return ballotEntryId;
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback],
  );

  const addVote = useCallback(
    async (ballotEntryId: Nanoid, vote: boolean | null) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error!');
        return null;
      }

      if (!user) {
        alertFeedback('error', 'Not exists log in user!');
        return null;
      }

      try {
        const userDto = await singletons.graphThirdLayerService.createUser(
          user.userEmail,
        );

        const voteId = await singletons.votingService.addVote(
          ballotEntryId,
          userDto.id,
          vote,
        );

        alertFeedback('success', 'Created a new Vote!');

        return voteId;
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, user],
  );

  const toggleVote = useCallback(
    async (ballotEntryId: Nanoid, vote: boolean | null) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error!');
        return null;
      }

      if (!user) {
        alertFeedback('error', 'Not exists log in user!');
        return null;
      }

      try {
        const userDto = await singletons.graphThirdLayerService.createUser(
          user.userEmail,
        );

        const voteEntity = await singletons.votingService.getVote(
          ballotEntryId,
          userDto.id,
        );

        let voteValue: boolean | null;

        if (!voteEntity || voteEntity.vote === null) {
          voteValue = vote;
        } else {
          voteValue = vote === voteEntity.vote ? null : vote;
        }

        return addVote(ballotEntryId, voteValue);
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, user, addVote],
  );

  const getVotesStats = useCallback(
    async (ballotEntryId: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error!');
        return null;
      }

      try {
        return singletons.votingService.getVotesStats(ballotEntryId);
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback],
  );

  const getBallotEntryId = useCallback(
    async (electionId: Nanoid, ballotEntryTarget: BallotEntryTarget) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error!');
        return null;
      }

      try {
        return singletons.votingService.getBallotEntryId(
          electionId,
          ballotEntryTarget,
        );
      } catch (err) {
        console.log(err);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback],
  );

  return {
    createElection,
    listElections,
    getElectionFull,
    getVotesStats,
    addBallotEntry,
    getBallotEntryId,
    toggleVote,
    addVote,
  };
}
