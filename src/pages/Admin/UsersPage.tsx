import { IonContent, IonItem } from '@ionic/react';
import {
  Alert,
  Button,
  Input,
  MuiMaterial,
  PasswordInput,
  Typography,
} from '@eten-lab/ui-kit';

const { Box } = MuiMaterial;

export function UsersPage() {
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
          Users
        </Typography>
      </Box>
    </IonContent>
  );
}
