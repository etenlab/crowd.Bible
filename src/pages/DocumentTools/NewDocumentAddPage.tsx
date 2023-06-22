import { useState, useEffect, ChangeEventHandler } from 'react';
import { useHistory } from 'react-router-dom';

import { Input, TextArea, Button, MuiMaterial } from '@eten-lab/ui-kit';

import { useDocument } from '@/hooks/useDocument';
import { useWordSequence } from '@/hooks/useWordSequence';
import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import { RouteConst } from '@/constants/route.constant';
import { FeedbackTypes } from '@/constants/common.constant';

import { PageLayout } from '@/components/Layout';

const { Stack } = MuiMaterial;

const mockImportUid = '42';

export function NewDocumentAddPage() {
  const history = useHistory();
  const { createOrFindDocument } = useDocument();
  const { createWordSequence } = useWordSequence();
  const {
    states: {
      documentTools: { sourceLanguage },
    },
    actions: { alertFeedback },
  } = useAppContext();
  const { tr } = useTr();

  const [name, setName] = useState<string>('');
  const [origin, setOrigin] = useState<string>('');

  useEffect(() => {
    if (!sourceLanguage) {
      alertFeedback(FeedbackTypes.WARNING, 'Please set source language!');
      history.push(RouteConst.DOCUMENTS_LIST);
    }
  }, [sourceLanguage, alertFeedback, history]);

  const handleChangeName: ChangeEventHandler<HTMLInputElement> = (event) => {
    setName(event.target.value);
  };

  const handleChangeOrigin: ChangeEventHandler<HTMLTextAreaElement> = (
    event,
  ) => {
    setOrigin(event.target.value);
  };

  const handleClickSave = async () => {
    if (!sourceLanguage) {
      return;
    }

    const document = await createOrFindDocument(name, sourceLanguage);

    if (document === null) {
      return;
    }

    const wordSequence = await createWordSequence({
      text: origin,
      languageInfo: sourceLanguage,
      documentId: document.id,
      importUid: mockImportUid,
    });

    if (wordSequence === null) {
      return;
    }

    history.push(RouteConst.DOCUMENTS_LIST);
  };

  return (
    <PageLayout>
      <Stack sx={{ padding: '20px' }} gap="20px">
        <Input
          label={tr('Input Document Name')}
          value={name}
          onChange={handleChangeName}
        />

        <TextArea
          label={tr('Input Original Document')}
          value={origin}
          onChange={handleChangeOrigin}
        />

        <Button variant="contained" onClick={handleClickSave} fullWidth>
          {tr('Save Document')}
        </Button>
      </Stack>
    </PageLayout>
  );
}
