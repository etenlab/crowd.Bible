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
import { useLanguage, MockApp } from '@/hooks/useLanguage';

import { SiteTextWithTranslationCntDto } from '@/dtos/site-text.dto';

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
  const { getSiteTextListByAppId } = useSiteText();
  const { getMockAppById } = useLanguage();

  const [searchStr, setSearchStr] = useState<string>('');
  const [siteTextList, setSiteTextList] = useState<
    SiteTextWithTranslationCntDto[]
  >([]);
  const [app, setApp] = useState<MockApp | null>(null);

  // Fetch site Lists from db
  useEffect(() => {
    if (singletons) {
      getSiteTextListByAppId(appId).then((list) => setSiteTextList(list));
      getMockAppById(appId).then(setApp);
    }
  }, [getSiteTextListByAppId, getMockAppById, singletons, appId]);

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
      const recommandedBadgeCom =
        data.translated?.type === 'recommended' ? (
          <Chip
            component="span"
            label="Recommended"
            variant="outlined"
            color="warning"
            size="small"
            sx={{ marginLeft: 2 }}
          />
        ) : null;

      const notranslatedBadgeCom = !data.translated ? (
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
          {data.translated ? data.translated.siteText : data.siteText}
          {recommandedBadgeCom}
          {notranslatedBadgeCom}
        </>
      );

      return {
        value: data.id,
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
    app && sourceLanguage && app.languageId === sourceLanguage.id
      ? false
      : true;

  return (
    <IonContent>
      <HeadBox
        back={{ action: handleClickBackBtn }}
        title="App Name 1"
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
          {sourceLanguage ? sourceLanguage.name : 'Unknown'}
        </Typography>

        <BiRightArrowAlt style={{ color: getColor('gray') }} />

        <Typography variant="body2" color="text.dark">
          {targetLanguage ? targetLanguage.name : 'Unknown'}
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
