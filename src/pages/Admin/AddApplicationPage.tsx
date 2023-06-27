import { ChangeEventHandler, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import {
  CrowdBibleUI,
  MuiMaterial,
  Button,
  DiAdd,
  Typography,
  Input,
  Autocomplete,
} from '@eten-lab/ui-kit';

import { PageLayout } from '@/components/Layout';
import { RouteConst } from '@/constants/route.constant';

import { useTr } from '@/hooks/useTr';

const orgs = [
  'Organization Name 1',
  'Organization Name 2',
  'Organization Name 3',
];

const { HeadBox } = CrowdBibleUI;
const { Stack } = MuiMaterial;

export function AddApplicationPage() {
  const history = useHistory();
  const { tr } = useTr();

  const { orgId } = useParams<{ orgId: string }>();
  const [appName, setAppName] = useState<string>('');
  const [org, setOrg] = useState<string | null>(null);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setAppName(event.target.value);
  };

  const handleOrgChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: string | null,
  ) => {
    setOrg(value);
  };

  const handleAdd = () => {
    const redirect = orgId
      ? `${RouteConst.ADMIN}/organization/${orgId}`
      : `${RouteConst.ADMIN}/applications`;
    history.push(redirect);
  };

  const handleCancel = () => {
    const redirect = orgId
      ? `${RouteConst.ADMIN}/organization/${orgId}`
      : `${RouteConst.ADMIN}/applications`;
    history.push(redirect);
  };

  return (
    <PageLayout>
      <HeadBox title={tr('assign new application')} />
      <Stack sx={{ padding: '20px' }} gap="30px">
        <Stack gap="12px">
          {orgId ? (
            <Input
              label={tr('Organization')}
              fullWidth
              defaultValue={orgId}
              withLegend={false}
              disabled
            />
          ) : (
            <Autocomplete
              label={tr('Choose Organization Name')}
              options={orgs}
              value={org}
              isOptionEqualToValue={(option, value) => option === value}
              getOptionLabel={(option) => option}
              onChange={handleOrgChange}
              withLegend={false}
            />
          )}
        </Stack>
        <Stack gap="12px">
          <Input
            label={tr('Application')}
            fullWidth
            value={appName}
            onChange={handleChange}
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
            {tr('Add New')}
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
