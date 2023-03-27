import React from 'react';
// import { useHistory } from 'react-router-dom';
// import { useAppContext } from '@/hooks/useAppContext';
// import { type IUser } from '@/reducers/global.reducer';

type GuardRoutesType = {
  children: React.ReactNode;
};

export function RoutesGuardian({ children }: GuardRoutesType) {
  // const history = useHistory();
  // const {
  //   states: {
  //     global: { user },
  //   },
  // } = useAppContext();

  // const isAutherized = (user: IUser | null) => {
  //   if (user) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  // if (!isAutherized(user)) {
  //   history.push('/login');
  // }

  return <>{children}</>;
}
