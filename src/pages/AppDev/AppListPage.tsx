import { useEffect, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { IonContent } from '@ionic/react';

import {
  MuiMaterial,
  CrowdBibleUI,
  PlusButton,
  LangSelector,
  LanguageInfo,
  BiDotsHorizontalRounded,
} from '@eten-lab/ui-kit';

import { AppDto } from '@/dtos/document.dto';

import { useAppContext } from '@/hooks/useAppContext';
import { useDocument } from '@/hooks/useDocument';

import { compareLangInfo } from '@/utils/langUtils';
import { RouteConst } from '@/constants/route.constant';

import { LanguageStatus } from '@/components/LanguageStatusBar';

const { ButtonList, HeadBox } = CrowdBibleUI;
const { Box } = MuiMaterial;

type ButtonListItemType = CrowdBibleUI.ButtonListItemType;

export function AppListPage() {
  const history = useHistory();
  const {
    states: {
      global: { singletons },
      documentTools: { sourceLanguage },
    },
    actions: { setSourceLanguage, setLoadingState },
  } = useAppContext();

  const { listApp, listAppByLanguageInfo } = useDocument();

  const [apps, setApps] = useState<AppDto[]>([]);
  const [searchStr, setSearchStr] = useState<string>('');
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  // Fetch Document Lists from db
  useEffect(() => {
    if (singletons) {
      if (sourceLanguage) {
        listAppByLanguageInfo(sourceLanguage).then(setApps);
      } else {
        listApp().then(setApps);
      }
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

  const handleClickApp = (appId: string) => {
    // history.push(`${RouteConst.APPLICATION_LIST}/${appId}`);
  };

  const handleClickAddAppBtn = () => {
    history.push(`${RouteConst.ADD_APPLICATION}`);
  };

  const handleClickBack = () => {
    history.push(`${RouteConst.HOME}`);
  };

  const items: ButtonListItemType[] = useMemo(() => {
    return apps.map(({ id, name }) => ({
      value: id,
      label: name,
      endIcon: (
        <BiDotsHorizontalRounded
          style={{
            borderRadius: '7px',
            padding: '7px',
            fontSize: '32px',
            background: '#E3EAF3',
          }}
        />
      ),
    }));
  }, [apps]);

  const langSelectorCom = filterOpen ? (
    <LangSelector
      selected={sourceLanguage || undefined}
      onChange={handleSetSourceLanguage}
      setLoadingState={setLoadingState}
    />
  ) : null;

  return (
    <IonContent>
      <HeadBox
        title="Applications"
        filter={{
          onClick: handleClickLanguageFilter,
        }}
        back={{ action: handleClickBack }}
        search={{
          value: searchStr,
          onChange: handleChangeSearchStr,
          placeHolder: 'Input a search word!',
        }}
      />
      <Box sx={{ padding: '20px' }}>
        <LanguageStatus lang={sourceLanguage} />
        {langSelectorCom}
      </Box>
      <ButtonList
        label="List of Applications"
        withUnderline={true}
        items={items}
        onClick={handleClickApp}
        toolBtnGroup={
          <PlusButton variant="primary" onClick={handleClickAddAppBtn} />
        }
      />
    </IonContent>
  );
}
