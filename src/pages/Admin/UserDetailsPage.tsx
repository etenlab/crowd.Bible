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

export function UserDetailsPage() {
  const history = useHistory();
  const { userId } = useParams<{ userId: string }>();
  const { tr } = useTr();

  const handleClickBackBtn = () => {
    history.goBack();
  };

  const addRole = () => {
    history.push(`${RouteConst.ADMIN}/create-role/${userId}`);
  };

  const editRole = (roleId: string) => () => {
    history.push(`${RouteConst.ADMIN}/role/${roleId}`);
  };

  const roles = [
    {
      application: 'Application Name 1',
      organization: 'Organization Name 1',
      role: 'Project Manager',
      id: 'role_id_1',
    },
    {
      application: 'Application Name 2',
      organization: 'Organization Name 1',
      role: 'Developer',
      id: 'role_id_2',
    },
    {
      application: 'Application Name 2',
      organization: 'Organization Name 2',
      role: 'Project Manager',
      id: 'role_id_3',
    },
  ];

  const items = roles.map((r) => ({
    label: (
      <Stack>
        <Stack>
          <Typography variant="body1" color="text.dark">
            {r.application}
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="body2" color="text.grey">
            {r.organization}
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
        <HeadBox back={{ action: handleClickBackBtn }} title={userId} />
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
