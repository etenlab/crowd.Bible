import { useState, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import { CrowdBibleUI, MuiMaterial, Button } from '@eten-lab/ui-kit';

import { RouteConst } from '@/constants/route.constant';

import { DescriptionList, DescriptionItem } from '@/components/DescriptionList';

import { useAppContext } from '@/hooks/useAppContext';
import { useSiteText } from '@/hooks/useSiteText';
import { useVote } from '@/hooks/useVote';
import { useDocument } from '@/hooks/useDocument';

import { SiteTextTranslationDto, SiteTextDto } from '@/dtos/site-text.dto';
import { AppDto } from '@/dtos/document.dto';
import { compareLangInfo } from '@/src/utils/langUtils';

const { HeadBox } = CrowdBibleUI;

const { Typography, Stack } = MuiMaterial;

export function SiteTextDetailPage() {
  const history = useHistory();
  const { appId, siteTextId, originalDefinitionRel, translatedDefinitionRel } =
    useParams<{
      appId: Nanoid;
      siteTextId: Nanoid;
      originalDefinitionRel?: Nanoid;
      translatedDefinitionRel?: Nanoid;
    }>();
  const {
    states: {
      global: { singletons },
      documentTools: { sourceLanguage, targetLanguage },
    },
    actions: { alertFeedback },
  } = useAppContext();
  const {
    getRecommendedSiteText,
    getSiteTextDtoWithRel,
    getTranslationListBySiteTextRel,
    getSiteTextTranslationDtoWithRel,
    getOriginalAndTranslatedRelFromSiteTextTranslationDto,
  } = useSiteText();
  const { toggleVote, getVotesStats } = useVote();
  const { getAppById } = useDocument();

  const [app, setApp] = useState<AppDto | null>(null);
  const [originalSiteText, setOriginalSiteText] = useState<SiteTextDto | null>(
    null,
  );
  const [siteText, setSiteText] = useState<SiteTextTranslationDto | null>(null);
  const [siteTextTranslationList, setSiteTextTranslationList] = useState<
    SiteTextTranslationDto[]
  >([]);

  // fetch recommended siteText
  useEffect(() => {
    (async () => {
      if (singletons && sourceLanguage) {
        getAppById(appId).then(setApp);

        let _siteText: SiteTextTranslationDto | null = null;
        let _originalSiteText: SiteTextDto | null = null;

        if (originalDefinitionRel) {
          if (translatedDefinitionRel) {
            _siteText = await getSiteTextTranslationDtoWithRel(
              appId,
              originalDefinitionRel,
              translatedDefinitionRel,
            );
          } else {
            _originalSiteText = await getSiteTextDtoWithRel(
              originalDefinitionRel,
            );
          }
        } else {
          _siteText = await getRecommendedSiteText(
            appId,
            siteTextId,
            sourceLanguage,
          );
        }

        if (_siteText) {
          setSiteText(_siteText);
        } else if (_originalSiteText) {
          setOriginalSiteText(_originalSiteText);
        } else if (!_siteText && !_originalSiteText) {
          alertFeedback('error', 'Not exists site text for current language!');
          // history.push(`${RouteConst.SITE_TEXT_LIST}/${appId}`);
        }
      }
    })();
  }, [
    singletons,
    appId,
    getAppById,
    siteTextId,
    sourceLanguage,
    getSiteTextDtoWithRel,
    getRecommendedSiteText,
    getSiteTextTranslationDtoWithRel,
    originalDefinitionRel,
    translatedDefinitionRel,
    alertFeedback,
    history,
  ]);

  // fetch siteText translation list
  useEffect(() => {
    if (singletons && targetLanguage) {
      if (originalSiteText) {
        getTranslationListBySiteTextRel(
          appId,
          originalSiteText,
          targetLanguage,
        ).then(setSiteTextTranslationList);
      } else if (siteText) {
        getTranslationListBySiteTextRel(
          appId,
          siteText.original,
          targetLanguage,
        ).then(setSiteTextTranslationList);
      }
    }
  }, [
    singletons,
    appId,
    originalSiteText,
    siteText,
    targetLanguage,
    getTranslationListBySiteTextRel,
  ]);

  const handleClickBackBtn = () => {
    history.push(`${RouteConst.SITE_TEXT_LIST}/${appId}`);
  };

  const handleClickSwitchBtn = async () => {
    const {
      originalDefinitionRel: _originalDefinitionRel,
      translatedDefinitionRel: _translatedDefinitionRel,
    } = await getOriginalAndTranslatedRelFromSiteTextTranslationDto({
      original: originalSiteText,
      translated: siteText,
    });

    if (
      sourceLanguage &&
      compareLangInfo(app?.languageInfo || null, sourceLanguage) &&
      _originalDefinitionRel
    ) {
      history.push(
        `${RouteConst.SITE_TEXT_DEFINITION}/${appId}/${siteTextId}/${_originalDefinitionRel}`,
      );
    } else if (_originalDefinitionRel && _translatedDefinitionRel) {
      history.push(
        `${RouteConst.SITE_TEXT_TRANSLATION_SWITCH}/${appId}/${siteTextId}/${_originalDefinitionRel}/${_translatedDefinitionRel}`,
      );
    }
  };

  const handleClickPlusTranslationBtn = async () => {
    const {
      originalDefinitionRel: _originalDefinitionRel,
      translatedDefinitionRel: _translatedDefinitionRel,
    } = await getOriginalAndTranslatedRelFromSiteTextTranslationDto({
      original: originalSiteText,
      translated: siteText,
    });

    if (_originalDefinitionRel && _translatedDefinitionRel) {
      history.push(
        `${RouteConst.ADD_NEW_SITE_TEXT_TRANSLATION}/${appId}/${siteTextId}/${_originalDefinitionRel}/${_translatedDefinitionRel}`,
      );
    } else if (_originalDefinitionRel && !_translatedDefinitionRel) {
      history.push(
        `${RouteConst.ADD_NEW_SITE_TEXT_TRANSLATION}/${appId}/${siteTextId}/${_originalDefinitionRel}`,
      );
    }
  };

  const handleChangeVote = async (
    candidateId: Nanoid,
    voteValue: boolean,
    descriptionId: Nanoid,
  ) => {
    await toggleVote(candidateId, voteValue);

    if (!descriptionId) {
      return;
    }

    const voteStats = await getVotesStats(candidateId);

    setSiteTextTranslationList((_siteTextTranslationList) => {
      return _siteTextTranslationList.map((siteTextTranslation) => {
        if (siteTextTranslation.candidateId === candidateId) {
          return {
            ...siteTextTranslation,
            ...voteStats,
          };
        } else {
          return siteTextTranslation;
        }
      });
    });
  };

  const handleClickDiscussionBtn = async (_descriptionId: Nanoid) => {};

  const items: DescriptionItem[] = useMemo(() => {
    return siteTextTranslationList
      ? siteTextTranslationList.map((translation) => ({
          id: translation.candidateId || '',
          title: translation.translatedSiteText,
          description: translation.translatedDefinition,
          vote: {
            upVotes: translation.upVotes,
            downVotes: translation.downVotes,
            candidateId: translation.candidateId || '',
          },
        }))
      : [];
  }, [siteTextTranslationList]);

  const siteTextString =
    siteText?.translatedSiteText || originalSiteText?.siteText || '';
  const definitionString =
    siteText?.translatedDefinition || originalSiteText?.definition || '';

  return (
    <IonContent>
      <HeadBox back={{ action: handleClickBackBtn }} title={siteTextString} />
      <Stack gap="20px" sx={{ padding: '20px' }}>
        <Typography variant="body1" color="text.dark">
          {definitionString}
        </Typography>

        <Stack
          gap="20px"
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            variant="outlined"
            fullWidth
            onClick={handleClickSwitchBtn}
            sx={{ minWidth: '90px' }}
          >
            {sourceLanguage &&
            compareLangInfo(app?.languageInfo || null, sourceLanguage)
              ? 'Definition'
              : 'Switch'}
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={handleClickPlusTranslationBtn}
            sx={{ minWidth: '160px' }}
          >
            + New Translation
          </Button>
        </Stack>
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
      />
    </IonContent>
  );
}
