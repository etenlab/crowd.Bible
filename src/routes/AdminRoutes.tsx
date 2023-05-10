import { Route, Switch } from 'react-router-dom';

import { HomePage } from '@/pages/Admin/HomePage';
import { UsersPage } from '@/pages/Admin/UsersPage';
import { ApplicationsPage } from '@/pages/Admin/ApplicationsPage';
import { OrganizationsPage } from '@/pages/Admin/OrganizationsPage';
import { UserDetailsPage } from '@/pages/Admin/UserDetailsPage';

export function AdminRoutes() {
  return (
    <Switch>
      <Route exact path="/admin/home">
        <HomePage />
      </Route>
      <Route exact path="/admin/users">
        <UsersPage />
      </Route>
      <Route exact path="/admin/applications">
        <ApplicationsPage />
      </Route>
      <Route exact path="/admin/organizations">
        <OrganizationsPage />
      </Route>
      <Route exact path="/admin/user/:user_id">
        <UserDetailsPage />
      </Route>
    </Switch>
  );
}
