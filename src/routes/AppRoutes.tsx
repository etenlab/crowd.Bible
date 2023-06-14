import { RouteProps } from 'react-router-dom';

import { ProtectedRoutes } from './ProtectedRoutes';
import { AuthRoutes } from './AuthRoutes';
import { AdminRoutes } from './AdminRoutes';

import { WelcomePage } from '@/pages/WelcomePage';
import { RouteConst } from '@/constants/route.constant';

export interface CustomRouteProps extends RouteProps {
  protected?: boolean;
}

export const AppRoutes: CustomRouteProps[] = [
  {
    path: RouteConst.WELCOME,
    children: <WelcomePage />,
  },
  ...AuthRoutes,
  ...AdminRoutes,
  ...ProtectedRoutes,
];
