import { MuiMaterial } from '@eten-lab/ui-kit';

import { PageLayout } from '@/components/Layout';
import { LinkGroup } from '@/components/LinkGroup';

import { useTr } from '@/hooks/useTr';

import { RouteConst } from '@/constants/route.constant';

const { Box } = MuiMaterial;

export function ManagePage() {
  const { tr } = useTr();

  const menuLinks = {
    group: tr('Admin'),
    linkItems: [
      {
        to: `${RouteConst.ADMIN}/users`,
        label: tr('Users'),
        implemented: true,
      },
      {
        to: `${RouteConst.ADMIN}/organizations`,
        label: tr('Organizations'),
        implemented: true,
      },
      {
        to: `${RouteConst.ADMIN}/applications`,
        label: tr('Applications'),
        implemented: true,
      },
      {
        to: `${RouteConst.ADMIN}/import`,
        label: tr('Import'),
        implemented: true,
      },
      {
        to: `${RouteConst.ADMIN}/seed`,
        label: tr('Seed some random data'),
        implemented: true,
      },
      {
        to: `${RouteConst.ADMIN}/sync`,
        label: tr('Sync data'),
        implemented: true,
      },
    ],
  };

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
