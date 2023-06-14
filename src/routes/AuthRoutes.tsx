import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';

import { CustomRouteProps } from './AppRoutes';
import { RouteConst } from '@/constants/route.constant';

export const AuthRoutes: CustomRouteProps[] = [
  {
    path: RouteConst.LOGIN,
    children: <LoginPage />,
  },
  {
    path: RouteConst.REGISTER,
    children: <RegisterPage />,
  },
  {
    path: RouteConst.FORGET_PASSWORD,
    children: <ForgotPasswordPage />,
  },
  {
    path: `${RouteConst.RESET_PASSWORD}/:token`,
    children: <ResetPasswordPage />,
  },
];
