import { useState, ChangeEventHandler } from 'react';
import { useHistory } from 'react-router-dom';

import { PageLayout } from '@/components/Layout';

import {
  Input,
  Autocomplete,
  LangSelector,
  LanguageInfo,
  Button,
  MuiMaterial,
  CrowdBibleUI,
} from '@eten-lab/ui-kit';

import { useDocument } from '@/hooks/useDocument';
import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import { RouteConst } from '@/constants/route.constant';
import { FeedbackTypes } from '@/constants/common.constant';
import { compareLangInfo } from '@/utils/langUtils';

const { Stack } = MuiMaterial;
const { HeadBox } = CrowdBibleUI;

const mockOrganizationName = 'Organization Name 1';

export function NewApplicationAddPage() {
  const history = useHistory();
  const { createOrFindApp, getApp } = useDocument();
  const {
    actions: { setLoadingState, alertFeedback },
  } = useAppContext();
  const { tr } = useTr();

  const [appName, setAppName] = useState<string>('');
  const [language, setLanguage] = useState<LanguageInfo>();

  const handleChangeName: ChangeEventHandler<HTMLInputElement> = (event) => {
    setAppName(event.target.value);
  };

  const handleChangeLanguage = (_langTag: string, selected: LanguageInfo) => {
    if (compareLangInfo(selected, language)) return;
    setLanguage(selected);
  };

  const handleClickSave = async () => {
    if (!language || appName.trim().length === 0) {
      return;
    }

    const oldApp = await getApp(appName);

    if (oldApp) {
      alertFeedback(FeedbackTypes.ERROR, 'Already exists with the same name!');
      return;
    }

    const app = await createOrFindApp(appName, mockOrganizationName, language);

    if (app === null) {
      return;
    }

    history.push(RouteConst.APPLICATION_LIST);
  };

  const handleClickCancel = () => {
    history.push(`${RouteConst.APPLICATION_LIST}`);
  };

  return (
    <PageLayout>
      <HeadBox title={tr('Add New Application')} />
      <Stack sx={{ padding: '20px' }} gap="12px">
        <Autocomplete
          label={tr('Choose Organization Name')}
          defaultValue={mockOrganizationName}
          options={[mockOrganizationName]}
          withLegend={false}
          disabled={true}
        />
        <Input
          label={tr('Input Application Name')}
          value={appName}
          onChange={handleChangeName}
        />
        <LangSelector
          label={tr('Select the language')}
          selected={language}
          onChange={handleChangeLanguage}
          setLoadingState={setLoadingState}
        />
      </Stack>
      <Stack sx={{ padding: '20px' }}>
        <Button variant="contained" onClick={handleClickSave} fullWidth>
          {tr('+ Add New')}
        </Button>
        <Button variant="text" onClick={handleClickCancel} fullWidth>
          {tr('Cancel')}
        </Button>
      </Stack>
    </PageLayout>
  );
}
