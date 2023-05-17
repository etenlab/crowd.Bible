// import { ChangeEventHandler, useState, useCallback, useEffect } from 'react';
// import { useHistory, useParams } from 'react-router-dom';
// import { IonContent } from '@ionic/react';
// import { useDebounce } from 'use-debounce';

// import {
//   CrowdBibleUI,
//   Input,
//   TextArea,
//   Button,
//   MuiMaterial,
// } from '@eten-lab/ui-kit';

// import { useAppContext } from '@/hooks/useAppContext';
// import { useSiteText } from '@/hooks/useSiteText';

// import { SiteTextDto } from '@/dtos/site-text.dto';

// import { SelectableDefinitionCandidateList } from '@/components/SelectableDefinitionCandidateList';

// const { HeadBox } = CrowdBibleUI;
// const { Stack, Typography } = MuiMaterial;

export function SiteTextTranslationEditorPage() {
  // const history = useHistory();
  // const { siteTextId } = useParams<{ siteTextId: Nanoid }>();
  // const {
  //   states: {
  //     global: { singletons },
  //     documentTools: { targetLanguage },
  //   },
  //   actions: { alertFeedback },
  // } = useAppContext();
  // const { createOrFindSiteTextTranslationCandidate, getTranslatedSiteText } =
  //   useSiteText();

  // const [translatedSiteText, setTranslatedSiteText] =
  //   useState<SiteTextDto | null>(null);

  // const [word, setWord] = useState<string>('');
  // const [bouncedWord] = useDebounce(word, 1000);

  // const [description, setDescription] = useState<string>('');

  // useEffect(() => {
  //   if (singletons && siteTextId) {
  //     getTranslatedSiteText(siteTextId).then(setTranslatedSiteText);
  //   }
  // }, [singletons, getTranslatedSiteText, siteTextId]);

  // const handleChangeWord: ChangeEventHandler<HTMLInputElement> = (event) => {
  //   setWord(event.target.value);
  // };

  // const handleChangeDescription: ChangeEventHandler<HTMLTextAreaElement> = (
  //   event,
  // ) => {
  //   setDescription(event.target.value);
  // };

  // const handleChangeDescriptionForCandidateList = useCallback(
  //   (description: string) => {
  //     setDescription(description);
  //   },
  //   [],
  // );

  // const handleClickSave = async () => {
  //   if (siteTextId) {
  //     // actuall we need language id for app, but for now, we don't have so temperilly used sourceLangauge
  //     await createOrFindSiteTextTranslationCandidate(
  //       siteTextId,
  //       word,
  //       description,
  //     );
  //     history.goBack();
  //   } else {
  //     alertFeedback('error', 'Not exists siteTextId');
  //   }
  // };

  // const handleClickBackBtn = () => {
  //   history.goBack();
  // };

  // if (!translatedSiteText) {
  //   return null;
  // }

  // const selectableCandidateListCom = targetLanguage ? (
  //   <SelectableDefinitionCandidateList
  //     word={bouncedWord}
  //     languageId={targetLanguage.id}
  //     description={description}
  //     onChangeDescription={handleChangeDescriptionForCandidateList}
  //   />
  // ) : null;

  // return (
  //   <IonContent>
  //     <HeadBox
  //       back={{ action: handleClickBackBtn }}
  //       title="Add New Translation"
  //       extraNode={
  //         <Input value={translatedSiteText.translated?.siteText} disabled />
  //       }
  //     />
  //     <Stack gap="12px" sx={{ padding: '20px' }}>
  //       <Typography variant="body1" color="text.dark">
  //         {translatedSiteText.translated?.definition}
  //       </Typography>

  //       <Input
  //         label="Translation"
  //         withLegend={false}
  //         value={word}
  //         onChange={handleChangeWord}
  //       />
  //       <TextArea
  //         label="Description of Translation"
  //         withLegend={false}
  //         value={description}
  //         onChange={handleChangeDescription}
  //       />

  //       <hr />

  //       <Button variant="contained" onClick={handleClickSave}>
  //         Save
  //       </Button>
  //       <Button variant="text" onClick={handleClickBackBtn}>
  //         Cancel
  //       </Button>
  //     </Stack>

  //     {selectableCandidateListCom}
  //   </IonContent>
  // );

  return <div>This page is blocked</div>;
}
