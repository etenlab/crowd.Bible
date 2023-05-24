import { useState, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import {
  CrowdBibleUI,
  PlusButton,
  Typography,
  MuiMaterial,
  BiRightArrowAlt,
  useColorModeContext,
} from '@eten-lab/ui-kit';

import { RouteConst } from '@/constants/route.constant';

import { useAppContext } from '@/hooks/useAppContext';
import { useSiteText } from '@/hooks/useSiteText';
import { useDocument } from '@/hooks/useDocument';

import { AppDto } from '@/dtos/document.dto';
// import { useLanguage, MockApp } from '@/hooks/useLanguage';

import { TranslatedSiteTextDto } from '@/dtos/site-text.dto';

import { langInfo2String, compareLangInfo } from '@/utils/langUtils';

const { HeadBox, ButtonList } = CrowdBibleUI;
const { Stack, Chip } = MuiMaterial;

type ButtonListItemType = CrowdBibleUI.ButtonListItemType;

export function SiteTextListPage() {
  const history = useHistory();
  const { getColor } = useColorModeContext();
  const { appId } = useParams<{ appId: Nanoid }>();
  const {
    states: {
      global: { singletons },
      documentTools: { sourceLanguage, targetLanguage },
    },
  } = useAppContext();
  const { getTranslatedSiteTextListByAppId } = useSiteText();
  // const { getMockAppById } = useLanguage();
  const { getApp } = useDocument();

  const [searchStr, setSearchStr] = useState<string>('');
  const [siteTextList, setSiteTextList] = useState<TranslatedSiteTextDto[]>([]);
  const [app, setApp] = useState<AppDto | null>(null);

  // Fetch Mock App Info from db
  useEffect(() => {
    if (singletons) {
      getApp(appId).then(setApp);
    }
  }, [getApp, appId, singletons]);

  // Fetch site Lists from db
  useEffect(() => {
    if (singletons && app && sourceLanguage) {
      getTranslatedSiteTextListByAppId(
        app.id,
        app.languageInfo,
        sourceLanguage,
      ).then((list) => setSiteTextList(list));
    }
  }, [
    app,
    getApp,
    singletons,
    sourceLanguage,
    getTranslatedSiteTextListByAppId,
  ]);

  const handleChangeSearchStr = (str: string) => {
    setSearchStr(str);
  };

  const handleClickBackBtn = () => {
    history.goBack();
  };

  const handleClickPlusBtn = () => {
    history.push(`${RouteConst.SITE_TEXT_EDITOR}/${appId}`);
  };

  const handleClickItem = (value: string) => {
    history.push(`${RouteConst.SITE_TEXT_DETAIL}/${value}`);
  };

  const items: ButtonListItemType[] = useMemo(() => {
    return siteTextList.map((data) => {
      // const recommandedBadgeCom =
      //   data.translated?.type === 'recommended' ? (
      //     <Chip
      //       component="span"
      //       label="Recommended"
      //       variant="outlined"
      //       color="warning"
      //       size="small"
      //       sx={{ marginLeft: 2 }}
      //     />
      //   ) : null;

      const notranslatedBadgeCom = !data.translatedSiteText ? (
        <Chip
          component="span"
          label="Not translated"
          variant="outlined"
          color="error"
          size="small"
          sx={{ marginLeft: 2 }}
        />
      ) : null;

      const labelCom = (
        <>
          {data.translatedSiteText ? data.translatedSiteText : data.siteText}
          {notranslatedBadgeCom}
        </>
      );

      return {
        value: data.siteTextId,
        label: labelCom,
        endIcon: (
          <Typography variant="body1" color="text.dark">
            {data.translationCnt}
          </Typography>
        ),
      };
    });
  }, [siteTextList]);

  const isDisabledPlusBtn =
    app && sourceLanguage && compareLangInfo(app.languageInfo, sourceLanguage)
      ? false
      : true;

  return (
    <IonContent>
      <HeadBox
        back={{ action: handleClickBackBtn }}
        title={app?.name || ''}
        search={{
          value: searchStr,
          onChange: handleChangeSearchStr,
          placeHolder: 'Search Site Text...',
        }}
      />

      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        gap="16px"
        sx={{ padding: '16px 20px' }}
      >
        <Typography variant="body2" color="text.dark">
          {langInfo2String(sourceLanguage || undefined)}
        </Typography>

        <BiRightArrowAlt style={{ color: getColor('gray') }} />

        <Typography variant="body2" color="text.dark">
          {langInfo2String(targetLanguage || undefined)}
        </Typography>
      </Stack>

      <ButtonList
        label="List of site text"
        withUnderline
        items={items}
        toolBtnGroup={
          <PlusButton
            variant="primary"
            onClick={handleClickPlusBtn}
            disabled={isDisabledPlusBtn}
          />
        }
        onClick={handleClickItem}
      />
    </IonContent>
  );
}
