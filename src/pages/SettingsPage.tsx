import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import {
  CrowdBibleUI,
  MuiMaterial,
  Typography,
  Button,
  colors,
} from '@eten-lab/ui-kit';

import { useAppContext } from '../hooks/useAppContext';
import { RoleType } from '../reducers/global.reducer';

const { VerticalRadioList } = CrowdBibleUI;
const { Stack } = MuiMaterial;

export const roles = [
  { value: 'translator', label: 'Translator Role' },
  { value: 'reader', label: 'Reader Role' },
];

export function SettingsPage() {
  const history = useHistory();
  const {
    states: {
      global: { user },
    },
    actions: { setRole },
  } = useAppContext();

  const [selectedRole, setSelectedRole] = useState<RoleType>('translator');

  useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
    }
  }, [user]);

  const handleChangeRole = (
    _event: React.SyntheticEvent<Element, Event>,
    role: RoleType,
  ) => {
    setSelectedRole(role);
  };

  const handleClickSave = () => {
    setRole(selectedRole);
    history.push('/documents-list');
  };

  return (
    <IonContent>
      <Stack sx={{ padding: '20px' }} gap="20px">
        <Typography variant="h2" sx={{ color: colors['dark'] }}>
          Settings
        </Typography>
        <VerticalRadioList
          label="Choose Role"
          withUnderline={true}
          items={roles}
          value={selectedRole}
          onChange={handleChangeRole}
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
