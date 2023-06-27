import { useHistory, useParams } from 'react-router-dom';
import {
  CrowdBibleUI,
  PlusButton,
  MuiMaterial,
  DiEdit,
  Typography,
} from '@eten-lab/ui-kit';

import { PageLayout } from '@/components/Layout';
import { RouteConst } from '@/constants/route.constant';

import { useTr } from '@/hooks/useTr';

const { ButtonList, HeadBox } = CrowdBibleUI;
const { Box, Stack } = MuiMaterial;

const roles = [
  {
    user: 'michael@test.com',
    role: 'Project Manager',
    id: 'role_id_1',
  },
  {
    user: 'aslam@test.com',
    role: 'Developer',
    id: 'role_id_2',
  },
];

export function OrganizationApplicationDetailsPage() {
  const history = useHistory();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { orgId, appId } = useParams<{ orgId: string; appId: string }>();
  const { tr } = useTr();

  const handleClickBackBtn = () => {
    history.goBack();
  };

  const addRole = () => {};

  const editRole = (roleId: string) => () => {
    history.push(`${RouteConst.ADMIN}/role/${roleId}`);
  };

  const items = roles.map((r) => ({
    label: (
      <Stack>
        <Stack>
          <Typography variant="body1" color="text.dark">
            {r.user}
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="body2" color="text.grey">
            {r.role}
          </Typography>
        </Stack>
      </Stack>
    ),
    value: r.id,
    endIcon: <DiEdit onClick={editRole(r.id)} />,
  }));

  return (
    <PageLayout>
      <Box
        sx={{
          '.MuiTypography-root': {
            textTransform: 'none',
          },
          marginBottom: '14px',
        }}
      >
        <HeadBox back={{ action: handleClickBackBtn }} title={appId} />
      </Box>
      <ButtonList
        label={tr('Roles')}
        withUnderline={true}
        items={items}
        onClick={() => {}}
        toolBtnGroup={
          <>
            <PlusButton variant="primary" onClick={addRole} />
          </>
        }
      />
    </PageLayout>
  );
}
