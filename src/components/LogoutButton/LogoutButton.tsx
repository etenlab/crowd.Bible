import { useHistory } from 'react-router-dom';

import { IonItem } from '@ionic/react';

import { Typography } from '@eten-lab/ui-kit';
import { RouteConst } from '@/src/constants/route.constant';
import { decodeToken, isTokenValid } from '@/src/utils/AuthUtils';

export function LogoutButton() {
  const history = useHistory();
  const userToken = localStorage.getItem('userToken');
  const tokenObj = decodeToken(userToken!);
  console.log('userToken aaaaaaaaaaaaa');
  console.log(userToken);

  const handleLogout = () => {
    localStorage.clear();
    history.push(RouteConst.LOGIN);
  };

  if (isTokenValid(tokenObj)) {
    return (
      <IonItem button onClick={handleLogout}>
        <Typography variant="body1" color="text.red" sx={{ padding: '20px' }}>
          Logout
        </Typography>
      </IonItem>
    );
  } else {
    return null;
  }
}
