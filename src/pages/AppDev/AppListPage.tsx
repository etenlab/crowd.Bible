import { useEffect, useState, useMemo, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { PageLayout } from '@/components/Layout';

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
import { useTr } from '@/hooks/useTr';

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
    actions: { setSourceLanguage, createLoadingStack },
  } = useAppContext();
  const { tr } = useTr();
  const { listApp, listAppByLanguageInfo } = useDocument();

  const [apps, setApps] = useState<AppDto[]>([]);
  const [searchStr, setSearchStr] = useState<string>('');
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  const loadingRef = useRef(createLoadingStack());

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

  const handleLoadingState = (loading: boolean) => {
    if (loading) {
      loadingRef.current.startLoading();
    } else {
      loadingRef.current.stopLoading();
    }
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
      label={tr('Select the source language')}
      selected={sourceLanguage || undefined}
      onChange={handleSetSourceLanguage}
      setLoadingState={handleLoadingState}
    />
  ) : null;

  return (
    <PageLayout>
      <HeadBox
        title={tr('Applications')}
        filter={{
          onClick: handleClickLanguageFilter,
        }}
        back={{ action: handleClickBack }}
        search={{
          value: searchStr,
          onChange: handleChangeSearchStr,
          placeHolder: tr('Input a search word!'),
        }}
      />
      <Box sx={{ padding: '20px' }}>
        <LanguageStatus lang={sourceLanguage} />
        {langSelectorCom}
      </Box>
      <ButtonList
        label={tr('List of Applications')}
        withUnderline={true}
        items={items}
        onClick={handleClickApp}
        toolBtnGroup={
          <PlusButton variant="primary" onClick={handleClickAddAppBtn} />
        }
      />
    </PageLayout>
  );
}
