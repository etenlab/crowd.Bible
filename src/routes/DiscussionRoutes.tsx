import { AllDiscussion } from '@/pages/Discussion/AllDiscussion';
import DiscussionDetail from '@/pages/Discussion/DiscussionDetail';

import { RouteConst } from '@/constants/route.constant';
import { CustomRouteProps } from './AppRoutes';

export const DiscussionRoutes: CustomRouteProps[] = [
  {
    path: RouteConst.DISCUSSIONS,
    children: <AllDiscussion />,
  },
  {
    path: `${RouteConst.DISCUSSIONS}/:id`,
    children: <DiscussionDetail />,
  },
];
