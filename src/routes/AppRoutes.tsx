import { Route } from 'react-router-dom';

import { RoutesGuardian } from '@/components/RoutesGuardian';
import { ProtectedRoutes } from './ProtectedRoutes';
import { AuthRoutes } from './AuthRoutes';
import { AdminRoutes } from './AdminRoutes';
import { WelcomePage } from '@/pages/WelcomePage';

export function AppRoutes() {
  return (
    <>
      <Route exact path="/welcome">
        <WelcomePage />
      </Route>

      <AuthRoutes />
      <AdminRoutes />

      <RoutesGuardian>
        <ProtectedRoutes />
      </RoutesGuardian>
    </>
  );
}
