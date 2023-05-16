// import { useState, useEffect, useMemo } from 'react';
// import { useHistory, useParams } from 'react-router-dom';
// import { IonContent } from '@ionic/react';

// import { CrowdBibleUI, MuiMaterial, Button } from '@eten-lab/ui-kit';

// import { RouteConst } from '@/constants/route.constant';

// import { DescriptionList, DescriptionItem } from '@/components/DescriptionList';

// import { useAppContext } from '@/hooks/useAppContext';
// import { useSiteText } from '@/hooks/useSiteText';
// import { useVote } from '@/hooks/useVote';

// import { SiteTextWithTranslationVotablesDto } from '@/dtos/site-text.dto';
// import { alertFeedback } from '@/src/reducers/global.actions';

// import { compareLangInfo } from '@/utils/langUtils';

// const { HeadBox } = CrowdBibleUI;

// const { Typography, Stack, Chip } = MuiMaterial;

export function SiteTextDetailPage({
  isChangeTranslationPage,
}: {
  isChangeTranslationPage?: boolean;
}) {
  // const history = useHistory();
  // const { siteTextId } = useParams<{ siteTextId: Nanoid }>();
  // const {
  //   states: {
  //     global: { singletons },
  //     documentTools: { sourceLanguage },
  //   },
  // } = useAppContext();
  // const {
  //   // getSiteTextWithTranslationCandidates,
  //   // selectSiteTextTranslationCandidate,
  //   // getSelectedSiteTextTranslation,
  //   // getSiteTextTranslationVotableById,
  // } = useSiteText();
  // const { toggleVote } = useVote();

  // const [siteText, setSiteText] =
  //   useState<SiteTextWithTranslationVotablesDto | null>(null);
  // const [selectedTranslation, setSelectedTranslation] = useState<string | null>(
  //   null,
  // );

  // const isOrigin =
  //   siteText &&
  //   sourceLanguage &&
  //   compareLangInfo(siteText.languageInfo, sourceLanguage);

  // // fetch site text data with translation candidates
  // useEffect(() => {
  //   if (singletons) {
  //     if (isChangeTranslationPage && sourceLanguage) {
  //       getSiteTextWithTranslationCandidates(
  //         siteTextId,
  //         sourceLanguage.id,
  //         sourceLanguage.id,
  //       ).then(setSiteText);
  //       getSelectedSiteTextTranslation(siteTextId, sourceLanguage.id).then(
  //         (selected) => {
  //           if (selected) {
  //             setSelectedTranslation(selected.id);
  //           }
  //         },
  //       );
  //     } else {
  //       getSiteTextWithTranslationCandidates(siteTextId).then(setSiteText);
  //       getSelectedSiteTextTranslation(siteTextId).then((selected) => {
  //         if (selected) {
  //           setSelectedTranslation(selected.id);
  //         }
  //       });
  //     }
  //   }
  // }, [
  //   getSiteTextWithTranslationCandidates,
  //   getSelectedSiteTextTranslation,
  //   singletons,
  //   siteTextId,
  //   sourceLanguage,
  //   isChangeTranslationPage,
  // ]);

  // const handleClickBackBtn = () => {
  //   history.goBack();
  // };

  // const handleClickEditBtn = () => {
  //   if (isOrigin) {
  //     history.push(
  //       `${RouteConst.SITE_TEXT_EDITOR}/${siteText?.appId}/${siteTextId}`,
  //     );
  //   } else {
  //     history.push(`${RouteConst.SITE_TEXT_CHANGE_TRANSLATION}/${siteTextId}`);
  //   }
  // };

  // const handleClickPlusTranslationBtn = () => {
  //   history.push(`${RouteConst.SITE_TEXT_TRANSLATION_EDITOR}/${siteTextId}`);
  // };

  // const handleChangeVote = async (
  //   candidateId: Nanoid,
  //   voteValue: boolean,
  //   descriptionId: Nanoid,
  // ) => {
  //   await toggleVote(candidateId, voteValue);

  //   if (!descriptionId) {
  //     return;
  //   }

  //   const result = await getSiteTextTranslationVotableById(descriptionId);

  //   if (!result) {
  //     alertFeedback('error', 'Not able to find translation by given ID');
  //     return;
  //   }

  //   setSiteText((siteText) => {
  //     if (!siteText) {
  //       return null;
  //     }

  //     return {
  //       ...siteText,
  //       translations: siteText!.translations.map((translation) => {
  //         if (translation.id === descriptionId) {
  //           return result;
  //         } else {
  //           return translation;
  //         }
  //       }),
  //     };
  //   });
  // };

  // const handleClickDiscussionBtn = async (descriptionId: Nanoid) => {};

  // const handleSelectRadio = async (descriptionId: Nanoid) => {
  //   const result = await selectSiteTextTranslationCandidate(
  //     descriptionId,
  //     siteTextId,
  //   );

  //   if (result) {
  //     setSelectedTranslation(descriptionId);
  //   }
  // };

  // const items: DescriptionItem[] = useMemo(() => {
  //   return siteText
  //     ? siteText.translations.map((translation) => ({
  //         id: translation.id,
  //         title: translation.translatedSiteText,
  //         description: translation.translatedDefinition,
  //         vote: {
  //           upVotes: translation.upVotes,
  //           downVotes: translation.downVotes,
  //           candidateId: translation.candidateId,
  //         },
  //       }))
  //     : [];
  // }, [siteText]);

  // const recommendedBudgeCom = (
  //   <Chip
  //     component="span"
  //     label="Recommended"
  //     variant="outlined"
  //     color="warning"
  //     size="small"
  //     sx={{ marginLeft: 2 }}
  //   />
  // );

  // const notTranslatedBudgeCom = (
  //   <Chip
  //     component="span"
  //     label="Not translated"
  //     variant="outlined"
  //     color="error"
  //     size="small"
  //     sx={{ marginLeft: 2 }}
  //   />
  // );

  // const budgeCom = siteText?.translated
  //   ? siteText.translated.type === 'recommended'
  //     ? recommendedBudgeCom
  //     : null
  //   : notTranslatedBudgeCom;

  // const isDisabledNewTranslationBtn = siteText?.translated
  //   ? siteText.translated.type === 'recommended'
  //     ? true
  //     : false
  //   : true;

  // const isDisabledEditBtn = siteText?.translated ? false : true;

  // const toolbtnComs = !isChangeTranslationPage ? (
  //   <Stack
  //     gap="20px"
  //     direction="row"
  //     justifyContent="space-between"
  //     alignItems="center"
  //   >
  //     <Button
  //       variant="outlined"
  //       fullWidth
  //       onClick={handleClickEditBtn}
  //       sx={{ minWidth: '90px' }}
  //       disabled={isDisabledEditBtn}
  //     >
  //       Switch
  //     </Button>
  //     <Button
  //       variant="contained"
  //       fullWidth
  //       onClick={handleClickPlusTranslationBtn}
  //       sx={{ minWidth: '160px' }}
  //       disabled={isDisabledNewTranslationBtn}
  //     >
  //       + New Translation
  //     </Button>
  //   </Stack>
  // ) : null;

  // const headCom = isChangeTranslationPage ? (
  //   <HeadBox
  //     back={{ action: handleClickBackBtn }}
  //     title="Switch Site Text Translation"
  //   />
  // ) : (
  //   <HeadBox
  //     back={{ action: handleClickBackBtn }}
  //     title={
  //       <>
  //         {siteText?.translated
  //           ? siteText.translated.siteText
  //           : siteText?.siteText}
  //         {budgeCom}
  //       </>
  //     }
  //   />
  // );

  // const siteTextCom = isChangeTranslationPage ? (
  //   <Typography variant="body1" color="text.dark" sx={{ fontWeight: '600' }}>
  //     {siteText?.translated ? siteText.translated.siteText : siteText?.siteText}
  //     {budgeCom}
  //   </Typography>
  // ) : null;

  // return (
  //   <IonContent>
  //     {headCom}
  //     <Stack gap="20px" sx={{ padding: '20px' }}>
  //       {siteTextCom}
  //       <Typography variant="body1" color="text.dark">
  //         {siteText?.translated
  //           ? siteText.translated.definition
  //           : siteText?.definition}
  //         {budgeCom}
  //       </Typography>
  //       {toolbtnComs}
  //     </Stack>

  //     <DescriptionList
  //       title="Translation Candidates"
  //       items={items}
  //       radioBtn={{
  //         checkedId: selectedTranslation,
  //         onSelectRadio: handleSelectRadio,
  //       }}
  //       discussionBtn={{
  //         onClickDiscussionBtn: handleClickDiscussionBtn,
  //       }}
  //       voteBtn={{
  //         onChangeVote: handleChangeVote,
  //       }}
  //     />
  //   </IonContent>
  // );

  return <div>This page is blocked</div>;
}
