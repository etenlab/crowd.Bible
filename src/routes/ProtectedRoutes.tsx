import { NotificationsPage } from '@/pages/Notifications';

import { SettingsPage } from '@/pages/SettingsPage';

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
    path: RouteConst.PROFILE,
    children: <ProfilePage />,
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
