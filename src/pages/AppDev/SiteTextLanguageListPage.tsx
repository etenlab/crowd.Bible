import { useState, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import {
  CrowdBibleUI,
  PlusButton,
  Typography,
  MuiMaterial,
} from '@eten-lab/ui-kit';

import { RouteConst } from '@/constants/route.constant';

import { useAppContext } from '@/hooks/useAppContext';
import { useSiteText } from '@/hooks/useSiteText';
import { useDocument } from '@/hooks/useDocument';

import { LanguageStatusBar } from '@/components/LanguageStatusBar';

import { AppDto } from '@/dtos/document.dto';
import { TranslatedSiteTextDto } from '@/dtos/site-text.dto';

import { compareLangInfo } from '@/utils/langUtils';

const { HeadBox, ButtonList } = CrowdBibleUI;
const { Stack, Chip } = MuiMaterial;

type ButtonListItemType = CrowdBibleUI.ButtonListItemType;

export function SiteTextLanguageListPage() {
  // const history = useHistory();
  // const {
  //   states: {
  //     global: { singletons },
  //     documentTools: { sourceLanguage, targetLanguage },
  //   },
  // } = useAppContext();
  // const { getTranslatedSiteTextListByAppId } = useSiteText();

  // const [searchStr, setSearchStr] = useState<string>('');
  // const [siteTextList, setSiteTextList] = useState<TranslatedSiteTextDto[]>([]);
  // const [app, setApp] = useState<AppDto | null>(null);

  // // Fetch site Lists from db
  // useEffect(() => {
  //   if (singletons && app && sourceLanguage && targetLanguage) {
  //     getTranslatedSiteTextListByAppId(
  //       app.id,
  //       sourceLanguage,
  //       targetLanguage,
  //     ).then((list) => setSiteTextList(list));
  //   }
  // }, [
  //   app,
  //   singletons,
  //   sourceLanguage,
  //   targetLanguage,
  //   getTranslatedSiteTextListByAppId,
  // ]);

  // const handleChangeSearchStr = (str: string) => {
  //   setSearchStr(str);
  // };

  // const handleClickBackBtn = () => {
  //   history.push(`${RouteConst.SITE_TEXT_TRANSLATION_APP_LIST}`);
  // };

  // const handleClickPlusBtn = () => {
  //   history.push(`${RouteConst.ADD_NEW_SITE_TEXT}/${appId}`);
  // };

  // const handleClickItem = (siteTextId: string) => {
  //   history.push(`${RouteConst.SITE_TEXT_DETAIL}/${appId}/${siteTextId}`);
  // };

  // const items: ButtonListItemType[] = useMemo(() => {
  //   return siteTextList.map((data) => {
  //     const notranslatedBadgeCom = !data.translatedSiteText ? (
  //       <Chip
  //         component="span"
  //         label="Not translated"
  //         variant="outlined"
  //         color="error"
  //         size="small"
  //         sx={{ marginLeft: 2 }}
  //       />
  //     ) : null;

  //     const labelCom = (
  //       <Stack
  //         direction="row"
  //         justifyContent="space-between"
  //         alignItems="center"
  //       >
  //         <Typography variant="body1" color="text.dark">
  //           {data.siteText}
  //         </Typography>
  //         <Typography variant="body1" color="text.dark">
  //           {data.translatedSiteText
  //             ? data.translatedSiteText
  //             : notranslatedBadgeCom}
  //         </Typography>
  //       </Stack>
  //     );

  //     return {
  //       value: data.siteTextId,
  //       label: labelCom,
  //     };
  //   });
  // }, [siteTextList]);

  // const isDisabledPlusBtn =
  //   app && sourceLanguage && compareLangInfo(app.languageInfo, sourceLanguage)
  //     ? false
  //     : true;

  return (
    <IonContent>
      Language List
      {/* <HeadBox
        title="Applications"
        search={{
          value: searchStr,
          onChange: handleChangeSearchStr,
          placeHolder: 'Input a search word!',
        }}
        back={{
          action: handleClickBackBtn,
        }}
      />
      <Stack gap="16px">
        <LanguageStatusBar />
        <ButtonList
          label="List of site text"
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
      </Stack> */}
    </IonContent>
  );
}
