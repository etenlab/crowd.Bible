import { useRef, useEffect } from 'react';
import { IonMenu, IonContent, IonFooter, IonMenuToggle } from '@ionic/react';

import { LinkGroup } from '@/components/LinkGroup';
import { LogoutButton } from '@/components/LogoutButton';
import { AppHeader } from './AppHeader';

import './Layout.css';

import { useAppContext } from '@/hooks/useAppContext';
import { RouteConst } from '@/constants/route.constant';

const menuLinks = {
  group: 'Menu',
  linkItems: [
    { to: RouteConst.HOME, label: 'Home', implemented: true },
    { to: RouteConst.SETTINGS, label: 'Settings', implemented: true },
    {
      to: RouteConst.ADMIN,
      label: 'Admin',
      onlineOnly: true,
      adminOnly: true,
    },
    {
      to: RouteConst.LOGIN,
      label: 'Login',
      implemented: true,
      noAuthOnly: true,
    },
    {
      to: RouteConst.REGISTER,
      label: 'Register',
      implemented: true,
      noAuthOnly: true,
    },
  ],
};

export function AppMenu() {
  const {
    states: {
      components: { menu },
    },
    actions: { setMenuCom },
  } = useAppContext();
  const ref = useRef<HTMLIonMenuElement>(null);

  useEffect(() => {
    if (ref.current && !menu) {
      setMenuCom(ref.current);
    }
  }, [setMenuCom, menu]);

  return (
    <IonMenu ref={ref} contentId="crowd-bible-app">
      <AppHeader kind="menu" />

      <IonContent>
        <IonMenuToggle>
          <LinkGroup group={menuLinks.group} linkItems={menuLinks.linkItems} />
        </IonMenuToggle>
      </IonContent>

      <IonFooter>
        <IonMenuToggle>
          <LogoutButton />
        </IonMenuToggle>
      </IonFooter>
    </IonMenu>
  );
}
