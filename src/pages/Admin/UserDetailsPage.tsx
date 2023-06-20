import { useHistory, useParams } from 'react-router-dom';
import {
  CrowdBibleUI,
  PlusButton,
  MuiMaterial,
  DiEdit,
  Typography,
} from '@eten-lab/ui-kit';

import { PageLayout } from '@/components/Layout';

const { ButtonList, HeadBox } = CrowdBibleUI;
const { Box, Stack } = MuiMaterial;

export function UserDetailsPage() {
  const history = useHistory();
  const { user_id } = useParams<{ user_id: string }>();

  const handleClickBackBtn = () => {
    history.goBack();
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
    endIcon: <DiEdit />,
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
        <HeadBox back={{ action: handleClickBackBtn }} title={user_id} />
      </Box>
      <ButtonList
        label="Roles"
        withUnderline={true}
        items={items}
        onClick={() => {}}
        toolBtnGroup={
          <>
            <PlusButton variant="primary" onClick={() => {}} />
          </>
        }
      />
    </PageLayout>
  );
}
