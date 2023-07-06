import { useState, useMemo, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useIonViewDidEnter } from '@ionic/react';

import { PageLayout } from '@/components/Layout';

import {
  MuiMaterial,
  CrowdBibleUI,
  FilterButton,
  PlusButton,
} from '@eten-lab/ui-kit';

import { AppDto } from '@/dtos/document.dto';

import { useAppContext } from '@/hooks/useAppContext';
import { useDocument } from '@/hooks/useDocument';
import { useTr } from '@/hooks/useTr';

import { RouteConst } from '@/constants/route.constant';

import { LanguageStatusBar } from '@/components/LanguageStatusBar';
import { LanguageFilter } from '@/components/LanguageFilter';

import { langInfo2String } from '@/utils/langUtils';
import { FeedbackTypes } from '@/constants/common.constant';

const { ButtonList, HeadBox } = CrowdBibleUI;
const { Stack } = MuiMaterial;

type ButtonListItemType = CrowdBibleUI.ButtonListItemType;

export function AppListPage() {
  const history = useHistory();
  const {
    states: {
      global: { singletons },
      documentTools: { sourceLanguage, targetLanguage },
    },
    actions: { setModalCom, alertFeedback },
  } = useAppContext();
  const { tr } = useTr();
  const { listApp } = useDocument();

  const [apps, setApps] = useState<AppDto[]>([]);
  const [searchStr, setSearchStr] = useState<string>('');

  // Fetch Document Lists from db
  useIonViewDidEnter(() => {
    if (singletons) {
      listApp().then(setApps);
    }
  }, [listApp, singletons]);

  useEffect(() => {
    if (singletons) {
      listApp().then(setApps);
    }
  }, [listApp, singletons]);

  const handleChangeSearchStr = (str: string) => {
    setSearchStr(str);
  };

  const handleClickLanguageFilter = () => {
    setModalCom(<LanguageFilter />);
  };

  const handleClickApp = (appId: Nanoid) => {
    if (sourceLanguage === null || targetLanguage === null) {
      alertFeedback(
        FeedbackTypes.WARNING,
        'Please choose source and target languages!',
      );
      return;
    }
    history.push(`${RouteConst.SITE_TEXT_LIST}/${appId}`);
  };

  const handleClickBack = () => {
    history.push(`${RouteConst.SITE_TEXT_MENU_PAGE}`);
  };

  const handleClickAddAppBtn = () => {
    history.push(`${RouteConst.ADD_APPLICATION}`);
  };

  const items: ButtonListItemType[] = useMemo(() => {
    return apps.map(({ id, name, languageInfo }) => ({
      value: id,
      label: `${name} (${langInfo2String(languageInfo)})`,
    }));
  }, [apps]);

  return (
    <PageLayout>
      <HeadBox
        title={tr('Applications')}
        back={{ action: handleClickBack }}
        search={{
          value: searchStr,
          onChange: handleChangeSearchStr,
          placeHolder: tr('Input a search word!'),
        }}
      />
      <LanguageStatusBar />
      <ButtonList
        label={tr('List of Applications')}
        withUnderline={true}
        items={items}
        onClick={handleClickApp}
        toolBtnGroup={
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="flex-start"
            gap="16px"
          >
            <FilterButton
              variant="secondary"
              onClick={handleClickLanguageFilter}
            />
            <PlusButton variant="primary" onClick={handleClickAddAppBtn} />
          </Stack>
        }
      />
    </PageLayout>
  );
}
