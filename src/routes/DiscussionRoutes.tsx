import { Route } from 'react-router-dom';

import { AllDiscussion } from '@/pages/Discussion/AllDiscussion';
import DiscussionDetail from '@/pages/Discussion/DiscussionDetail';
import { RouteConst } from '../constants/route.constant';

export function DiscussionRoutes() {
  return (
    <>
      <Route exact path={RouteConst.DISCUSSIONS}>
        <AllDiscussion />
      </Route>
      <Route path={`${RouteConst.DISCUSSIONS}/:id`}>
        <DiscussionDetail />
      </Route>
    </>
  );
}
