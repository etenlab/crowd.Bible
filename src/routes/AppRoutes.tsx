import { RouteProps } from 'react-router-dom';

import { ProtectedRoutes } from './ProtectedRoutes';
import { AuthRoutes } from './AuthRoutes';

import { WelcomePage } from '@/pages/WelcomePage';
import { HomePage } from '@/pages/HomePage';

import { RouteConst } from '@/constants/route.constant';

export interface CustomRouteProps extends RouteProps {
  protected?: boolean;
}

export const AppRoutes: CustomRouteProps[] = [
  {
    path: RouteConst.WELCOME,
    children: <WelcomePage />,
  },
  {
    path: RouteConst.HOME,
    children: <HomePage />,
  },
  ...AuthRoutes,
  ...ProtectedRoutes,
];
