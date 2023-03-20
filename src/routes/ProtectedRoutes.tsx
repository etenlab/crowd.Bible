import { Redirect, Route } from 'react-router-dom';

import NotificationsPage from '@/pages/Notifications';
import { SettingsPage } from '@/pages/SettingsPage';
import { DiscussionPage } from '@/pages/DiscussionPage';
import { HomePage } from '@/pages/HomePage';
import { DiscussionsListPage } from '@/pages/DiscussionsListPage';
import { AdminPage } from '@/pages/AdminPage';

import { DocumentToolsRoutes } from './DocumentToolsRoutes';
import { LanguageToolsRoutes } from './LanguageToolsRoutes';
import { MediaToolsRoutes } from './MediaToolsRoutes';
import { DataToolsRoutes } from './DataToolsRoutes';
import { AppDevRoutes } from './AppDevRoutes';

export function ProtectedRoutes() {
  return (
    <>
      <Route exact path="/home">
        <HomePage />
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

      <DocumentToolsRoutes />

      <LanguageToolsRoutes />

      <MediaToolsRoutes />

      <DataToolsRoutes />

      <AppDevRoutes />

      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
    </>
  );
}
