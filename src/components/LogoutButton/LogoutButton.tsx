import { useHistory } from 'react-router-dom';

import { IonItem } from '@ionic/react';

import { Typography } from '@eten-lab/ui-kit';
import { RouteConst } from '@/src/constants/route.constant';
import { decodeToken, isTokenValid } from '@/src/utils/AuthUtils';
import { useAppContext } from '../../hooks/useAppContext';

export function LogoutButton() {
  const { logger } = useAppContext();
  const history = useHistory();
  const userToken = localStorage.getItem('userToken');
  let tokenObj = null;
  console.log('userToken asdf');
  if (userToken && userToken !== undefined) {
    console.log(userToken);
    tokenObj = decodeToken(userToken);
    logger.info({ at: 'LogoutButton' }, 'userToken', userToken);
  }

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
