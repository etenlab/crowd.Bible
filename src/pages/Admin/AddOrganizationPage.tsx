import { ChangeEventHandler, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  CrowdBibleUI,
  MuiMaterial,
  Button,
  DiAdd,
  Typography,
  Input,
} from '@eten-lab/ui-kit';

import { PageLayout } from '@/components/Layout';
import { RouteConst } from '@/constants/route.constant';

import { useTr } from '@/hooks/useTr';

const { HeadBox } = CrowdBibleUI;
const { Stack } = MuiMaterial;

export function AddOrganizationPage() {
  const history = useHistory();
  const { tr } = useTr();

  const [orgName, setOrgName] = useState<string>('');

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setOrgName(event.target.value);
  };
  const handleAdd = () => {
    history.push(`${RouteConst.ADMIN}/organizations`);
  };

  const handleCancel = () => {
    history.push(`${RouteConst.ADMIN}/organizations`);
  };

  return (
    <PageLayout>
      <HeadBox title={tr('assign new organization')} />
      <Stack sx={{ padding: '20px' }} gap="30px">
        <Stack gap="12px">
          <Input
            label={tr('Organization')}
            fullWidth
            value={orgName}
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
