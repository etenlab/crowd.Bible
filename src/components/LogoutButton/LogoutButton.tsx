import { useHistory } from 'react-router-dom';

import { IonItem } from '@ionic/react';

import { Typography } from '@eten-lab/ui-kit';
import { RouteConst } from '@/src/constants/route.constant';

export function LogoutButton() {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.clear();
    history.push(RouteConst.LOGIN);
  };

  return (
    <IonItem button onClick={handleLogout}>
      <Typography variant="body1" color="text.red" sx={{ padding: '20px' }}>
        Logout
      </Typography>
    </IonItem>
  );
}
