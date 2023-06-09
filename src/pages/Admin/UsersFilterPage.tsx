import { MuiMaterial, Typography } from '@eten-lab/ui-kit';

import { PageLayout } from '@/components/Layout';

const { Box } = MuiMaterial;

export function UsersFilterPage() {
  return (
    <PageLayout>
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '123px 20px 20px 20px',
          gap: '12px',
        }}
        noValidate
        autoComplete="off"
      >
        <Typography
          variant="h1"
          color="text.dark"
          sx={{ marginBottom: '18px' }}
        >
          Edit Role
        </Typography>
      </Box>
    </PageLayout>
  );
}
