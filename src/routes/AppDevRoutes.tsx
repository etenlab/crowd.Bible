import { Route } from 'react-router-dom';

import { SiteTextAdminPage } from '../pages/AppDev/SiteTextAdminPage';
import { SiteTextTranslationPage } from '../pages/AppDev/SiteTextTranslationPage';

export function AppDevRoutes() {
  return (
    <>
      <Route exact path="/site-text-admin">
        <SiteTextAdminPage />
      </Route>
      <Route exact path="/site-text-translation">
        <SiteTextTranslationPage />
      </Route>
    </>
  );
}
