import { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import { CrowdBibleUI, PlusButton } from '@eten-lab/ui-kit';

import { RouteConst } from '@/constants/route.constant';

// import { LanguageDto } from '@/dtos/language.dto';
import { AppDto } from '@/dtos/document.dto';

import { useAppContext } from '@/hooks/useAppContext';
import { useDocument } from '@/hooks/useDocument';
// import { useLanguage, MockApp } from '@/hooks/useLanguage';

// import { LanguageInfo } from '@eten-lab/ui-kit';

import { LanguageSelectionBox } from '@/components/LanguageSelectionBox';

const { ButtonList } = CrowdBibleUI;
// const { HeadBox, ButtonList } = CrowdBibleUI;

type ButtonListItemType = CrowdBibleUI.ButtonListItemType;

export function SiteTextAppListPage() {
  const history = useHistory();
  const {
    states: {
      global: { singletons },
      // documentTools: { sourceLanguage, targetLanguage },
    },
    // actions: { setSourceLanguage, setTargetLanguage },
  } = useAppContext();

  const { listApp } = useDocument();

  const [appList, setAppList] = useState<AppDto[]>([]);
  // const [languageList, setLanguageList] = useState<LanguageDto[]>([]);

  // Fetch language Lists from db
  // useEffect(() => {
  //   if (singletons) {
  //     getLanguages().then(setLanguageList);
  //   }
  // }, [singletons, getLanguages]);

  // Fetch Mock App Lists from db
  useEffect(() => {
    if (singletons) {
      listApp().then(setAppList);
    }
  }, [listApp, singletons]);

  // const handleSetSourceLanguage = (value: LanguageInfo | null) => {
  //   setSourceLanguage(value);
  // };

  // const handleSetTargetLanguage = (value: LanguageInfo | null) => {
  //   setTargetLanguage(value);
  // };

  // const handleClickBackBtn = () => {
  //   history.goBack();
  // };

  const handleClickPlusBtn = () => {
    alert('This button is in WIP');
  };

  const handleClickItem = (value: string) => {
    history.push(`${RouteConst.SITE_TEXT_LIST}/${value}`);
  };

  const items: ButtonListItemType[] = useMemo(() => {
    return appList.map((app) => ({
      value: app.id,
      label: app.name,
    }));
  }, [appList]);

  return (
    <IonContent>
      {/* <HeadBox
        back={{ action: handleClickBackBtn }}
        title="Applications"
        languageSelector={{
          languageList: languageList,
          source: sourceLanguage,
          target: targetLanguage,
          onChangeSource: handleSetSourceLanguage,
          onChangeTarget: handleSetTargetLanguage,
        }}
      /> */}
      <LanguageSelectionBox />
      <ButtonList
        label="Select a chapter"
        withUnderline
        items={items}
        toolBtnGroup={
          <PlusButton variant="primary" onClick={handleClickPlusBtn} />
        }
        onClick={handleClickItem}
      />
    </IonContent>
  );
}
