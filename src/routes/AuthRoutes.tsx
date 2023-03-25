import { Route } from 'react-router-dom';

import { SiteTextAdminPage } from '@/pages/AppDev/SiteTextAdminPage';
import { SiteTextTranslationPage } from '@/pages/AppDev/SiteTextTranslationPage';

import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';

export function AuthRoutes() {
  return (
    <>
      <Route exact path="/login">
        <LoginPage />
      </Route>
      <Route exact path="/register">
        <RegisterPage />
      </Route>
    </>
  );
}
