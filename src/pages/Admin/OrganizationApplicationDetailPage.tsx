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

const { ButtonList, HeadBox } = CrowdBibleUI;
const { Box, Stack } = MuiMaterial;

export function OrganizationApplicationDetailsPage() {
  const history = useHistory();
  const { orgId, appId } = useParams<{ orgId: string; appId: string }>();

  const handleClickBackBtn = () => {
    history.goBack();
  };

  const addRole = () => {};

  const editRole = (roleId: string) => () => {
    history.push(`${RouteConst.ADMIN}/role/${roleId}`);
  };

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
        label="Roles"
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
