import {
  Dialect,
  Lang,
  LangSelector,
  MuiMaterial,
  Region,
} from '@eten-lab/ui-kit';
import { CrowdBibleUI, Button, FiPlus, Typography } from '@eten-lab/ui-kit';

import { useCallback, useEffect, useState, useMemo } from 'react';
import { VotableItem } from '@/dtos/votable-item.dto';

import { useAppContext } from '@/hooks/useAppContext';
import { useDictionaryTools } from '@/hooks/useDictionaryTools';
import { useTr } from '@/hooks/useTr';

import { NodeTypeConst } from '@/constants/graph.constant';
import { LanguageInfo } from '@eten-lab/ui-kit';
import {
  FeedbackTypes,
  UpOrDownVote,
  VoteTypes,
} from '@/constants/common.constant';

import { PageLayout } from '@/components/Layout';

const { Box, Divider } = MuiMaterial;

const {
  TitleWithIcon,
  ItemsClickableList,
  ItemContentListEdit,
  SimpleFormDialog,
} = CrowdBibleUI;

// use as sample and for debugging purposes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MOCK_VOTABLE_ITEM_SAMPLE: Array<VotableItem> = [
  {
    title: {
      content: 'Phrase1',
      downVotes: 1,
      upVotes: 2,
      id: '12341234',
      candidateId: '23456789',
    },
    contents: [
      {
        content: 'some content1',
        upVotes: 10,
        downVotes: 11,
        id: '12341235',
        candidateId: '23456789',
      },
      {
        content: 'some content11',
        upVotes: 10,
        downVotes: 11,
        id: '12341236',
        candidateId: '23456789',
      },
    ],
    contentElectionId: '3456',
  },
  {
    title: {
      content: 'Phrase2',
      downVotes: 21,
      upVotes: 22,
      id: '12341237',
      candidateId: '23456789',
    },
    contents: [
      {
        content: 'some content4',
        upVotes: 30,
        downVotes: 31,
        id: '12341238',
        candidateId: '23456789',
      },
    ],
    contentElectionId: '3456',
  },
  {
    title: {
      content:
        'title content3 title content3 title content3 title content 3title content3',
      downVotes: 31,
      upVotes: 32,
      id: '12341239',
      candidateId: '23456789',
    },
    contents: [
      {
        content: 'some content4',
        upVotes: 30,
        downVotes: 31,
        id: '12341240',
        candidateId: '23456789',
      },
    ],
    contentElectionId: '3456',
  },
];

const PADDING = 20;

