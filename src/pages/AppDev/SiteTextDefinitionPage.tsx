import { useMemo, useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useIonViewDidEnter } from '@ionic/react';

import { CrowdBibleUI, PlusButton, MuiMaterial, Input } from '@eten-lab/ui-kit';

import { useAppContext } from '@/hooks/useAppContext';
import { useSiteText } from '@/hooks/useSiteText';
import { useDocument } from '@/hooks/useDocument';
import { useVote } from '@/hooks/useVote';
import { useTr } from '@/hooks/useTr';

import { DescriptionList, DescriptionItem } from '@/components/DescriptionList';

import { RouteConst } from '@/constants/route.constant';

import { VotableContent } from '@/dtos/votable-item.dto';
import { SiteTextDto } from '@/src/dtos/site-text.dto';

import { compareLangInfo } from '@/utils/langUtils';
import { FeedbackTypes } from '@/constants/common.constant';

import { PageLayout } from '@/components/Layout';

const { HeadBox } = CrowdBibleUI;
const { Stack, Typography } = MuiMaterial;

export function SiteTextDefinitionPage() {
  const history = useHistory();
  const { appId, siteTextId, originalDefinitionRel } = useParams<{
    appId: Nanoid;
    siteTextId: Nanoid;
    originalDefinitionRel: Nanoid;
  }>();
  const {
    states: {
      global: { singletons },
      documentTools: { sourceLanguage },
    },
    actions: { alertFeedback },
  } = useAppContext();
  const { getDefinitionList, getSiteTextDtoWithRel } = useSiteText();
  const { tr } = useTr();
  const { getAppById } = useDocument();
  const { getVotesStats, toggleVote, getCandidateById } = useVote();

  const [siteText, setSiteText] = useState<SiteTextDto | null>();
  const [definitionList, setDefinitionList] = useState<VotableContent[]>([]);

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

        if (!compareLangInfo(_app.languageInfo, sourceLanguage)) {
          alertFeedback(
            FeedbackTypes.ERROR,
            'This page only allow you to have same language info between source and app language',
          );
          history.goBack();
        }
      }
    })();
  }, [getAppById, singletons, appId, sourceLanguage, history, alertFeedback]);

  // Fetch site text definition Lists from db
  // you here this page that means you have same language info between app language and sourceLanguage
  useEffect(() => {
    if (singletons && appId) {
      getDefinitionList(appId, siteTextId).then(setDefinitionList);
      getSiteTextDtoWithRel(originalDefinitionRel).then(setSiteText);
    }
  }, [
    getDefinitionList,
    getSiteTextDtoWithRel,
    singletons,
    appId,
    siteTextId,
    originalDefinitionRel,
  ]);

  useIonViewDidEnter(() => {
    if (singletons && appId) {
      getDefinitionList(appId, siteTextId).then(setDefinitionList);
      getSiteTextDtoWithRel(originalDefinitionRel).then(setSiteText);
    }
  }, [
    getDefinitionList,
    getSiteTextDtoWithRel,
    singletons,
    appId,
    siteTextId,
    originalDefinitionRel,
  ]);

  const handleClickAddNew = () => {
    history.push(`${RouteConst.ADD_NEW_SITE_TEXT}/${appId}/${siteTextId}`);
  };

  const handleClickCancel = () => {
    history.push(`${RouteConst.SITE_TEXT_DETAIL}/${appId}/${siteTextId}`);
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

      setDefinitionList((_definitionList) => {
        return _definitionList.map((definition) => {
          if (definition.candidateId === candidateId) {
            return {
              ...definition,
              ...voteStats,
            };
          } else {
            return definition;
          }
        });
      });
    },
    [toggleVote, getVotesStats],
  );

  const handleClickDefinitionRow = useCallback(
    async (descriptionId: Nanoid) => {
      const definition = definitionList.find(
        (definition) => definition.id === descriptionId,
      );

      if (!definition || !definition.candidateId) {
        alertFeedback(FeedbackTypes.WARNING, 'Cannot find such definition!');
        return;
      }

      const candidate = await getCandidateById(definition.candidateId);

      if (!candidate) {
        alertFeedback(FeedbackTypes.ERROR, 'Cannot find such candidate!');
        return;
      }

      history.push(
        `${RouteConst.SITE_TEXT_DETAIL}/${appId}/${siteTextId}/${candidate.candidate_ref}`,
      );
    },
    [
      definitionList,
      appId,
      siteTextId,
      alertFeedback,
      history,
      getCandidateById,
    ],
  );

  const items: DescriptionItem[] = useMemo(() => {
    return definitionList
      .filter((definition) => {
        if (!definition.id) return false;
        if (!definition.candidateId) return false;
        return true;
      })
      .map((definition) => ({
        id: definition.id!,
        description: definition.content,
        vote: {
          upVotes: definition.upVotes,
          downVotes: definition.downVotes,
          candidateId: definition.candidateId!,
        },
      }));
  }, [definitionList]);

  return (
    <PageLayout>
      <HeadBox
        back={{ action: handleClickCancel }}
        title={tr('Site Text Definitions')}
        extraNode={
          <Input value={siteText?.siteText || tr('Site Text')} disabled />
        }
      />

      <Stack gap="12px" sx={{ padding: '20px' }}>
        <Typography variant="body1" color="text.dark">
          {siteText?.definition || tr('No definition')}
        </Typography>
      </Stack>

      <DescriptionList
        label={tr('Definition Candidates')}
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
        onClickRow={handleClickDefinitionRow}
      />
    </PageLayout>
  );
}
