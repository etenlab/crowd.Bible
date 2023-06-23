import { useParams, useHistory } from 'react-router-dom';
import {
  CrowdBibleUI,
  MuiMaterial,
  useColorModeContext,
  FiCodesandbox,
  DiUser,
  Typography,
} from '@eten-lab/ui-kit';

import { PageLayout } from '@/components/Layout';
import { RouteConst } from '@/constants/route.constant';

import { useTr } from '@/hooks/useTr';

const { Stack } = MuiMaterial;
const { HeadBox } = CrowdBibleUI;

export function OrganizationDetailPage() {
  const history = useHistory();
  const { orgId } = useParams<{ orgId: string }>();
  const { getColor } = useColorModeContext();
  const { tr } = useTr();

  const goApplications = () => {
    history.push(`${RouteConst.ADMIN}/organization/${orgId}/applications`);
  };

  const goUsers = () => {
    history.push(`${RouteConst.ADMIN}/organization/${orgId}/users`);
  };

  const handleClickBackBtn = () => {
    history.goBack();
  };

  return (
    <PageLayout>
      <HeadBox title={orgId} back={{ action: handleClickBackBtn }} />
      <Stack sx={{ padding: '14px 20px' }} direction="row" gap="19px">
        <Stack
          sx={{
            height: 158,
            width: 158,
            border: '1px solid',
            borderColor: getColor('dark'),
            borderRadius: '10px',
            cursor: 'pointer',
          }}
          justifyContent="center"
          alignItems="center"
          onClick={goApplications}
        >
          <Stack
            height={77}
            justifyContent="center"
            alignItems="center"
            gap="9px"
          >
            <FiCodesandbox fontSize="42px" />
            <Typography
              variant="body1"
              sx={{ fontWeight: 600 }}
              color="text.dark"
            >
              {tr('Applications')}
            </Typography>
          </Stack>
        </Stack>
        <Stack
          sx={{
            height: 158,
            width: 158,
            border: '1px solid',
            borderColor: getColor('dark'),
            borderRadius: '10px',
            cursor: 'pointer',
          }}
          justifyContent="center"
          alignItems="center"
          onClick={goUsers}
        >
          <Stack
            height={77}
            justifyContent="center"
            alignItems="center"
            gap="9px"
          >
            <DiUser sx={{ fontSize: '42px' }} />
            <Typography
              variant="body1"
              sx={{ fontWeight: 600 }}
              color="text.dark"
            >
              {tr('Users')}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </PageLayout>
  );
}
