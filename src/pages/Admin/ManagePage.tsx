import { MuiMaterial } from '@eten-lab/ui-kit';

import { PageLayout } from '@/components/Layout';
import { RouteConst } from '@/constants/route.constant';
import { LinkGroup } from '@/components/LinkGroup';

const { Box } = MuiMaterial;

const menuLinks = {
  group: 'Admin',
  linkItems: [
    { to: `${RouteConst.ADMIN}/users`, label: 'Users', implemented: true },
    {
      to: `${RouteConst.ADMIN}/organizations`,
      label: 'Organizations',
      implemented: true,
    },
    {
      to: `${RouteConst.ADMIN}/applications`,
      label: 'Applications',
      implemented: true,
    },
    { to: `${RouteConst.ADMIN}/import`, label: 'Import', implemented: true },
    {
      to: `${RouteConst.ADMIN}/seed`,
      label: 'Seed some random data',
      implemented: true,
    },
    { to: `${RouteConst.ADMIN}/sync`, label: 'Sync data', implemented: true },
  ],
};

export function ManagePage() {
  return (
    <PageLayout>
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '20px',
          gap: '12px',
        }}
        noValidate
        autoComplete="off"
      >
        <LinkGroup group={menuLinks.group} linkItems={menuLinks.linkItems} />
      </Box>
    </PageLayout>
  );
}
