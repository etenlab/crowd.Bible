import { Redirect, Route, Switch } from 'react-router-dom';
// import { IonRouterOutlet } from '@ionic/react';

import NotificationsPage from '@/pages/Notifications';
import { SettingsPage } from '@/pages/SettingsPage';
import { DiscussionPage } from '@/pages/DiscussionPage';
import { HomePage } from '@/pages/HomePage';
import { DiscussionsListPage } from '@/pages/DiscussionsListPage';
import { AdminPage } from '@/pages/AdminPage';
import { ProfilePage } from '@/pages/ProfilePage';

import { DocumentToolsRoutes } from './DocumentToolsRoutes';
import { LanguageToolsRoutes } from './LanguageToolsRoutes';
import { MediaToolsRoutes } from './MediaToolsRoutes';
import { DataToolsRoutes } from './DataToolsRoutes';
import { AppDevRoutes } from './AppDevRoutes';
import { DiscussionRoutes } from './DiscussionRoutes';

export function ProtectedRoutes() {
  return (
    <>
      <Switch>
        <Route exact path="/home">
          <HomePage />
        </Route>

        <Route exact path="/profile">
          <ProfilePage />
        </Route>

        <Route exact path="/discussion/table-name/:table_name/row/:row">
          <DiscussionPage />
        </Route>
        <Route exact path="/discussions-list">
          <DiscussionsListPage />
        </Route>

        <Route exact path="/notifications">
          <NotificationsPage />
        </Route>

        <Route exact path="/settings">
          <SettingsPage />
        </Route>

        <Route exact path="/admin">
          <AdminPage />
        </Route>
      </Switch>

      <DocumentToolsRoutes />

      <LanguageToolsRoutes />

      <MediaToolsRoutes />

      <DataToolsRoutes />

      <AppDevRoutes />

      <DiscussionRoutes />

      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
    </>
  );
}
