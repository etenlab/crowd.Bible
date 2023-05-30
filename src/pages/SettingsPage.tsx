import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import {
  CrowdBibleUI,
  MuiMaterial,
  Typography,
  Button,
} from '@eten-lab/ui-kit';

import { useAppContext } from '@/hooks/useAppContext';
import { IMode } from '@/reducers/global.reducer';

const { VerticalRadioList } = CrowdBibleUI;
const { Divider, FormControlLabel, FormGroup, FormLabel, Stack, Switch } =
  MuiMaterial;

export const roles = [
  { value: 'translator', label: 'Translator Role' },
  { value: 'reader', label: 'Reader Role' },
];

export const connectivities = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
];

export function SettingsPage() {
  const history = useHistory();
  const {
    states: {
      global: { mode, connectivity },
    },
    actions: { setMode, setConnectivity },
  } = useAppContext();

  const [selectedMode, setSelectedMode] = useState<IMode>({
    admin: true,
    beta: true,
  });

  useEffect(() => {
    setSelectedMode(mode);
  }, [mode]);

  const handleChangeConnectivity = (
    _event: React.SyntheticEvent<Element, Event>,
    value: 'online' | 'offline',
  ) => {
    if (value === 'online') {
      setConnectivity(true);
    } else {
      setConnectivity(false);
    }
  };

  const handleChangeMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMode({
      ...selectedMode,
      [event.target.name]: event.target.checked,
    });
  };

  const handleClickSave = () => {
    setMode(selectedMode);
    history.push('/home');
  };

  return (
    <IonContent>
      <Stack sx={{ padding: '20px' }} gap="20px">
        <Typography variant="h2" color="text.dark">
          Settings
        </Typography>
        <VerticalRadioList
          label="Network"
          withUnderline={true}
          items={connectivities}
          value={connectivity ? 'online' : 'offline'}
          onChange={handleChangeConnectivity}
        />
        <FormGroup>
          <FormLabel color="gray">Mode</FormLabel>
          <FormControlLabel
            control={
              <Switch
                checked={selectedMode.admin}
                onChange={handleChangeMode}
              />
            }
            label="admin"
            name="admin"
            sx={{ padding: '12px 0' }}
          />
          <Divider />
          <FormControlLabel
            control={
              <Switch checked={selectedMode.beta} onChange={handleChangeMode} />
            }
            label="Beta"
            name="beta"
            sx={{ padding: '12px 0' }}
          />
        </FormGroup>
        <Button
          variant="contained"
          fullWidth
          color="blue-primary"
          onClick={handleClickSave}
          sx={{ marginBottom: '5px !important' }}
        >
          Save
        </Button>
      </Stack>
    </IonContent>
  );
}
