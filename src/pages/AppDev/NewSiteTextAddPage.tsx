import { ChangeEventHandler, useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import {
  CrowdBibleUI,
  Input,
  TextArea,
  Button,
  MuiMaterial,
} from '@eten-lab/ui-kit';

import { useAppContext } from '@/hooks/useAppContext';
import { useSiteText } from '@/hooks/useSiteText';
import { useDocument } from '@/hooks/useDocument';

import { SelectableDefinitionCandidateList } from '@/components/SelectableDefinitionCandidateList';

import { AppDto } from '@/dtos/document.dto';
import { FeedbackTypes } from '@/constants/common.constant';

import { PageLayout } from '@/components/Layout';

const { HeadBox } = CrowdBibleUI;
const { Stack, Divider } = MuiMaterial;

export function NewSiteTextAddPage() {
  const history = useHistory();
  const { appId, siteTextId } = useParams<{
    appId: Nanoid;
    siteTextId?: Nanoid;
  }>();
  const {
    states: {
      global: { singletons },
    },
    actions: { alertFeedback },
  } = useAppContext();
  const { createOrFindSiteText, getRecommendedSiteText, tr } = useSiteText();
  const { getAppById } = useDocument();

  const [app, setApp] = useState<AppDto | null>(null);

  const [word, setWord] = useState<string>('');
  const [bouncedWord] = useDebounce(word, 1000);

  const [description, setDescription] = useState<string>('');

  // Fetch site Lists from db
  useEffect(() => {
    if (singletons && appId) {
      getAppById(appId).then(setApp);
    }
  }, [getAppById, singletons, appId]);

  // Fetch site text word from db
  useEffect(() => {
    (async () => {
      if (app && siteTextId) {
        const siteText = await getRecommendedSiteText(
          app.id,
          siteTextId,
          app.languageInfo,
        );

        if (siteText) {
          setWord(siteText.translatedSiteText || '');
        }
      }
    })();
  }, [app, siteTextId, getRecommendedSiteText]);

  const handleChangeWord: ChangeEventHandler<HTMLInputElement> = (event) => {
    setWord(event.target.value);
  };

  const handleChangeDescription: ChangeEventHandler<HTMLTextAreaElement> = (
    event,
  ) => {
    setDescription(event.target.value);
  };

  const handleChangeDescriptionForCandidateList = useCallback(
    (description: string) => {
      setDescription(description);
    },
    [],
  );

  const handleClickSave = async () => {
    if (app) {
      const result = await createOrFindSiteText(
        appId,
        app.languageInfo,
        bouncedWord,
        description,
      );

      if (result) {
        history.goBack();
      }
    } else {
      alertFeedback(FeedbackTypes.ERROR, 'Not exists appId');
    }
  };

  const handleClickCancel = () => {
    history.goBack();
  };

  const selectableCandidateListCom = app?.languageInfo ? (
    <SelectableDefinitionCandidateList
      word={bouncedWord}
      languageInfo={app?.languageInfo}
      description={description}
      onChangeDescription={handleChangeDescriptionForCandidateList}
    />
  ) : null;

  return (
    <PageLayout>
      <HeadBox title={tr('Add New Site Txt')} appTitle={app?.name || ''} />
      <Stack gap="12px" sx={{ padding: '20px' }}>
        <Input
          label={tr('Site Text')}
          withLegend={false}
          value={word}
          onChange={handleChangeWord}
        />
        <TextArea
          label={tr('Description')}
          withLegend={false}
          value={description}
          onChange={handleChangeDescription}
        />

        <Button variant="contained" onClick={handleClickSave}>
          {tr('Save')}
        </Button>
        <Button variant="text" onClick={handleClickCancel}>
          {tr('Cancel')}
        </Button>
      </Stack>

      <Divider />
      {selectableCandidateListCom}
    </PageLayout>
  );
}
