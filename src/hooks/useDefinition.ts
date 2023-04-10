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
    actions: { alertFeedback },
  } = useAppContext();
  const { getVotesStats, toggleVote } = useVote();

  const definitionService = singletons?.definitionService;

  const addItem = useCallback(
    async (items: VotableItem[], itemText: string) => {
      if (!definitionService || !selectedLanguageId) {
        throw new Error(
          `!definitionService || !selectedLanguageId when addNewWord`,
        );
      }
      const existingItem = items.find((it) => it.title.content === itemText);
      if (existingItem) {
        alertFeedback(
          'info',
          `Such a ${itemsType} already exists. Use existing ${itemsType} to add a new definition, if you want to.`,
        );
      }

      const langWordsElectionId = langs.find(
        (l) => l.id === selectedLanguageId,
      )?.electionWordsId;
      if (!langWordsElectionId) {
        throw new Error(
          `Can't add word to language because language doesn't have electionId`,
        );
      }

      const { wordId, electionId, wordBallotId } =
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
            ballotId: wordBallotId,
          },
          contents: [],
          contentElectionId: electionId,
        },
      ]);
      setIsDialogOpened(false);
    },
    [
      definitionService,
      selectedLanguageId,
      langs,
      setItems,
      setIsDialogOpened,
      alertFeedback,
      itemsType,
    ],
  );

  const changeItemVotes = useCallback(
    async (
      ballotId: Nanoid | null,
      upOrDown: TUpOrDownVote,
      items: VotableItem[],
    ) => {
      if (!ballotId) {
        throw new Error('!ballotId : No ballot entry given to change votes');
      }
      await toggleVote(ballotId, upOrDown === 'upVote'); // if not upVote, it calculated as false and toggleVote treats false as downVote
      const votes = await getVotesStats(ballotId);
      const wordIdx = items.findIndex((w) => w.title.ballotId === ballotId);
      items[wordIdx].title.upVotes = votes?.upVotes || 0;
      items[wordIdx].title.downVotes = votes?.downVotes || 0;

      setItems([...items]);
    },
    [toggleVote, getVotesStats, setItems],
  );

  const addDefinition = useCallback(
    async (
      newContentValue: string,
      items: VotableItem[],
      selectedItem: VotableItem | null,
      setSelectedItem: (item: VotableItem) => void,
    ) => {
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

      const { definitionId, ballotEntryId } =
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
        ballotId: ballotEntryId,
      } as VotableContent);
      setSelectedItem(items[itemIdx]);
      setItems([...items]);
    },
    [definitionService, setItems, itemsType, alertFeedback, setIsDialogOpened],
  );

  const changeDefinitionValue = useCallback(
    async (
      items: VotableItem[],
      selectedItem: VotableItem | null,
      definitionId: Nanoid | null,
      newContentValue: string,
    ) => {
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
    },
    [definitionService, setItems],
  );

  const changeDefinitionVotes = useCallback(
    async (
      items: VotableItem[],
      selectedItem: VotableItem | null,
      ballotId: Nanoid | null,
      upOrDown: TUpOrDownVote,
    ) => {
      if (!selectedItem?.title?.id) {
        throw new Error(
          `!selectedItem?.title?.id: There is no selected ${itemsType} to vote for definition`,
        );
      }
      if (!ballotId) {
        throw new Error(
          `!ballotId: There is no assigned ballot ID for this definition`,
        );
      }

      const wordIdx = items.findIndex(
        (w) => w.title.id === selectedItem?.title.id,
      );

      await toggleVote(ballotId, upOrDown === 'upVote'); // if not upVote, it calculated as false and toggleVote treats false as downVote
      const votes = await getVotesStats(ballotId);

      const definitionIndex = items[wordIdx].contents.findIndex(
        (d) => d.ballotId === ballotId,
      );

      if (definitionIndex < 0) {
        throw new Error(`Can't find definition by ballotId ${ballotId}`);
      }

      items[wordIdx].contents[definitionIndex] = {
        ...items[wordIdx].contents[definitionIndex],
        upVotes: votes?.upVotes || 0,
        downVotes: votes?.downVotes || 0,
      };
      setItems([...items]);
    },
    [toggleVote, getVotesStats, setItems, itemsType],
  );

  return {
    addItem,
    changeItemVotes,
    addDefinition,
    changeDefinitionValue,
    changeDefinitionVotes,
  };
}
