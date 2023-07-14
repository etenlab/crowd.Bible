import { useMemo } from 'react';
import { Redirect, RouteProps } from 'react-router-dom';

import { RouteConst } from '@/constants/route.constant';
import { useAppContext } from '@/hooks/useAppContext';

const mode = process.env.REACT_APP_MODE;

export function RouteGuarder({ children }: RouteProps) {
  const {
    states: {
      global: { user },
    },
  } = useAppContext();

  const isAutherized = useMemo(() => {
    if (user) {
      return true;
    } else {
      return false;
    }
  }, [user]);

  if (mode === 'local-dev') {
    return <>{children}</>;
  }

  if (isAutherized) {
    return <>{children}</>;
  } else {
    return <Redirect to={RouteConst.LOGIN} />;
  }
}
