import { MuiMaterial } from '@eten-lab/ui-kit';
import { CrowdBibleUI, Button, FiPlus, Typography } from '@eten-lab/ui-kit';

import { IonContent, useIonAlert } from '@ionic/react';
import { useCallback, useEffect, useState } from 'react';
import { LanguageWithElecitonsDto } from '@/dtos/language.dto';
import { VotableItem } from '../../dtos/votable-item.dto';
import { useAppContext } from '../../hooks/useAppContext';
import { useDefinition } from '../../hooks/useDefinition';
const { Box, Divider } = MuiMaterial;

const {
  TitleWithIcon,
  ItemsClickableList,
  ItemContentListEdit,
  SimpleFormDialog,
  FiltersAndSearch,
} = CrowdBibleUI;

const MOCK_ETHNOLOGUE_OPTIONS = ['Ethnologue1', 'Ethnologue2'];

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
  } = useAppContext();

  const [selectedPhrase, setSelectedPhrase] = useState<VotableItem | null>(
    null,
  );
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const definitionService = singletons?.definitionService;
  const [phrases, setPhrases] = useState<VotableItem[]>([]);
  const [presentAlert] = useIonAlert();

  const [selectedLanguageId, setSelectedLanguageId] = useState<
    string | null | undefined
  >(null);
  const [langs, setLangs] = useState<LanguageWithElecitonsDto[]>([]);

  const handleSelectLanguage = (value: string): void => {
    const id = langs.find((l) => l.name === value)?.id;
    setSelectedLanguageId(id);
  };

  const {
    addItem,
    changeItemVotes,
    addDefinition,
    changeDefinitionVotes,
    changeDefinitionValue,
  } = useDefinition(
    'phrase',
    setPhrases,
    langs,
    selectedLanguageId,
    setIsDialogOpened,
  );

  useEffect(() => {
    const loadLanguages = async () => {
      if (!definitionService) return;
      const langDtos = await definitionService.getLanguages();
      setLangs(langDtos);
    };
    loadLanguages();
  }, [definitionService]);

  useEffect(() => {
    if (!definitionService) return;
    if (!selectedLanguageId) return;
    const langSlectionPhrasesId = langs.find(
      (l) => l.id === selectedLanguageId,
    )?.electionPhrasesId;
    if (!langSlectionPhrasesId) {
      throw new Error(
        `Language id ${selectedLanguageId} does't have electionWordsId to elect words`,
      );
    }
    const loadPhrases = async () => {
      const phrases: VotableItem[] =
        await definitionService.getPhrasesAsVotableItems(
          selectedLanguageId,
          langSlectionPhrasesId,
        );
      setPhrases(phrases);
    };
    loadPhrases();
  }, [definitionService, langs, selectedLanguageId]);

  const addPhrase = (newPhrase: string) => {
    addItem(phrases, newPhrase);
  };

  const changePhraseVotes = useCallback(
    (ballotId: Nanoid | null, upOrDown: TUpOrDownVote) => {
      changeItemVotes(ballotId, upOrDown, phrases);
    },
    [changeItemVotes, phrases],
  );

  const changePhraseDefinition = useCallback(
    (definitionId: Nanoid | null, newValue: string) => {
      changeDefinitionValue(phrases, selectedPhrase, definitionId, newValue);
    },
    [changeDefinitionValue, selectedPhrase, phrases],
  );

  const changePhraseDefinitionVotes = useCallback(
    (ballotId: Nanoid | null, upOrDown: TUpOrDownVote) => {
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
    if (!selectedLanguageId) {
      presentAlert({
        header: 'Alert',
        subHeader: 'No Language selected!',
        message: 'Before adding a phrase, select language',
        buttons: ['Ok'],
      });
      return;
    }
    setIsDialogOpened(true);
  }, [presentAlert, selectedLanguageId]);

  return (
    <IonContent>
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
                label="Phrase book editor"
              ></TitleWithIcon>
            </Box>
          </Box>

          <FiltersAndSearch
            ethnologueOptions={MOCK_ETHNOLOGUE_OPTIONS}
            languageOptions={langs.map((l) => l.name)}
            setEthnologue={() => console.log('setEthnologue!')}
            setLanguage={handleSelectLanguage}
            setSearch={(s: string) => console.log('setSearch' + s)}
          />
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
                  Phrases
                </Typography>
              </Box>
              <Box flex={1} width={1} minWidth={'140px'}>
                <Button
                  variant="contained"
                  startIcon={<FiPlus />}
                  fullWidth
                  onClick={handleAddPhraseButtonClick}
                >
                  New Phrase
                </Button>
              </Box>
            </Box>
            <Divider />
            {/* <ItemsClickableList
              items={phrases}
              setSelectedItem={setSelectedPhrase}
              setLikeItem={(ballotId) => changePhraseVotes(ballotId, 'upVote')}
              setDislikeItem={(ballotId) =>
                changePhraseVotes(ballotId, 'downVote')
              }
            ></ItemsClickableList> */}
          </Box>
          <SimpleFormDialog
            title={'Enter new Phrase'}
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
          {/* <ItemContentListEdit
            item={selectedPhrase}
            onBack={() => setSelectedPhrase(null as unknown as VotableItem)}
            buttonText="New Definition"
            changeContentValue={changePhraseDefinition}
            changeContentVotes={changePhraseDefinitionVotes}
            addContent={addDefinitionToPhrase}
          /> */}
        </Box>
      )}
    </IonContent>
  );
}
