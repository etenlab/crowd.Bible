import { NotificationsPage } from '@/pages/Notifications';

import { SettingsPage } from '@/pages/SettingsPage';
import { DiscussionPage } from '@/pages/DiscussionPage';
import { HomePage } from '@/pages/HomePage';
import { DiscussionsListPage } from '@/pages/DiscussionsListPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { PlaygroundPage } from '@/pages/PlaygroundPage';

import { DocumentToolsRoutes } from './DocumentToolsRoutes';
import { LanguageToolsRoutes } from './LanguageToolsRoutes';
import { MediaToolsRoutes } from './MediaToolsRoutes';
import { DataToolsRoutes } from './DataToolsRoutes';
import { AppDevRoutes } from './AppDevRoutes';
import { DiscussionRoutes } from './DiscussionRoutes';
import { AdminRoutes } from './AdminRoutes';

import { RouteConst } from '@/constants/route.constant';
import { CustomRouteProps } from './AppRoutes';

export const ProtectedRoutes: CustomRouteProps[] = [
  {
    path: RouteConst.HOME,
    children: <HomePage />,
  },
  {
    path: RouteConst.PROFILE,
    children: <ProfilePage />,
  },
  {
    path: `${RouteConst.DISCUSSIONS}/table-name/:table_name/row/:row`,
    children: <DiscussionPage />,
  },
  {
    path: RouteConst.DISCUSSIONS_LIST,
    children: <DiscussionsListPage />,
  },
  {
    path: RouteConst.NOTIFICATIONS,
    children: <NotificationsPage />,
  },
  {
    path: RouteConst.SETTINGS,
    children: <SettingsPage />,
  },
  {
    path: RouteConst.PLAYGROUND,
    children: <PlaygroundPage />,
  },
  ...AdminRoutes,
  ...DocumentToolsRoutes,
  ...LanguageToolsRoutes,
  ...MediaToolsRoutes,
  ...DataToolsRoutes,
  ...AppDevRoutes,
  ...DiscussionRoutes,
].map((route) => ({ ...route, protected: true }));
