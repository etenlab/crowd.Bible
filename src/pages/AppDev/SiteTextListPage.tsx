import { useState, useMemo, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useIonViewDidEnter } from '@ionic/react';

import {
  CrowdBibleUI,
  PlusButton,
  Typography,
  MuiMaterial,
} from '@eten-lab/ui-kit';

import { RouteConst } from '@/constants/route.constant';

import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';
import { useSiteText } from '@/hooks/useSiteText';
import { useDocument } from '@/hooks/useDocument';

import { LanguageStatusBar } from '@/components/LanguageStatusBar';

import { AppDto } from '@/dtos/document.dto';
import { TranslatedSiteTextDto } from '@/dtos/site-text.dto';

import { PageLayout } from '@/components/Layout';

const { HeadBox, ButtonList } = CrowdBibleUI;
const { Stack, Chip } = MuiMaterial;

type ButtonListItemType = CrowdBibleUI.ButtonListItemType;

export function SiteTextListPage() {
  const history = useHistory();
  const { appId } = useParams<{ appId?: Nanoid }>();
  const {
    states: {
      global: { singletons },
      documentTools: { sourceLanguage, targetLanguage },
    },
  } = useAppContext();
  const { getTranslatedSiteTextListByAppId } = useSiteText();
  const { getAppById } = useDocument();
  const { tr } = useTr();

  const [searchStr, setSearchStr] = useState<string>('');
  const [siteTextList, setSiteTextList] = useState<TranslatedSiteTextDto[]>([]);
  const [app, setApp] = useState<AppDto | null>(null);

  // Fetch Mock App Info from db
  useEffect(() => {
    if (singletons && appId) {
      getAppById(appId).then(setApp);
    }
  }, [getAppById, appId, singletons]);

  // Fetch site Lists from db
  useEffect(() => {
    if (singletons && app && sourceLanguage && targetLanguage) {
      getTranslatedSiteTextListByAppId(
        app.id,
        sourceLanguage,
        targetLanguage,
      ).then((list) => setSiteTextList(list));
    }
  }, [
    app,
    singletons,
    sourceLanguage,
    targetLanguage,
    getTranslatedSiteTextListByAppId,
  ]);

  useIonViewDidEnter(() => {
    if (singletons && app && sourceLanguage && targetLanguage) {
      getTranslatedSiteTextListByAppId(
        app.id,
        sourceLanguage,
        targetLanguage,
      ).then((list) => setSiteTextList(list));
    }
  }, [
    app,
    singletons,
    sourceLanguage,
    targetLanguage,
    getTranslatedSiteTextListByAppId,
  ]);

  const handleChangeSearchStr = (str: string) => {
    setSearchStr(str);
  };

  const handleClickBackBtn = () => {
    history.push(`${RouteConst.APPLICATION_LIST}`);
  };

  const handleClickPlusBtn = () => {
    history.push(`${RouteConst.ADD_NEW_SITE_TEXT}/${appId}`);
  };

  const handleClickItem = (siteTextId: string) => {
    history.push(`${RouteConst.SITE_TEXT_DETAIL}/${appId}/${siteTextId}`);
  };

  const items: ButtonListItemType[] = useMemo(() => {
    return siteTextList.map((data) => {
      const notranslatedBadgeCom = !data.sourceSiteText ? (
        <Chip
          component="span"
          label="Not translated"
          variant="outlined"
          color="error"
          size="small"
          sx={{ marginLeft: 2 }}
        />
      ) : null;

      const source = (
        <Typography variant="body1" color="text.dark">
          {data.sourceSiteText ? data.sourceSiteText : data.siteText}
        </Typography>
      );
      const target =
        data.sourceSiteText && data.targetSiteText ? (
          <Typography variant="body1" color="text.green">
            {data.targetSiteText}
          </Typography>
        ) : null;

      const labelCom = (
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          sx={{ overflowWrap: 'anywhere' }}
          gap="16px"
        >
          {source}
          {target}
          {notranslatedBadgeCom}
        </Stack>
      );

      return {
        value: data.siteTextId,
        label: labelCom,
        endIcon: (
          <Typography variant="body1" color="text.dark">
            {data.translationCnt}
          </Typography>
        ),
        disabled: notranslatedBadgeCom ? true : false,
      };
    });
  }, [siteTextList]);

  const isDisabledPlusBtn = app && sourceLanguage ? false : true;

  return (
    <PageLayout>
      <HeadBox
        title={app?.name || tr('Applications')}
        search={{
          value: searchStr,
          onChange: handleChangeSearchStr,
          placeHolder: tr('Input a search word!'),
        }}
        back={{
          action: handleClickBackBtn,
        }}
      />
      <Stack gap="16px">
        <LanguageStatusBar />
        <ButtonList
          label={tr('List of site text')}
          withUnderline={true}
          items={items}
          onClick={handleClickItem}
          toolBtnGroup={
            <PlusButton
              variant="primary"
              onClick={handleClickPlusBtn}
              disabled={isDisabledPlusBtn}
            />
          }
        />
      </Stack>
    </PageLayout>
  );
}
