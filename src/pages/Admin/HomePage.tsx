import { IonContent, IonItem } from '@ionic/react';
import { MuiMaterial, Typography } from '@eten-lab/ui-kit';

const { Box } = MuiMaterial;

export function HomePage() {
  return (
    <IonContent>
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
          Admin
        </Typography>
        <IonItem routerLink="/admin/users">Users</IonItem>
        <IonItem routerLink="/admin/organizations">Organizations</IonItem>
        <IonItem routerLink="/admin/applications">Applications</IonItem>

        <IonItem routerLink="/admin/import">Import</IonItem>
        <IonItem>Seed some random data</IonItem>
        <IonItem>Sync data</IonItem>
      </Box>
    </IonContent>
  );
}
