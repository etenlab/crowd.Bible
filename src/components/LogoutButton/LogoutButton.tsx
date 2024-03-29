import { useHistory } from 'react-router-dom';

import { Button, useColorModeContext } from '@eten-lab/ui-kit';
import { RouteConst } from '@/constants/route.constant';

import { useTr } from '@/hooks/useTr';
import { useAppContext } from '@/hooks/useAppContext';

import { USER_TOKEN_KEY } from '@/constants/common.constant';

export function LogoutButton() {
  const history = useHistory();
  const { getColor } = useColorModeContext();
  const {
    // logger,
    states: {
      global: { user },
    },
    actions: { logout },
  } = useAppContext();
  const { tr } = useTr();

  const userToken = localStorage.getItem(USER_TOKEN_KEY);
  // let tokenObj = null;
  if (userToken && userToken !== undefined) {
    // tokenObj = decodeToken(userToken);
    // logger.debug({ at: 'LogoutButton' }, USER_TOKEN_KEY, userToken);
  }

  const handleLogout = () => {
    localStorage.clear();
    logout();
    history.push(RouteConst.LOGIN);
  };

  if (!user) {
    return null;
  }

  return (
    <Button
      onClick={handleLogout}
      sx={{
        margin: '20px',
        justifyContent: 'flex-start',
        width: 'calc(100% - 40px)',
        borderTop: `1px solid ${getColor('divider-color')}`,
        borderRadius: 0,
        padding: '12px 0',
        color: getColor('red'),
        fontWeight: 600,
        fontSize: '16px',
        lineHeight: '26px',
      }}
    >
      {tr('Logout')}
    </Button>
  );
}
