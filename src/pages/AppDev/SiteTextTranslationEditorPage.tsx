import { ChangeEventHandler, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import {
  CrowdBibleUI,
  Input,
  TextArea,
  Button,
  MuiMaterial,
  Autocomplete,
} from '@eten-lab/ui-kit';

import { LanguageDto } from '@/dtos/language.dto';

const { HeadBox } = CrowdBibleUI;
const { Stack, Typography } = MuiMaterial;

const MockLanguageList = [
  { id: '1', name: 'English' },
  { id: '2', name: 'Spanish' },
  { id: '3', name: 'Danish' },
];

export function SiteTextTranslationEditorPage() {
  const history = useHistory();

  const [word, setWord] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [target, setTarget] = useState<LanguageDto | null>(null);

  const handleClickBackBtn = () => {
    history.goBack();
  };

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

  const handleSetTargetLanguage = (
    _event: React.SyntheticEvent<Element, Event>,
    value: LanguageDto | null,
  ) => {
    setTarget(value);
  };

  return (
    <IonContent>
      <HeadBox
        back={{ action: handleClickBackBtn }}
        title="Add New Translation"
        extraNode={<Input value="Ipsum" disabled />}
      />
      <Stack gap="12px" sx={{ padding: '20px' }}>
        <Typography variant="body1" color="text.dark">
          Ipsum is placeholder text commonly used in the graphic, print, and
          publishing industries for previewing layouts.
        </Typography>

        <Autocomplete
          label="Choose Source Language"
          options={MockLanguageList}
          value={target}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.name}
          onChange={handleSetTargetLanguage}
          withLegend={false}
        />

        <Input
          label="Translation"
          withLegend={false}
          value={word}
          onChange={handleChangeWord}
        />
        <TextArea
          label="Description of Translation"
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
