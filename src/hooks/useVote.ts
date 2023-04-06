import { useCallback } from 'react';
import { useAppContext } from '@/hooks/useAppContext';

export function useVote() {
  const {
    states: {
      global: { singletons, user },
    },
    actions: { alertFeedback, setLoadingState },
  } = useAppContext();

  const listElections = useCallback(
    async (tableName: TablesName, rowId: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at listElections');
        return [];
      }

      try {
        setLoadingState(true);
        const result = await singletons.votingService.listElections(
          tableName,
          rowId,
        );
        setLoadingState(false);
        return result;
      } catch (err) {
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return [];
      }
    },
    [singletons, alertFeedback, setLoadingState],
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
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return [];
      }
    },
    [singletons, alertFeedback, setLoadingState],
  );

  const createElection = useCallback(
    async (tableName: TablesName, rowId: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at createElection');
        return null;
      }

      try {
        setLoadingState(true);
        const electionId = await singletons.votingService.createElection(
          tableName,
          rowId,
        );

        setLoadingState(false);
        alertFeedback('success', 'Created a new Election!');

        return electionId;
      } catch (err) {
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState],
  );

  const addBallotEntry = useCallback(
    async (electionId: Nanoid, ballotEntryTarget: BallotEntryTarget) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at addBallotEntry');
        return null;
      }

      try {
        setLoadingState(true);
        const ballotEntryId = await singletons.votingService.addBallotEntry(
          electionId,
          ballotEntryTarget,
        );

        setLoadingState(false);
        alertFeedback('success', 'Created a new Election!');

        return ballotEntryId;
      } catch (err) {
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState],
  );

  const addVote = useCallback(
    async (ballotEntryId: Nanoid, vote: boolean | null) => {
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
        const userDto = await singletons.graphThirdLayerService.createUser(
          user.userEmail,
        );

        const voteId = await singletons.votingService.addVote(
          ballotEntryId,
          userDto.id,
          vote,
        );

        setLoadingState(false);
        alertFeedback('success', 'Created a new Vote!');

        return voteId;
      } catch (err) {
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, user, setLoadingState],
  );

  const toggleVote = useCallback(
    async (ballotEntryId: Nanoid, vote: boolean | null) => {
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

        setLoadingState(false);

        return addVote(ballotEntryId, voteValue);
      } catch (err) {
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, user, addVote, setLoadingState],
  );

  const getVotesStats = useCallback(
    async (ballotEntryId: Nanoid) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at getVotesStats');
        return null;
      }

      try {
        setLoadingState(true);
        const result = await singletons.votingService.getVotesStats(
          ballotEntryId,
        );
        setLoadingState(false);
        return result;
      } catch (err) {
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState],
  );

  const getBallotEntryId = useCallback(
    async (electionId: Nanoid, ballotEntryTarget: BallotEntryTarget) => {
      if (!singletons) {
        alertFeedback('error', 'Internal Error! at getBallotEntryId');
        return null;
      }

      try {
        setLoadingState(true);
        const result = await singletons.votingService.getBallotEntryId(
          electionId,
          ballotEntryTarget,
        );
        setLoadingState(false);
        return result;
      } catch (err) {
        console.log(err);
        setLoadingState(false);
        alertFeedback('error', 'Internal Error!');
        return null;
      }
    },
    [singletons, alertFeedback, setLoadingState],
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