export function PhraseBookPage() {
  const {
    states: {
      global: { singletons },
    },
    actions: { createLoadingStack, alertFeedback },
    logger,
  } = useAppContext();
  const [selectedPhrase, setSelectedPhrase] = useState<VotableItem | null>(
    null,
  );
  const { tr } = useTr();

  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const votableItemsService = singletons?.votableItemsService;
  const [phrases, setPhrases] = useState<VotableItem[]>([]);

  const [selectedLanguageInfo, setSelectedLanguageInfo] = useState<
    LanguageInfo | undefined
  >(undefined);

  const {
    addItem,
    changeItemVotes,
    addDefinition,
    changeDefinitionValue,
    changeDefinitionVotes,
  } = useDictionaryTools(NodeTypeConst.PHRASE, setPhrases, setIsDialogOpened);

  const onChangeLang = useCallback(
    (
      langTag: string, // it isn't needed for now
      selected: {
        lang: Lang;
        dialect: Dialect | undefined;
        region: Region | undefined;
      },
    ): void => {
      setSelectedLanguageInfo(selected);
    },
    [setSelectedLanguageInfo],
  );

  useEffect(() => {
    if (!votableItemsService) return;
    if (!selectedLanguageInfo) return;

    const { startLoading, stopLoading } = createLoadingStack();

    try {
      startLoading();
      const loadPhrases = async () => {
        const phrases: VotableItem[] =
          await votableItemsService.getVotableItems(
            selectedLanguageInfo,
            NodeTypeConst.PHRASE,
          );
        setPhrases(phrases);
      };
      loadPhrases();
    } catch (error) {
      logger.error(error);
      alertFeedback(FeedbackTypes.ERROR, 'Internal Error!');
    } finally {
      stopLoading();
    }
  }, [
    alertFeedback,
    votableItemsService,
    selectedLanguageInfo,
    createLoadingStack,
    logger,
  ]);

  const { startLoading, stopLoading } = useMemo(
    () => createLoadingStack(),
    [createLoadingStack],
  );

  const addPhrase = useCallback(
    (newPhrase: string) => {
      addItem(
        NodeTypeConst.PHRASE,
        phrases,
        newPhrase,
        selectedLanguageInfo || null,
      );
    },
    [addItem, phrases, selectedLanguageInfo],
  );

  const changePhraseDefinition = useCallback(
    (definitionId: Nanoid | null, newValue: string) => {
      changeDefinitionValue(phrases, selectedPhrase, definitionId, newValue);
    },
    [changeDefinitionValue, selectedPhrase, phrases],
  );

  const changePhraseDefinitionVotes = useCallback(
    (ballotId: Nanoid | null, vote: 'upVote' | 'downVote') => {
      const upOrDown: UpOrDownVote =
        vote === 'upVote' ? VoteTypes.UP : VoteTypes.DOWN;
      changeDefinitionVotes(phrases, selectedPhrase, ballotId, upOrDown);
    },
    [changeDefinitionVotes, phrases, selectedPhrase],
  );

  const addDefinitionToPhrase = useCallback(
    (text: string) => {
      addDefinition(text, phrases, selectedPhrase, setSelectedPhrase);
    },
    [addDefinition, phrases, selectedPhrase],
  );

  const handleAddPhraseButtonClick = useCallback(() => {
    if (!selectedLanguageInfo) {
      alertFeedback(
        FeedbackTypes.ERROR,
        'Please select a language before adding a word',
      );
      return;
    }
    setIsDialogOpened(true);
  }, [alertFeedback, selectedLanguageInfo]);

  const handleLoadingState = (loading: boolean) => {
    if (loading) {
      startLoading();
    } else {
      stopLoading();
    }
  };

  return (
    <PageLayout>
      {!selectedPhrase ? (
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'start'}
          alignItems={'start'}
          padding={`${PADDING}px`}
        >
          <Box
            width={1}
            flexDirection={'row'}
            display={'flex'}
            justifyContent={'space-between'}
          >
            <Box flex={3}>
              <TitleWithIcon
                onClose={() => {}}
                onBack={() => {}}
                withBackIcon={false}
                withCloseIcon={false}
                label={tr('Phrase book editor')}
              ></TitleWithIcon>
            </Box>
          </Box>

          <LangSelector
            onChange={onChangeLang}
            setLoadingState={handleLoadingState}
            selected={selectedLanguageInfo}
          ></LangSelector>
          <Box display={'flex'} flexDirection="column" width={1}>
            <Box
              width={1}
              flexDirection={'row'}
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Box flex={3}>
                <Typography variant="subtitle1" color={'text.gray'}>
                  {tr('Phrases')}
                </Typography>
              </Box>
              <Box flex={1} width={1} minWidth={'140px'}>
                <Button
                  variant="contained"
                  startIcon={<FiPlus />}
                  fullWidth
                  onClick={handleAddPhraseButtonClick}
                >
                  {tr('New Phrase')}
                </Button>
              </Box>
            </Box>
            <Divider />
            <ItemsClickableList
              items={phrases}
              setSelectedItem={setSelectedPhrase}
              setLikeItem={(phraseId) =>
                changeItemVotes(phraseId, VoteTypes.UP, phrases)
              }
              setDislikeItem={(phraseId) =>
                changeItemVotes(phraseId, VoteTypes.DOWN, phrases)
              }
            ></ItemsClickableList>
          </Box>
          <SimpleFormDialog
            title={tr('Enter new Phrase')}
            isOpened={isDialogOpened}
            handleCancel={() => setIsDialogOpened(false)}
            handleOk={addPhrase}
          />
        </Box>
      ) : (
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'start'}
          alignItems={'start'}
          padding={`${PADDING}px`}
        >
          <ItemContentListEdit
            item={selectedPhrase}
            onBack={() => setSelectedPhrase(null as unknown as VotableItem)}
            buttonText={tr('New Definition')}
            changeContentValue={changePhraseDefinition}
            changeContentVotes={changePhraseDefinitionVotes}
            addContent={addDefinitionToPhrase}
            isAddable={true}
          />
        </Box>
      )}
    </PageLayout>
  );
}
