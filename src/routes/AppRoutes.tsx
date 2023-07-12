import { RouteProps } from 'react-router-dom';

import { HomePage } from '@/pages/HomePage';
import { SiteTextMenuPage } from '@/src/pages/SiteTextMenuPage';
import { RouteConst } from '@/constants/route.constant';

export interface CustomRouteProps extends RouteProps {
  protected?: boolean;
}

export const AppRoutes: CustomRouteProps[] = [
  {
    path: RouteConst.HOME,
    children: <HomePage />,
  },
  {
    path: RouteConst.SITE_TEXT_MENU_PAGE,
    children: <SiteTextMenuPage />,
  },
];
