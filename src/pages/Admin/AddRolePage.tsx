import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  CrowdBibleUI,
  MuiMaterial,
  Autocomplete,
  Button,
  DiAdd,
  Typography,
} from '@eten-lab/ui-kit';

import { PageLayout } from '@/components/Layout';
import { RouteConst } from '@/constants/route.constant';

const { HeadBox } = CrowdBibleUI;
const { Stack } = MuiMaterial;

const orgs = [
  'Organization Name 1',
  'Organization Name 2',
  'Organization Name 3',
];
const apps = ['Application Name 1', 'Application Name 2', 'Application Name 3'];
const roles = ['Project Manager', 'Developer', 'Administrator'];

export function AddRolePage() {
  const history = useHistory();
  const { userId } = useParams<{ userId: string }>();

  const [org, setOrg] = useState<string | null>(null);
  const [app, setApp] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const handleOrgChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: string | null,
  ) => {
    setOrg(value);
  };

  const handleAppChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: string | null,
  ) => {
    setApp(value);
  };

  const handleRoleChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: string | null,
  ) => {
    setRole(value);
  };

  const handleAdd = () => {
    history.push(`${RouteConst.ADMIN}/user/${userId}`);
  };

  const handleCancel = () => {
    history.push(`${RouteConst.ADMIN}/user/${userId}`);
  };

  return (
    <PageLayout>
      <HeadBox title="assign new role" />
      <Stack sx={{ padding: '20px' }} gap="30px">
        <Stack gap="12px">
          <Autocomplete
            label="Choose Organization Name"
            options={orgs}
            value={org}
            isOptionEqualToValue={(option, value) => option === value}
            getOptionLabel={(option) => option}
            onChange={handleOrgChange}
            withLegend={false}
          />
          <Autocomplete
            label="Choose Application Name"
            options={apps}
            value={app}
            isOptionEqualToValue={(option, value) => option === value}
            getOptionLabel={(option) => option}
            onChange={handleAppChange}
            withLegend={false}
          />
          <Autocomplete
            label="Choose Role"
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
            onClick={handleAdd}
          >
            <DiAdd fontSize="small" />
            Add New Role
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
              Cancel
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </PageLayout>
  );
}
