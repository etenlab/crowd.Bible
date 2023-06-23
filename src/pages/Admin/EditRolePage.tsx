import { useState } from 'react';
import {
  useHistory,
  // useParams
} from 'react-router-dom';
import {
  CrowdBibleUI,
  MuiMaterial,
  Autocomplete,
  Button,
  Typography,
  Input,
} from '@eten-lab/ui-kit';

import { useTr } from '@/hooks/useTr';

import { PageLayout } from '@/components/Layout';
// import { RouteConst } from '@/constants/route.constant';

const { HeadBox } = CrowdBibleUI;
const { Stack } = MuiMaterial;

const orgs = [
  'Organization Name 1',
  'Organization Name 2',
  'Organization Name 3',
];
const apps = ['Application Name 1', 'Application Name 2', 'Application Name 3'];
const roles = ['Project Manager', 'Developer', 'Administrator'];

export function EditRolePage() {
  const history = useHistory();
  // const { roleId } = useParams<{ roleId: string }>();
  const { tr } = useTr();

  const org = orgs[0];
  const app = apps[0];
  const [role, setRole] = useState<string>(roles[0]);

  const handleRoleChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: string | null,
  ) => {
    setRole(value ? value : '');
  };

  const handleSave = () => {
    history.goBack();
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <PageLayout>
      <HeadBox title={tr('Edit Role')} />
      <Stack sx={{ padding: '20px' }} gap="30px">
        <Stack gap="12px">
          <Input
            label={tr('Organization')}
            disabled
            fullWidth
            value={org}
            withLegend={false}
          />
          <Input
            label={tr('Application')}
            disabled
            fullWidth
            value={app}
            withLegend={false}
          />
          <Autocomplete
            label={tr('Choose Role')}
            options={roles}
            value={role}
            isOptionEqualToValue={(option, value) => option === value}
            getOptionLabel={(option) => option}
            onChange={handleRoleChange}
            withLegend={false}
          />
        </Stack>
        <Stack gap="12px">
          <Button
            variant="contained"
            color="blue-primary"
            size="large"
            sx={{ alignItems: 'center' }}
            onClick={handleSave}
          >
            {tr('Save')}
          </Button>
          <Button
            variant="text"
            size="large"
            color="gray"
            onClick={handleCancel}
          >
            <Typography
              variant="subtitle2"
              color="text.gray"
              sx={{ fontWeight: 500 }}
            >
              {tr('Cancel')}
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </PageLayout>
  );
}
