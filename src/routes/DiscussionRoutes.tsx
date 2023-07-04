import { AllDiscussion } from '@/pages/Discussion/AllDiscussion';

import { RouteConst } from '@/constants/route.constant';
import { CustomRouteProps } from './AppRoutes';

export const DiscussionRoutes: CustomRouteProps[] = [
  {
    path: RouteConst.DISCUSSIONS,
    children: <AllDiscussion />,
  },
];
