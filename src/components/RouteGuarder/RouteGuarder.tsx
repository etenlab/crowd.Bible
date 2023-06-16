import { Redirect, RouteProps } from 'react-router-dom';

import { RouteConst } from '@/constants/route.constant';
// import { useHistory } from 'react-router-dom';
// import { useAppContext } from '@/hooks/useAppContext';
// import { type IUser } from '@/reducers/global.reducer';

export function RouteGuarder({ children }: RouteProps) {
  // const history = useHistory();
  // const {
  //   states: {
  //     global: { user },
  //   },
  // } = useAppContext();

  // const isAutherized = (user: IUser | null) => {
  //   if (user) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };
  const isAutherized = true;

  // if (!isAutherized(user)) {
  //   history.push(RouteConst.LOGIN);
  // }

  if (isAutherized) {
    return <>{children}</>;
  } else {
    return <Redirect to={RouteConst.HOME} />;
  }
}
