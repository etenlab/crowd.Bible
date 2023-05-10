import { IonContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { MuiMaterial, CrowdBibleUI, Typography } from '@eten-lab/ui-kit';

const { Box } = MuiMaterial;
const { HeadBox } = CrowdBibleUI;

export function UsersPage() {
  const history = useHistory();

  const handleClickBackBtn = () => {
    history.goBack();
  };

  const handleSearch = () => {};

  return (
    <IonContent>
      <HeadBox
        back={{ action: handleClickBackBtn }}
        title="Users"
        search={{ onChange: handleSearch, placeHolder: 'Search', value: '' }}
      />
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
