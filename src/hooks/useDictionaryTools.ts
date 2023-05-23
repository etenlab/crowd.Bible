import { useCallback } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import { VotableContent, VotableItem } from '../dtos/votable-item.dto';
import { useVote } from './useVote';
import { LanguageInfo } from '@eten-lab/ui-kit';
import { NodeTypeConst } from '../constants/graph.constant';

export function useDictionaryTools(
  itemsType: typeof NodeTypeConst.WORD | typeof NodeTypeConst.PHRASE,
  setItems: (items: VotableItem[]) => void,
  setIsDialogOpened: (state: boolean) => void,
) {
  const {
    states: {
      global: { singletons },
    },
    actions: { alertFeedback, setLoadingState },
    logger,
  } = useAppContext();
  const { getVotesStats, toggleVote } = useVote();

  const definitionService = singletons?.definitionService;

  const addItem = useCallback(
    async (
      type: NodeTypeConst,
      items: VotableItem[],
      itemText: string,
      languageInfo: LanguageInfo | null,
    ) => {
      try {
        if (!definitionService)
          throw new Error(`definitionService not defined`);
        if (!languageInfo) throw new Error(`languageInfo not provided `);
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

        let itemId: Nanoid;

        switch (type) {
          case NodeTypeConst.WORD:
            itemId = await singletons.wordService.createWordOrPhraseWithLang(
              itemText,
              languageInfo,
            );
            break;
          case NodeTypeConst.PHRASE:
            itemId = await singletons.wordService.createWordOrPhraseWithLang(
              itemText,
              languageInfo,
              NodeTypeConst.PHRASE,
            );
            break;
          default:
            alertFeedback('error', `can't add ${type} as votable item`);
            throw new Error(`can't add ${type} as votable item`);
        }
        const { electionId } =
          await singletons.definitionService.createDefinitionsElection(itemId);

        setItems([
          ...items,
          {
            title: {
              content: itemText,
              upVotes: 0,
              downVotes: 0,
              id: itemId,
              candidateId: itemId,
            },
            contents: [],
            contentElectionId: electionId,
          },
        ]);
      } catch (error) {
        logger.error(error);
        alertFeedback('error', 'Internal Error!');
      } finally {
        setIsDialogOpened(false);
        setLoadingState(false);
      }
    },
    [
      definitionService,
      setLoadingState,
      singletons?.definitionService,
      singletons?.wordService,
      setItems,
      alertFeedback,
      itemsType,
      setIsDialogOpened,
      logger,
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
        logger.error(error);
        alertFeedback('error', 'Internal Error!');
      } finally {
        setLoadingState(false);
      }
    },
    [
      setLoadingState,
      toggleVote,
      getVotesStats,
      setItems,
      alertFeedback,
      logger,
    ],
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
        logger.error(error);
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
      logger,
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
        logger.error(error);
        alertFeedback('error', 'Internal Error!');
      }
    },
    [alertFeedback, definitionService, setItems, logger],
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
        logger.error(error);
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
      logger,
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
