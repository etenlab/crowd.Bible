import { Route } from 'react-router-dom';

import { AllDiscussion } from '@/pages/Discussion/AllDiscussion';
import DiscussionDetail from '@/pages/Discussion/DiscussionDetail';
import AppRoutes from '../constants/AppRoutes';

export function DiscussionRoutes() {
  return (
    <>
      <Route exact path={AppRoutes.discussions}>
        <AllDiscussion />
      </Route>
      <Route path={`${AppRoutes.discussions}/:id`}>
        <DiscussionDetail />
      </Route>
    </>
  );
}
