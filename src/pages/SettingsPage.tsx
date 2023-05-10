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
import { type RoleType } from '@/reducers/global.reducer';

const { VerticalRadioList } = CrowdBibleUI;
const { Stack } = MuiMaterial;

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
      global: { user, connectivity },
    },
    actions: { setRole, setConnectivity },
  } = useAppContext();

  const [selectedRole, setSelectedRole] = useState<RoleType>(['translator']);

  useEffect(() => {
    if (user != null) {
      setSelectedRole(user.roles);
    }
  }, [user]);

  const handleChangeRole = (
    _event: React.SyntheticEvent<Element, Event>,
    role: RoleType,
  ) => {
    setSelectedRole(role);
  };

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

  const handleClickSave = () => {
    setRole(selectedRole);
    history.push('/home');
  };

  return (
    <IonContent>
      <Stack sx={{ padding: '20px' }} gap="20px">
        <Typography variant="h2" color="text.dark">
          Settings
        </Typography>
        <VerticalRadioList
          label="Choose Role"
          withUnderline={true}
          items={roles}
          value={selectedRole}
          onChange={handleChangeRole}
        />
        <VerticalRadioList
          label="Network"
          withUnderline={true}
          items={connectivities}
          value={connectivity ? 'online' : 'offline'}
          onChange={handleChangeConnectivity}
        />
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
