import { Route, Switch } from 'react-router-dom';

import { SiteTextAdminPage } from '@/pages/AppDev/SiteTextAdminPage';
import { SiteTextTranslationPage } from '@/pages/AppDev/SiteTextTranslationPage';

export function AppDevRoutes() {
  return (
    <Switch>
      <Route exact path="/site-text-admin">
        <SiteTextAdminPage />
      </Route>
      <Route exact path="/site-text-translation">
        <SiteTextTranslationPage />
      </Route>
    </Switch>
  );
}
