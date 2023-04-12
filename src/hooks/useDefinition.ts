import { useCallback } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import { VotableContent, VotableItem } from '../dtos/votable-item.dto';
import { LanguageWithElecitonsDto } from '../dtos/language.dto';
import { useVote } from './useVote';

export function useDefinition(
  itemsType: 'word' | 'phrase',
  setItems: (items: VotableItem[]) => void,
  langs: LanguageWithElecitonsDto[],
  selectedLanguageId: Nanoid | null | undefined,
  setIsDialogOpened: (state: boolean) => void,
) {
  const {
    states: {
      global: { singletons },
    },
    actions: { alertFeedback, setLoadingState },
  } = useAppContext();
  const { getVotesStats, toggleVote } = useVote();

  const definitionService = singletons?.definitionService;

  const addItem = useCallback(
    async (items: VotableItem[], itemText: string) => {
      try {
        if (!definitionService || !selectedLanguageId) {
          throw new Error(
            `!definitionService || !selectedLanguageId when addNewWord`,
          );
        }
        setLoadingState(true);
        const existingItem = items.find((it) => it.title.content === itemText);
        if (existingItem) {
          alertFeedback(
            'info',
            `Such a ${itemsType} already exists. Use existing ${itemsType} to add a new definition, if you want to.`,
          );
          setIsDialogOpened(false);
          return;
        }

        const langWordsElectionId = langs.find(
          (l) => l.id === selectedLanguageId,
        )?.electionWordsId;
        if (!langWordsElectionId) {
          throw new Error(
            `Can't add word to language because language doesn't have electionId`,
          );
        }

        const { wordId, electionId, wordCandidateId } =
          await definitionService.createWordAndDefinitionsElection(
            itemText,
            selectedLanguageId,
            langWordsElectionId,
          );
        setItems([
          ...items,
          {
            title: {
              content: itemText,
              upVotes: 0,
              downVotes: 0,
              id: wordId,
              candidateId: wordCandidateId,
            },
            contents: [],
            contentElectionId: electionId,
          },
        ]);
      } catch (error) {
        console.log(error);
        alertFeedback('error', 'Internal Error!');
      } finally {
        setIsDialogOpened(false);
        setLoadingState(false);
      }
    },
    [
      definitionService,
      selectedLanguageId,
      setLoadingState,
      langs,
      setItems,
      alertFeedback,
      itemsType,
      setIsDialogOpened,
    ],
  );

  const changeItemVotes = useCallback(
    async (
      candidateId: Nanoid | null,
      upOrDown: TUpOrDownVote,
      items: VotableItem[],
    ) => {
      try {
        if (!candidateId) {
          throw new Error(
            '!candidateId : No candidate entry given to change votes',
          );
        }
        setLoadingState(true);
        await toggleVote(candidateId, upOrDown === 'upVote'); // if not upVote, it calculated as false and toggleVote treats false as downVote
        const votes = await getVotesStats(candidateId);
        const wordIdx = items.findIndex(
          (w) => w.title.candidateId === candidateId,
        );
        items[wordIdx].title.upVotes = votes?.upVotes || 0;
        items[wordIdx].title.downVotes = votes?.downVotes || 0;

        setItems([...items]);
      } catch (error) {
        console.log(error);
        alertFeedback('error', 'Internal Error!');
      } finally {
        setLoadingState(false);
      }
    },
    [setLoadingState, toggleVote, getVotesStats, setItems, alertFeedback],
  );

  const addDefinition = useCallback(
    async (
      newContentValue: string,
      items: VotableItem[],
      selectedItem: VotableItem | null,
      setSelectedItem: (item: VotableItem) => void,
    ) => {
      try {
        if (!definitionService) {
          throw new Error(`!definitionService when addDefinition`);
        }
        if (!selectedItem?.title?.id) {
          throw new Error(`There is no selected phrase to add definition`);
        }
        if (!selectedItem.contentElectionId) {
          throw new Error(
            `There is no ElectionId at ${itemsType} id ${selectedItem.title.id}`,
          );
        }
        setLoadingState(true);

        const itemIdx = items.findIndex(
          (phrase) => phrase.title.id === selectedItem.title.id,
        );
        const existingDefinition = items[itemIdx].contents.find(
          (d) => d.content === newContentValue,
        );
        if (existingDefinition) {
          alertFeedback(
            'info',
            `Such a definition already exists. You can vote for the existing definition or enter another one.`,
          );
          setIsDialogOpened(false);
          return;
        }

        const { definitionId, candidateId } =
          await definitionService.createDefinition(
            newContentValue,
            selectedItem.title.id,
            selectedItem.contentElectionId,
          );

        items[itemIdx].contents.push({
          content: newContentValue,
          upVotes: 0,
          downVotes: 0,
          id: definitionId,
          candidateId: candidateId,
        } as VotableContent);
        setSelectedItem(items[itemIdx]);
        setItems([...items]);
      } catch (error) {
        console.log(error);
        alertFeedback('error', 'Internal Error!');
      } finally {
        setIsDialogOpened(false);
        setLoadingState(false);
      }
    },
    [
      definitionService,
      setItems,
      itemsType,
      alertFeedback,
      setIsDialogOpened,
      setLoadingState,
    ],
  );

  const changeDefinitionValue = useCallback(
    async (
      items: VotableItem[],
      selectedItem: VotableItem | null,
      definitionId: Nanoid | null,
      newContentValue: string,
    ) => {
      try {
        if (!selectedItem?.title?.id) {
          throw new Error(
            `!selectedItem?.title?.id: There is no selected word to change definition`,
          );
        }
        if (!definitionService) {
          throw new Error(
            `!definitionService: Definition service is not present`,
          );
        }
        if (!definitionId) {
          throw new Error(`!definitionId: Definition doesn't have an id`);
        }
        const itemIdx = items.findIndex(
          (it) => it.title.id === selectedItem?.title.id,
        );
        await definitionService.updateDefinitionValue(
          definitionId,
          newContentValue,
        );
        const definitionIndex = items[itemIdx].contents.findIndex(
          (d) => d.id === definitionId,
        );
        items[itemIdx].contents[definitionIndex].content = newContentValue;
        setItems([...items]);
      } catch (error) {
        console.log(error);
        alertFeedback('error', 'Internal Error!');
      }
    },
    [alertFeedback, definitionService, setItems],
  );

  const changeDefinitionVotes = useCallback(
    async (
      items: VotableItem[],
      selectedItem: VotableItem | null,
      candidateId: Nanoid | null,
      upOrDown: TUpOrDownVote,
    ) => {
      try {
        if (!selectedItem?.title?.id) {
          throw new Error(
            `!selectedItem?.title?.id: There is no selected ${itemsType} to vote for definition`,
          );
        }
        if (!candidateId) {
          throw new Error(
            `!candidateId: There is no assigned candidateId for this definition`,
          );
        }
        const wordIdx = items.findIndex(
          (w) => w.title.id === selectedItem?.title.id,
        );
        await toggleVote(candidateId, upOrDown === 'upVote'); // if not upVote, it calculated as false and toggleVote treats false as downVote
        const votes = await getVotesStats(candidateId);
        const definitionIndex = items[wordIdx].contents.findIndex(
          (d) => d.candidateId === candidateId,
        );
        if (definitionIndex < 0) {
          throw new Error(
            `Can't find definition by candidateId ${candidateId}`,
          );
        }
        items[wordIdx].contents[definitionIndex] = {
          ...items[wordIdx].contents[definitionIndex],
          upVotes: votes?.upVotes || 0,
          downVotes: votes?.downVotes || 0,
        };
        setItems([...items]);
      } catch (error) {
        console.log(error);
        alertFeedback('error', 'Internal Error!');
      } finally {
        setLoadingState(false);
      }
    },
    [
      toggleVote,
      getVotesStats,
      setItems,
      itemsType,
      alertFeedback,
      setLoadingState,
    ],
  );

  return {
    addItem,
    changeItemVotes,
    addDefinition,
    changeDefinitionValue,
    changeDefinitionVotes,
  };
}
