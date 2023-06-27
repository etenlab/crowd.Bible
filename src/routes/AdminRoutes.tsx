import { ManagePage } from '@/pages/Admin/ManagePage';
import { UsersPage } from '@/pages/Admin/UsersPage';
import { ApplicationsPage } from '@/pages/Admin/ApplicationsPage';
import { OrganizationsPage } from '@/pages/Admin/OrganizationsPage';
import { OrganizationDetailPage } from '@/pages/Admin/OrganizationDetailPage';
import { OrganizationUsersPage } from '@/pages/Admin/OrganizationUsersPage';
import { OrganizationApplicationsPage } from '@/pages/Admin/OrganizationApplicationsPage';
import { UserDetailsPage } from '@/pages/Admin/UserDetailsPage';
import { AddRolePage } from '../pages/Admin/AddRolePage';

import { RouteConst } from '@/constants/route.constant';
import { CustomRouteProps } from './AppRoutes';
import { EditRolePage } from '@/pages/Admin/EditRolePage';
import { UsersFilterPage } from '@/pages/Admin/UsersFilterPage';
import { AddOrganizationPage } from '@/pages/Admin/AddOrganizationPage';
import { AddApplicationPage } from '@/pages/Admin/AddApplicationPage';
import { ImportPage } from '@/pages/Admin/ImportPage';
import { SeedPage } from '@/pages/Admin/SeedPage';
import { SyncPage } from '@/pages/Admin/SyncPage';

export const AdminRoutes: CustomRouteProps[] = [
  {
    path: `${RouteConst.ADMIN}`,
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
    path: `${RouteConst.ADMIN}/create-role/:userId`,
    children: <AddRolePage />,
  },
  {
    path: `${RouteConst.ADMIN}/role/:roleId`,
    children: <EditRolePage />,
  },
  {
    path: `${RouteConst.ADMIN}/user/:userId`,
    children: <UserDetailsPage />,
  },
  {
    path: `${RouteConst.ADMIN}/filter`,
    children: <UsersFilterPage />,
  },
  {
    path: `${RouteConst.ADMIN}/organization/:orgId/users`,
    children: <OrganizationUsersPage />,
  },
  {
    path: `${RouteConst.ADMIN}/organization/:orgId/applications`,
    children: <OrganizationApplicationsPage />,
  },
  {
    path: `${RouteConst.ADMIN}/organization/:orgId`,
    children: <OrganizationDetailPage />,
  },
  {
    path: `${RouteConst.ADMIN}/create-organization`,
    children: <AddOrganizationPage />,
  },
  {
    path: `${RouteConst.ADMIN}/organization/:orgId/create-application`,
    children: <AddApplicationPage />,
  },
  {
    path: `${RouteConst.ADMIN}/create-application`,
    children: <AddApplicationPage />,
  },
  {
    path: `${RouteConst.ADMIN}/import`,
    children: <ImportPage />,
  },
  {
    path: `${RouteConst.ADMIN}/seed`,
    children: <SeedPage />,
  },
  {
    path: `${RouteConst.ADMIN}/sync`,
    children: <SyncPage />,
  },
];
