import { ChangeEventHandler, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import {
  CrowdBibleUI,
  Input,
  TextArea,
  Button,
  MuiMaterial,
} from '@eten-lab/ui-kit';

const { HeadBox } = CrowdBibleUI;
const { Stack } = MuiMaterial;

export function SiteTextEditorPage() {
  const history = useHistory();

  const [word, setWord] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleChangeWord: ChangeEventHandler<HTMLInputElement> = (event) => {
    setWord(event.target.value);
  };

  const handleChangeDescription: ChangeEventHandler<HTMLTextAreaElement> = (
    event,
  ) => {
    setDescription(event.target.value);
  };

  const handleClickSave = () => {
    history.goBack();
  };

  const handleClickCancel = () => {
    history.goBack();
  };

  return (
    <IonContent>
      <HeadBox title="Add New Site Txt" appTitle="App Name 1" />
      <Stack gap="12px" sx={{ padding: '20px' }}>
        <Input
          label="Site Text"
          withLegend={false}
          value={word}
          onChange={handleChangeWord}
        />
        <TextArea
          label="Description"
          withLegend={false}
          value={description}
          onChange={handleChangeDescription}
        />

        <hr />

        <Button variant="contained" onClick={handleClickSave}>
          Save
        </Button>
        <Button variant="text" onClick={handleClickCancel}>
          Cancel
        </Button>
      </Stack>
    </IonContent>
  );
}
