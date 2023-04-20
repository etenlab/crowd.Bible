import { useState, useEffect, ChangeEventHandler } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import { Input, TextArea, Button, MuiMaterial } from '@eten-lab/ui-kit';

import { useDocument } from '@/hooks/useDocument';
import { useWordSequence } from '@/hooks/useWordSequence';
import { useAppContext } from '@/hooks/useAppContext';

const { Stack } = MuiMaterial;

const mockImportUid = '42';

export function NewDocumentAddPage() {
  const history = useHistory();
  const { createDocument } = useDocument();
  const { createWordSequence } = useWordSequence();
  const {
    states: {
      documentTools: { sourceLanguage },
    },
    actions: { alertFeedback },
  } = useAppContext();

  const [name, setName] = useState<string>('');
  const [origin, setOrigin] = useState<string>('');

  useEffect(() => {
    if (!sourceLanguage) {
      alertFeedback('warning', 'Please set source language!');
      history.push('/documents-list');
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

    const document = await createDocument(name);

    if (document === null) {
      return;
    }

    const wordSequence = await createWordSequence(
      origin,
      document.id,
      mockImportUid,
      sourceLanguage.id,
      true,
    );

    if (wordSequence === null) {
      return;
    }

    if (document) {
      history.push('/documents-list');
    }
  };

  return (
    <IonContent>
      <Stack sx={{ padding: '20px' }} gap="20px">
        <Input
          label="Input Document Name"
          value={name}
          onChange={handleChangeName}
        />

        <TextArea
          label="Input Original Document"
          value={origin}
          onChange={handleChangeOrigin}
        />

        <Button variant="contained" onClick={handleClickSave} fullWidth>
          Save Document
        </Button>
      </Stack>
    </IonContent>
  );
}
