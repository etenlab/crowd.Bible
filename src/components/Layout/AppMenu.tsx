import { useRef, useEffect } from 'react';
import { IonMenu, IonContent, IonFooter, IonMenuToggle } from '@ionic/react';

import { LinkGroup } from '@/components/LinkGroup';
import { LogoutButton } from '@/components/LogoutButton';
import { AppHeader } from './AppHeader';

import './Layout.css';

import { useAppContext } from '@/hooks/useAppContext';
import { useSiteText } from '@/hooks/useSiteText';

import { RouteConst } from '@/constants/route.constant';

export function AppMenu() {
  const {
    states: {
      components: { menu },
    },
    actions: { setMenuCom },
  } = useAppContext();
  const ref = useRef<HTMLIonMenuElement>(null);
  const { tr } = useSiteText();

  const menuLinks = {
    group: tr('Menu'),
    linkItems: [
      { to: RouteConst.HOME, label: tr('Home'), implemented: true },
      { to: RouteConst.SETTINGS, label: tr('Settings'), implemented: true },
      {
        to: RouteConst.ADMIN,
        label: tr('Admin'),
        onlineOnly: true,
        adminOnly: true,
      },
      {
        to: RouteConst.LOGIN,
        label: tr('Login'),
        implemented: true,
        noAuthOnly: true,
      },
      {
        to: RouteConst.REGISTER,
        label: tr('Register'),
        implemented: true,
        noAuthOnly: true,
      },
      {
        to: RouteConst.ADMIN_MANAGE,
        label: tr('AdminManage'),
        implemented: true,
        noAuthOnly: true,
      },
    ],
  };

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
