import { Route, Switch } from 'react-router-dom';

import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';

export function AuthRoutes() {
  return (
    <Switch>
      <Route exact path="/login">
        <LoginPage />
      </Route>
      <Route exact path="/register">
        <RegisterPage />
      </Route>
      <Route exact path="/forgot-password">
        <ForgotPasswordPage />
      </Route>
      <Route exact path="/reset-password/:token">
        <ResetPasswordPage />
      </Route>
    </Switch>
  );
}
