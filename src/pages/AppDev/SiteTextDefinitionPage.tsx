import { useMemo, useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import { CrowdBibleUI, Button, MuiMaterial, Input } from '@eten-lab/ui-kit';

import { useAppContext } from '@/hooks/useAppContext';
import { useSiteText } from '@/hooks/useSiteText';
import { useDocument } from '@/hooks/useDocument';
import { useVote } from '@/hooks/useVote';

import { DescriptionList, DescriptionItem } from '@/components/DescriptionList';

import { RouteConst } from '@/constants/route.constant';

import { VotableContent } from '@/dtos/votable-item.dto';
import { SiteTextDto } from '@/src/dtos/site-text.dto';

import { compareLangInfo } from '@/utils/langUtils';

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
  const { getAppById } = useDocument();
  const { getVotesStats, toggleVote, getCandidateById } = useVote();

  const [siteText, setSiteText] = useState<SiteTextDto | null>();
  const [definitionList, setDefinitionList] = useState<VotableContent[]>([]);

  useEffect(() => {
    (async () => {
      if (singletons) {
        const _app = await getAppById(appId);

        if (!_app) {
          alertFeedback('error', 'Cannot find app by given Id.');
          history.goBack();
          return;
        }

        if (!sourceLanguage) {
          alertFeedback('error', 'Please select source language info.');
          history.goBack();
          return;
        }

        if (!compareLangInfo(_app.languageInfo, sourceLanguage)) {
          alertFeedback(
            'error',
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

  const handleClickAddNew = () => {
    history.push(`${RouteConst.ADD_NEW_SITE_TEXT}/${appId}/${siteTextId}`);
  };

  const handleClickCancel = () => {
    history.push(`${RouteConst.SITE_TEXT_DETAIL}/${appId}/${siteTextId}`);
  };

  const handleClickDiscussionBtn = async (_descriptionId: Nanoid) => {};

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
        alertFeedback('warning', 'Cannot find such definition!');
        return;
      }

      const candidate = await getCandidateById(definition.candidateId);

      if (!candidate) {
        alertFeedback('error', 'Cannot find such candidate!');
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
    <IonContent>
      <HeadBox
        back={{ action: handleClickCancel }}
        title="Site Text Definitions"
        extraNode={<Input value={siteText?.siteText || ''} disabled />}
      />

      <Stack gap="12px" sx={{ padding: '20px' }}>
        <Typography variant="body1" color="text.dark">
          {siteText?.definition || ''}
        </Typography>
      </Stack>

      <DescriptionList
        title="Translation Candidates"
        items={items}
        discussionBtn={{
          onClickDiscussionBtn: handleClickDiscussionBtn,
        }}
        voteBtn={{
          onChangeVote: handleChangeVote,
        }}
        onClickRow={handleClickDefinitionRow}
      />

      <Stack gap="12px" sx={{ padding: '20px' }}>
        <Button variant="contained" onClick={handleClickAddNew}>
          + Add New Definition
        </Button>
        <Button variant="text" onClick={handleClickCancel}>
          Cancel
        </Button>
      </Stack>
    </IonContent>
  );
}
