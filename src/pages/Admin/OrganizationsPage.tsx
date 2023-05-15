import { IonContent, IonItem } from '@ionic/react';
import { MuiMaterial, Typography } from '@eten-lab/ui-kit';

const { Box } = MuiMaterial;

export function OrganizationsPage() {
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
          Organizations
        </Typography>
        <IonItem>Users</IonItem>
        <IonItem>Organizations</IonItem>
        <IonItem>Applications</IonItem>

        <IonItem>Import</IonItem>
        <IonItem>Seed some random data</IonItem>
        <IonItem>Sync data</IonItem>
      </Box>
    </IonContent>
  );
}
