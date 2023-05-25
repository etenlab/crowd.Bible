import { useEffect, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { IonContent } from '@ionic/react';

import {
  Button,
  MuiMaterial,
  CrowdBibleUI,
  LangSelector,
  LanguageInfo,
} from '@eten-lab/ui-kit';

import { AppDto } from '@/dtos/document.dto';

import { useAppContext } from '@/hooks/useAppContext';
import { useDocument } from '@/hooks/useDocument';

import { compareLangInfo } from '@/utils/langUtils';
import { RouteConst } from '@/constants/route.constant';

import { LanguageStatusBar } from '@/components/LanguageStatusBar';

const { ButtonList, HeadBox } = CrowdBibleUI;
const { Stack } = MuiMaterial;

type ButtonListItemType = CrowdBibleUI.ButtonListItemType;

export function SiteTextAppListPage() {
  const history = useHistory();
  const {
    states: {
      global: { singletons },
      documentTools: { sourceLanguage, targetLanguage },
    },
    actions: { setSourceLanguage, setTargetLanguage, setLoadingState },
  } = useAppContext();

  const { listApp, listAppByLanguageInfo } = useDocument();

  const [apps, setApps] = useState<AppDto[]>([]);
  const [searchStr, setSearchStr] = useState<string>('');
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  // Fetch Document Lists from db
  useEffect(() => {
    if (singletons) {
      // if (sourceLanguage) {
      // listAppByLanguageInfo(sourceLanguage).then(setApps);
      // } else {
      listApp().then(setApps);
      // }
    }
  }, [listApp, singletons, listAppByLanguageInfo, sourceLanguage]);

  const handleChangeSearchStr = (str: string) => {
    setSearchStr(str);
  };

  const handleClickLanguageFilter = () => {
    setFilterOpen((open) => !open);
  };

  const handleSetSourceLanguage = (
    _langTag: string,
    selected: LanguageInfo,
  ) => {
    if (compareLangInfo(selected, sourceLanguage)) return;
    setSourceLanguage(selected);
  };

  const handleSetTargetLanguage = (
    _langTag: string,
    selected: LanguageInfo,
  ) => {
    if (compareLangInfo(selected, targetLanguage)) return;
    setTargetLanguage(selected);
  };

  const handleClickApp = (appId: string) => {
    history.push(`${RouteConst.SITE_TEXT_LIST}/${appId}`);
  };

  const handleClickBack = () => {
    history.push(`${RouteConst.APPLICATION_LIST}`);
  };

  const handleClickSearchButton = () => {
    setFilterOpen(false);
  };

  const items: ButtonListItemType[] = useMemo(() => {
    return apps.map(({ id, name }) => ({
      value: id,
      label: name,
    }));
  }, [apps]);

  const langSelectorCom = filterOpen ? (
    <Stack gap="30px" sx={{ padding: '20px' }}>
      <LangSelector
        selected={sourceLanguage || undefined}
        onChange={handleSetSourceLanguage}
        setLoadingState={setLoadingState}
      />
      <LangSelector
        selected={targetLanguage || undefined}
        onChange={handleSetTargetLanguage}
        setLoadingState={setLoadingState}
      />
      <Button variant="contained" onClick={handleClickSearchButton}>
        Search
      </Button>
    </Stack>
  ) : null;

  const buttonListCom = !filterOpen ? (
    <Stack gap="16px">
      <LanguageStatusBar />
      <ButtonList
        label="List of Docs"
        search={{
          value: searchStr,
          onChange: handleChangeSearchStr,
          placeHolder: 'Input Search Word...',
        }}
        withUnderline={true}
        items={items}
        onClick={handleClickApp}
      />
    </Stack>
  ) : null;

  return (
    <IonContent>
      <HeadBox
        title="Applications"
        filter={{
          onClick: handleClickLanguageFilter,
        }}
        back={{
          action: handleClickBack,
        }}
      />
      {langSelectorCom}
      {buttonListCom}
    </IonContent>
  );
}
