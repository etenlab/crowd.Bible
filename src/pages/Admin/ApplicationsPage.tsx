import { IonContent, IonItem } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { MuiMaterial, CrowdBibleUI, Typography } from '@eten-lab/ui-kit';

const { Box } = MuiMaterial;
const { HeadBox } = CrowdBibleUI;

export function ApplicationsPage() {
  const history = useHistory();

  const handleClickBackBtn = () => {
    history.goBack();
  };

  return (
    <IonContent>
      <HeadBox back={{ action: handleClickBackBtn }} title="Applications" />
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
          Applications
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
