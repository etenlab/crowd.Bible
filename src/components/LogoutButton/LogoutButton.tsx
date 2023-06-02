import { useHistory } from 'react-router-dom';

import { IonItem } from '@ionic/react';

import { Typography } from '@eten-lab/ui-kit';
import { RouteConst } from '@/src/constants/route.constant';
// import { decodeToken } from '@/src/utils/AuthUtils';
import { useAppContext } from '../../hooks/useAppContext';

export function LogoutButton() {
  const {
    logger,
    states: {
      global: { user },
    },
    actions: { logout },
  } = useAppContext();
  const history = useHistory();
  const userToken = localStorage.getItem('userToken');
  // let tokenObj = null;
  if (userToken && userToken !== undefined) {
    // tokenObj = decodeToken(userToken);
    logger.debug({ at: 'LogoutButton' }, 'userToken', userToken);
  }

  const handleLogout = () => {
    localStorage.clear();
    logout();
    history.push(RouteConst.LOGIN);
  };

  if (!user || user?.userEmail.trim().length === 0) {
    return null;
  }

  return (
    <IonItem button onClick={handleLogout}>
      <Typography variant="body1" color="text.red" sx={{ padding: '20px' }}>
        Logout
      </Typography>
    </IonItem>
  );
}
