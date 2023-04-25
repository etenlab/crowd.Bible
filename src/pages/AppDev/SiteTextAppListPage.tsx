//!!!i'll use it as reference
import { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import { CrowdBibleUI, PlusButton } from '@eten-lab/ui-kit';

import { RouteConst } from '@/constants/route.constant';

import { LanguageDto } from '@/dtos/language.dto';

import { useAppContext } from '@/hooks/useAppContext';
import { useLanguage, MockApp } from '@/hooks/useLanguage';

const { HeadBox, ButtonList } = CrowdBibleUI;

type ButtonListItemType = CrowdBibleUI.ButtonListItemType;

export function SiteTextAppListPage() {
  const history = useHistory();
  const {
    states: {
      global: { singletons },
      documentTools: { sourceLanguage, targetLanguage },
    },
    actions: { setSourceLanguage, setTargetLanguage },
  } = useAppContext();
  const { getLanguages, getMockAppList } = useLanguage();

  const [appList, setAppList] = useState<MockApp[]>([]);
  const [languageList, setLanguageList] = useState<LanguageDto[]>([]);

  // Fetch language Lists from db
  useEffect(() => {
    if (singletons) {
      getLanguages().then(setLanguageList);
    }
  }, [singletons, getLanguages]);

  // Fetch Mock App Lists from db
  useEffect(() => {
    if (singletons) {
      getMockAppList().then(setAppList);
    }
  }, [singletons, getMockAppList]);

  const handleSetSourceLanguage = (value: LanguageDto | null) => {
    setSourceLanguage(value);
  };

  const handleSetTargetLanguage = (value: LanguageDto | null) => {
    setTargetLanguage(value);
  };

  const handleClickBackBtn = () => {
    history.goBack();
  };

  const handleClickPlusBtn = () => {
    console.log('Clicked Plus Btn');
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
      <HeadBox
        back={{ action: handleClickBackBtn }}
        title="Applications"
        languageSelector={{
          languageList: languageList,
          source: sourceLanguage,
          target: targetLanguage,
          onChangeSource: handleSetSourceLanguage,
          onChangeTarget: handleSetTargetLanguage,
        }}
      />
      <ButtonList
        label="Select a chapter"
        withUnderline
        items={items}
        toolBtnGroup={
          <PlusButton variant="primary" onClick={handleClickPlusBtn} disabled />
        }
        onClick={handleClickItem}
      />
    </IonContent>
  );
}
