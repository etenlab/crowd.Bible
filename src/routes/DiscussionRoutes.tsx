import { DiscussionPage } from '@/pages/Discussion/DiscussionPage';
import { DiscussionsListPage } from '@/pages/Discussion/DiscussionsListPage';

import { RouteConst } from '@/constants/route.constant';
import { CustomRouteProps } from './AppRoutes';

export const DiscussionRoutes: CustomRouteProps[] = [
  {
    path: `${RouteConst.DISCUSSIONS}/:table_name/:row_id`,
    children: <DiscussionPage />,
  },
  {
    path: RouteConst.DISCUSSIONS_LIST,
    children: <DiscussionsListPage />,
  },
];
