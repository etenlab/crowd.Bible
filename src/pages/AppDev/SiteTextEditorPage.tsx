// import { ChangeEventHandler, useState, useEffect, useCallback } from 'react';
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

// import { SelectableDefinitionCandidateList } from '@/components/SelectableDefinitionCandidateList';

// import { SiteTextDto } from '@/dtos/site-text.dto';

// const { HeadBox } = CrowdBibleUI;
// const { Stack } = MuiMaterial;

export function SiteTextEditorPage() {
  // const history = useHistory();
  // const { siteTextId, appId } = useParams<{
  //   siteTextId?: Nanoid;
  //   appId: Nanoid;
  // }>();
  // const {
  //   states: {
  //     global: { singletons },
  //   },
  //   actions: { alertFeedback },
  // } = useAppContext();
  // const { createOrFindSiteText, getSiteTextById } =
  //   useSiteText();
  // const { getMockAppById } = useLanguage();

  // const [currentSiteText, setCurrentSiteText] = useState<SiteTextDto | null>(
  //   null,
  // );
  // const [app, setApp] = useState<MockApp | null>(null);

  // const [word, setWord] = useState<string>('');
  // const [bouncedWord] = useDebounce(word, 1000);

  // const [description, setDescription] = useState<string>('');

  // const isEditor = siteTextId ? true : false;
  // // this is temporary solution because we don't have app service.
  // const siteTextLanguageId = isEditor
  //   ? currentSiteText?.languageId
  //   : app?.languageId;

  // // if editor mode, then fetch siteText
  // useEffect(() => {
  //   if (singletons && siteTextId) {
  //     getSiteTextById(siteTextId).then((data) => {
  //       if (data) {
  //         setWord(data.siteText);
  //         setDescription(data.definition);
  //       }
  //       setCurrentSiteText(data);
  //     });
  //   }
  // }, [singletons, siteTextId, getSiteTextById]);

  // // Fetch site Lists from db
  // useEffect(() => {
  //   if (singletons && appId) {
  //     getMockAppById(appId).then(setApp);
  //   }
  // }, [getMockAppById, singletons, appId]);

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
  //   if (isEditor) {
  //     const result = await editSiteTextWordAndDescription(
  //       siteTextId!,
  //       word,
  //       description,
  //     );

  //     if (result) {
  //       history.goBack();
  //     }
  //   } else {
  //     if (appId && siteTextLanguageId) {
  //       const result = await createSiteText(
  //         appId,
  //         siteTextLanguageId,
  //         bouncedWord,
  //         description,
  //       );

  //       if (result) {
  //         history.goBack();
  //       }
  //     } else {
  //       alertFeedback('error', 'Not exists appId');
  //     }
  //   }
  // };

  // const handleClickCancel = () => {
  //   history.goBack();
  // };

  // const headCom = isEditor ? (
  //   <HeadBox title="Edit Site Text" />
  // ) : (
  //   <HeadBox title="Add New Site Txt" appTitle="App Name 1" />
  // );

  // const selectableCandidateListCom = siteTextLanguageId ? (
  //   <SelectableDefinitionCandidateList
  //     word={bouncedWord}
  //     languageId={siteTextLanguageId}
  //     description={description}
  //     onChangeDescription={handleChangeDescriptionForCandidateList}
  //   />
  // ) : null;

  // return (
  //   <IonContent>
  //     {headCom}
  //     <Stack gap="12px" sx={{ padding: '20px' }}>
  //       <Input
  //         label="Site Text"
  //         withLegend={false}
  //         value={word}
  //         onChange={handleChangeWord}
  //       />
  //       <TextArea
  //         label="Description"
  //         withLegend={false}
  //         value={description}
  //         onChange={handleChangeDescription}
  //       />

  //       <hr />

  //       <Button variant="contained" onClick={handleClickSave}>
  //         Save
  //       </Button>
  //       <Button variant="text" onClick={handleClickCancel}>
  //         Cancel
  //       </Button>
  //     </Stack>

  //     {selectableCandidateListCom}
  //   </IonContent>
  // );

  return <div>This page is blocked</div>;
}
