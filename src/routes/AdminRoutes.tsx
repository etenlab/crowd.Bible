import { ManagePage } from '@/pages/Admin/ManagePage';
import { UsersPage } from '@/pages/Admin/UsersPage';
import { ApplicationsPage } from '@/pages/Admin/ApplicationsPage';
import { OrganizationsPage } from '@/pages/Admin/OrganizationsPage';
import { UserDetailsPage } from '@/pages/Admin/UserDetailsPage';
import { AddRolePage } from '../pages/Admin/AddRolePage';

import { RouteConst } from '@/constants/route.constant';
import { CustomRouteProps } from './AppRoutes';

export const AdminRoutes: CustomRouteProps[] = [
  {
    path: `${RouteConst.ADMIN}/manage`,
    children: <ManagePage />,
  },
  {
    path: `${RouteConst.ADMIN}/users`,
    children: <UsersPage />,
  },
  {
    path: `${RouteConst.ADMIN}/applications`,
    children: <ApplicationsPage />,
  },
  {
    path: `${RouteConst.ADMIN}/organizations`,
    children: <OrganizationsPage />,
  },
  {
    path: `${RouteConst.ADMIN}/role/:user_id`,
    children: <AddRolePage />,
  },
  {
    path: `${RouteConst.ADMIN}/user/:user_id`,
    children: <UserDetailsPage />,
  },
];
