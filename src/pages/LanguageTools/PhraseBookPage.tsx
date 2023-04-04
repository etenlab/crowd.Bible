// import { MuiMaterial } from '@eten-lab/ui-kit';
// import { CrowdBibleUI, Button, FiPlus, Typography } from '@eten-lab/ui-kit';

// import { IonContent, useIonAlert } from '@ionic/react';
// import { useCallback, useEffect, useState } from 'react';
// import { LanguageDto } from '@/dtos/language.dto';
// import { useDefinitionService } from '@/hooks/useDefinitionService';
// import { VotableContent, VotableItem } from '@/services/definition.service';
// const { Box, Divider } = MuiMaterial;

// const {
//   TitleWithIcon,
//   ItemsClickableList,
//   ItemContentListEdit,
//   SimpleFormDialog,
//   FiltersAndSearch,
// } = CrowdBibleUI;

// type TUpOrDownVote = 'upVote' | 'downVote';

// type SetPhraseVotesParams = {
//   titleContent: string;
//   upOrDown: TUpOrDownVote;
// };

// const MOCK_ETHNOLOGUE_OPTIONS = ['Ethnologue1', 'Ethnologue2'];

// // use as sample and for debugging purposes
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const MOCK_VOTABLE_ITEM_SAMPLE: Array<VotableItem> = [
//   {
//     title: {
//       content: 'Phrase1',
//       downVotes: 1,
//       upVotes: 2,
//       id: '12341234',
//     },
//     contents: [
//       {
//         content: 'some content1',
//         upVotes: 10,
//         downVotes: 11,
//         id: '12341235',
//       },
//       {
//         content: 'some content11',
//         upVotes: 10,
//         downVotes: 11,
//         id: '12341236',
//       },
//     ],
//   },
//   {
//     title: {
//       content: 'Phrase2',
//       downVotes: 21,
//       upVotes: 22,
//       id: '12341237',
//     },
//     contents: [
//       {
//         content: 'some content4',
//         upVotes: 30,
//         downVotes: 31,
//         id: '12341238',
//       },
//     ],
//   },
//   {
//     title: {
//       content:
//         'title content3 title content3 title content3 title content 3title content3',
//       downVotes: 31,
//       upVotes: 32,
//       id: '12341239',
//     },
//     contents: [
//       {
//         content: 'some content4',
//         upVotes: 30,
//         downVotes: 31,
//         id: '12341240',
//       },
//     ],
//   },
// ];

// const PADDING = 20;

// export function PhraseBookPage() {
//   const [selectedPhrase, setSelectedPhrase] = useState<VotableItem | null>(
//     null,
//   );
//   const [isDialogOpened, setIsDialogOpened] = useState(false);
//   const definitionService = useDefinitionService();
//   const [phrases, setPhrases] = useState<VotableItem[]>([]);
//   const [presentAlert] = useIonAlert();

//   const [selectedLanguageId, setSelectedLanguageId] = useState<
//     string | null | undefined
//   >(null);
//   const [langs, setLangs] = useState<LanguageDto[]>([]);

//   const handleSelectLanguage = (value: string): void => {
//     const id = langs.find((l) => l.name === value)?.id;
//     setSelectedLanguageId(id);
//   };

//   useEffect(() => {
//     const loadLanguages = async () => {
//       if (!definitionService) return;
//       const langDtos = await definitionService.getLanguages();
//       setLangs(langDtos);
//     };
//     loadLanguages();
//   }, [definitionService]);

//   useEffect(() => {
//     if (!definitionService) return;
//     if (!selectedLanguageId) return;
//     const loadPhrases = async () => {
//       const phrases: VotableItem[] =
//         await definitionService.getPhrasesAsVotableItems(selectedLanguageId);
//       setPhrases(phrases);
//     };
//     loadPhrases();
//   }, [definitionService, selectedLanguageId]);

//   const changePhraseVotes = ({
//     titleContent,
//     upOrDown,
//   }: SetPhraseVotesParams) => {
//     const phraseIdx = phrases.findIndex(
//       (w) => w.title.content === titleContent,
//     );
//     phrases[phraseIdx].title[upOrDown] += 1;
//     setPhrases([...phrases]);
//   };

//   const addPhrase = useCallback(
//     async (phrase: string) => {
//       if (!definitionService || !selectedLanguageId) {
//         throw new Error(
//           `!definitionService || !selectedLanguageId when addNewPhrase`,
//         );
//       }
//       const existingPhrase = phrases.find((w) => w.title.content === phrase);
//       if (existingPhrase) {
//         presentAlert({
//           header: 'Alert',
//           subHeader: 'Such a phrase already exists!',
//           message:
//             'Use existing phrase to add a new definition, if you want to.',
//           buttons: ['Ok'],
//         });
//         setIsDialogOpened(false);
//         return;
//       }
//       const newPhraseNodeId = await definitionService.createPhrase(
//         phrase,
//         selectedLanguageId,
//       );
//       setPhrases([
//         ...phrases,
//         {
//           title: {
//             content: phrase,
//             upVotes: 0,
//             downVotes: 0,
//             id: newPhraseNodeId,
//           },
//           contents: [],
//         },
//       ]);
//       setIsDialogOpened(false);
//     },
//     [definitionService, selectedLanguageId, phrases, presentAlert],
//   );

//   const changeDefinition = useCallback(
//     async ({
//       contentIndex,
//       newContent,
//     }: {
//       contentIndex: number;
//       newContent: VotableContent;
//     }) => {
//       if (!selectedPhrase?.title?.id) {
//         throw new Error(
//           `!selectedPhrase?.title?.id: There is no selected phrase to change definition`,
//         );
//       }
//       if (!definitionService) {
//         throw new Error(
//           `!definitionService: Definition service is not present`,
//         );
//       }
//       if (!newContent.id) {
//         throw new Error(`!newContent.id: Definition doesn't have an id`);
//       }
//       const phraseIdx = phrases.findIndex(
//         (w) => w.title.id === selectedPhrase?.title.id,
//       );
//       await definitionService.updateDefinitionValue(
//         newContent.id,
//         newContent.content,
//       );
//       phrases[phraseIdx].contents[contentIndex] = newContent;
//       setPhrases([...phrases]);
//     },
//     [definitionService, selectedPhrase?.title.id, phrases],
//   );

//   const addDefinition = useCallback(
//     async ({ newContent }: { newContent: VotableContent }) => {
//       if (!definitionService) {
//         throw new Error(`!definitionService when addDefinition`);
//       }
//       if (!selectedPhrase?.title?.id) {
//         throw new Error(`There is no selected phrase to add definition`);
//       }
//       const phraseNodeId = selectedPhrase?.title?.id;
//       const { definitionId } = await definitionService.createDefinition(
//         newContent.content,
//         phraseNodeId,
//       );
//       const phraseIdx = phrases.findIndex(
//         (phrase) => phrase.title.id === phraseNodeId,
//       );
//       const existingDefinition = phrases[phraseIdx].contents.find(
//         (d) => d.content === newContent.content,
//       );
//       if (existingDefinition) {
//         presentAlert({
//           header: 'Alert',
//           subHeader: 'Such a definition of the phrase already exists!',
//           message:
//             'You can vote for the existing definition or enter another one.',
//           buttons: ['Ok'],
//         });
//         setIsDialogOpened(false);
//         return;
//       }
//       phrases[phraseIdx].contents.push({
//         ...newContent,
//         id: definitionId,
//       });
//       setSelectedPhrase(phrases[phraseIdx]);
//       setPhrases([...phrases]);
//     },
//     [definitionService, presentAlert, selectedPhrase?.title?.id, phrases],
//   );

//   const handleAddPhraseButtonClick = useCallback(() => {
//     if (!selectedLanguageId) {
//       presentAlert({
//         header: 'Alert',
//         subHeader: 'No Language selected!',
//         message: 'Before adding a phrase, select language',
//         buttons: ['Ok'],
//       });
//       return;
//     }
//     setIsDialogOpened(true);
//   }, [presentAlert, selectedLanguageId]);

//   return (
//     <IonContent>
//       {!selectedPhrase ? (
//         <Box
//           display={'flex'}
//           flexDirection={'column'}
//           justifyContent={'start'}
//           alignItems={'start'}
//           padding={`${PADDING}px`}
//         >
//           <Box
//             width={1}
//             flexDirection={'row'}
//             display={'flex'}
//             justifyContent={'space-between'}
//           >
//             <Box flex={3}>
//               <TitleWithIcon
//                 onClose={() => {}}
//                 onBack={() => {}}
//                 withBackIcon={false}
//                 withCloseIcon={false}
//                 label="Phrase book"
//               ></TitleWithIcon>
//             </Box>
//           </Box>

//           <FiltersAndSearch
//             ethnologueOptions={MOCK_ETHNOLOGUE_OPTIONS}
//             languageOptions={langs.map((l) => l.name)}
//             setEthnologue={() => console.log('setEthnologue!')}
//             setLanguage={handleSelectLanguage}
//             setSearch={(s: string) => console.log('setSearch' + s)}
//           />
//           <Box display={'flex'} flexDirection="column" width={1}>
//             <Box
//               width={1}
//               flexDirection={'row'}
//               display={'flex'}
//               justifyContent={'space-between'}
//               alignItems={'center'}
//             >
//               <Box flex={3}>
//                 <Typography variant="subtitle1" color={'text.gray'}>
//                   Phrases
//                 </Typography>
//               </Box>
//               <Box flex={1} width={1} minWidth={'140px'}>
//                 <Button
//                   variant="contained"
//                   startIcon={<FiPlus />}
//                   fullWidth
//                   onClick={handleAddPhraseButtonClick}
//                 >
//                   New Phrase
//                 </Button>
//               </Box>
//             </Box>
//             <Divider />
//             <ItemsClickableList
//               items={phrases}
//               setSelectedItem={setSelectedPhrase}
//               setLikeItem={(id) =>
//                 changePhraseVotes({
//                   titleContent: id,
//                   upOrDown: 'upVote',
//                 })
//               }
//               setDislikeItem={(id) =>
//                 changePhraseVotes({
//                   titleContent: id,
//                   upOrDown: 'downVote',
//                 })
//               }
//             ></ItemsClickableList>
//           </Box>
//           <SimpleFormDialog
//             title={'Enter new Phrase'}
//             isOpened={isDialogOpened}
//             handleCancel={() => setIsDialogOpened(false)}
//             handleOk={addPhrase}
//           />
//         </Box>
//       ) : (
//         <Box
//           display={'flex'}
//           flexDirection={'column'}
//           justifyContent={'start'}
//           alignItems={'start'}
//           padding={`${PADDING}px`}
//         >
//           <ItemContentListEdit
//             item={selectedPhrase}
//             onBack={() => setSelectedPhrase(null as unknown as VotableItem)}
//             buttonText="New Definition"
//             changeContent={changeDefinition}
//             addContent={addDefinition}
//           />
//         </Box>
//       )}
//     </IonContent>
//   );
// }

export function PhraseBookPage() {
  return <span>PhraseBookPage</span>;
}
