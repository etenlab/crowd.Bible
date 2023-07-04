import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import {
  CrowdBibleUI,
  MuiMaterial,
  Typography,
  Button,
} from '@eten-lab/ui-kit';

import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import { IMode } from '@/reducers/global.reducer';
import { RouteConst } from '@/constants/route.constant';

import { PageLayout } from '@/components/Layout';

const { VerticalRadioList } = CrowdBibleUI;
const { Divider, FormControlLabel, FormGroup, FormLabel, Stack, Switch } =
  MuiMaterial;

export const roles = [
  { value: 'translator', label: 'Translator Role' },
  { value: 'reader', label: 'Reader Role' },
];

export function SettingsPage() {
  const history = useHistory();
  const {
    states: {
      global: { mode, connectivity },
    },
    actions: { setMode, setConnectivity },
  } = useAppContext();
  const { tr } = useTr();

  const connectivities = [
    { value: 'online', label: tr('Online') },
    { value: 'offline', label: tr('Offline') },
  ];

  const [selectedMode, setSelectedMode] = useState<IMode>({
    admin: true,
    beta: true,
    autoSync: true,
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
    history.push(RouteConst.HOME);
  };

  return (
    <PageLayout>
      <Stack sx={{ padding: '20px' }} gap="20px">
        <Typography variant="h2" color="text.dark">
          {tr('Settings')}
        </Typography>
        <VerticalRadioList
          label={tr('Network')}
          withUnderline={true}
          items={connectivities}
          value={connectivity ? 'online' : 'offline'}
          onChange={handleChangeConnectivity}
        />
        <FormGroup>
          <FormLabel color="gray">{tr('Mode')}</FormLabel>
          <FormControlLabel
            control={
              <Switch
                checked={selectedMode.admin}
                onChange={handleChangeMode}
              />
            }
            label={tr('admin')}
            name="admin"
            sx={{ padding: '12px 0' }}
          />
          <Divider />
          <FormControlLabel
            control={
              <Switch checked={selectedMode.beta} onChange={handleChangeMode} />
            }
            label={tr('Beta')}
            name="beta"
            sx={{ padding: '12px 0' }}
          />
          <Divider />
          <FormControlLabel
            control={
              <Switch
                checked={selectedMode.autoSync}
                onChange={handleChangeMode}
              />
            }
            label={tr('Auto Sync')}
            name="autoSync"
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
          {tr('Save')}
        </Button>
      </Stack>
    </PageLayout>
  );
}
