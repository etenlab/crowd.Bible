import { useMemo, useState, useCallback, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { CrowdBibleUI, MuiMaterial, Input, PlusButton } from '@eten-lab/ui-kit';

import { useAppContext } from '@/hooks/useAppContext';
import { useSiteText } from '@/hooks/useSiteText';
import { useDocument } from '@/hooks/useDocument';
import { useVote } from '@/hooks/useVote';
import { useTr } from '@/hooks/useTr';

import { DescriptionList, DescriptionItem } from '@/components/DescriptionList';

import { RouteConst } from '@/constants/route.constant';

import { SiteTextTranslationDto } from '@/src/dtos/site-text.dto';

import { compareLangInfo } from '@/utils/langUtils';
import { FeedbackTypes } from '@/constants/common.constant';

import { PageLayout } from '@/components/Layout';

const { HeadBox } = CrowdBibleUI;
const { Stack, Typography } = MuiMaterial;

export function SiteTextTranslationSwitchPage() {
  const history = useHistory();
  const { appId, siteTextId, originalDefinitionRel, translatedDefinitionRel } =
    useParams<{
      appId: Nanoid;
      siteTextId: Nanoid;
      originalDefinitionRel: Nanoid;
      translatedDefinitionRel: Nanoid;
    }>();
  const {
    states: {
      global: { singletons },
      documentTools: { sourceLanguage },
    },
    actions: { alertFeedback },
  } = useAppContext();
  const {
    getTranslationListBySiteTextRel,
    getSiteTextTranslationDtoWithRel,
    getOriginalAndTranslatedRelFromSiteTextTranslationDto,
  } = useSiteText();
  const { tr } = useTr();
  const { getAppById } = useDocument();
  const { getVotesStats, toggleVote } = useVote();

  const [siteText, setSiteText] = useState<SiteTextTranslationDto | null>();
  const [translationList, setTranslationList] = useState<
    SiteTextTranslationDto[]
  >([]);

  useEffect(() => {
    (async () => {
      if (singletons) {
        const _app = await getAppById(appId);

        if (!_app) {
          alertFeedback(FeedbackTypes.ERROR, 'Cannot find app by given Id.');
          history.goBack();
          return;
        }

        if (!sourceLanguage) {
          alertFeedback(
            FeedbackTypes.ERROR,
            'Please select source language info.',
          );
          history.goBack();
          return;
        }

        if (compareLangInfo(_app.languageInfo, sourceLanguage)) {
          alertFeedback(
            FeedbackTypes.ERROR,
            'This page only allow you to have different language info between source and app language',
          );
          history.goBack();
        }
      }
    })();
  }, [getAppById, singletons, appId, sourceLanguage, history, alertFeedback]);

  // Fetch site text definition Lists from db
  // you here this page that means you have same language info between app language and sourceLanguage
  useEffect(() => {
    if (singletons) {
      getSiteTextTranslationDtoWithRel(
        appId,
        originalDefinitionRel,
        translatedDefinitionRel,
      ).then(setSiteText);
    }
  }, [
    getSiteTextTranslationDtoWithRel,
    singletons,
    appId,
    siteTextId,
    originalDefinitionRel,
    translatedDefinitionRel,
  ]);

  useEffect(() => {
    if (singletons && sourceLanguage && siteText) {
      getTranslationListBySiteTextRel(
        appId,
        siteText.original,
        sourceLanguage,
      ).then(setTranslationList);
    }
  }, [
    singletons,
    sourceLanguage,
    siteText,
    getTranslationListBySiteTextRel,
    appId,
  ]);

  const handleClickAddNew = () => {
    history.push(
      `${RouteConst.ADD_NEW_SITE_TEXT_TRANSLATION}/${appId}/${siteTextId}/${originalDefinitionRel}`,
    );
  };

  const handleClickCancel = () => {
    history.push(
      `${RouteConst.SITE_TEXT_DETAIL}/${appId}/${siteTextId}/${originalDefinitionRel}/${translatedDefinitionRel}`,
    );
  };

  const handleClickDiscussionBtn = (definitionId: Nanoid) => {
    history.push(`${RouteConst.DISCUSSIONS}/definition/${definitionId}`);
  };

  const handleChangeVote = useCallback(
    async (candidateId: Nanoid, voteValue: boolean, descriptionId: Nanoid) => {
      await toggleVote(candidateId, voteValue);

      if (!descriptionId) {
        return;
      }

      const voteStats = await getVotesStats(candidateId);

      setTranslationList((_translationList) => {
        return _translationList.map((translation) => {
          if (translation.candidateId === candidateId) {
            return {
              ...translation,
              ...voteStats,
            };
          } else {
            return translation;
          }
        });
      });
    },
    [toggleVote, getVotesStats],
  );

  const handleClickTranslationRow = useCallback(
    async (descriptionId: Nanoid) => {
      const translation = translationList.find(
        (translation) => translation.candidateId === descriptionId,
      );

      if (!translation || !translation.candidateId) {
        alertFeedback(FeedbackTypes.ERROR, 'Cannot find such translation!');
        return;
      }

      const {
        originalDefinitionRel: _originalDefinitionRel,
        translatedDefinitionRel: _translatedDefinitionRel,
      } = await getOriginalAndTranslatedRelFromSiteTextTranslationDto({
        original: null,
        translated: translation,
      });

      history.push(
        `${RouteConst.SITE_TEXT_DETAIL}/${appId}/${siteTextId}/${_originalDefinitionRel}/${_translatedDefinitionRel}`,
      );
    },
    [
      translationList,
      appId,
      siteTextId,
      alertFeedback,
      history,
      getOriginalAndTranslatedRelFromSiteTextTranslationDto,
    ],
  );

  const items: DescriptionItem[] = useMemo(() => {
    return translationList.map((translation) => ({
      id: translation.candidateId || '',
      title: translation.translatedSiteText,
      description: translation.translatedDefinition,
      vote: {
        upVotes: translation.upVotes,
        downVotes: translation.downVotes,
        candidateId: translation.candidateId || '',
      },
    }));
  }, [translationList]);

  return (
    <PageLayout>
      <HeadBox
        back={{ action: handleClickCancel }}
        title={tr('Switch Translation')}
        extraNode={
          <Input value={siteText?.translatedSiteText || ''} disabled />
        }
      />
      <Stack gap="12px" sx={{ padding: '20px' }}>
        <Typography variant="body1" color="text.dark">
          {siteText?.translatedDefinition || tr('No definition')}
        </Typography>
      </Stack>
      <DescriptionList
        label={tr('Site Text Translation List')}
        toolBtnComs={
          <PlusButton variant="primary" onClick={handleClickAddNew} />
        }
        items={items}
        discussionBtn={{
          onClickDiscussionBtn: handleClickDiscussionBtn,
        }}
        voteBtn={{
          onChangeVote: handleChangeVote,
        }}
        onClickRow={handleClickTranslationRow}
      />
    </PageLayout>
  );
}
