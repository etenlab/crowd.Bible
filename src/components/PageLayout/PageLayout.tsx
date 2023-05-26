import { useRef } from 'react';
import {
  IonMenu,
  IonPage,
  IonContent,
  IonFooter,
  IonMenuToggle,
} from '@ionic/react';

import { LinkGroup } from '../LinkGroup';
import { AppHeader } from '../AppHeader';
import { LogoutButton } from '../LogoutButton';

import './PageLayout.css';

import { MuiMaterial, Alert } from '@eten-lab/ui-kit';

import { useAppContext } from '@/hooks/useAppContext';
import { SqlPortal } from '@/pages/DataTools/SqlRunner/SqlPortal';
import { RouteConst } from '@/constants/route.constant';

const { Snackbar, CircularProgress, Backdrop, Stack } = MuiMaterial;

const menuLinks = {
  group: 'Menu',
  linkItems: [
    { to: RouteConst.HOME, label: 'Home', implemented: true },
    {
      to: RouteConst.LANGUAGE_PROFICIENCY,
      label: 'Language proficiency setting',
      implemented: true,
    },
    { to: RouteConst.SETTINGS, label: 'Settings', implemented: true },
    {
      to: RouteConst.ADMIN,
      label: 'Admin',
      onlineOnly: true,
    },
    { to: RouteConst.LOGIN, label: 'Login', implemented: true },
    { to: RouteConst.REGISTER, label: 'Register', implemented: true },
  ],
};

interface PageLayoutProps {
  children?: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const {
    states: {
      global: { snack, loading, singletons, isSqlPortalShown },
    },
    actions: { closeFeedback },
  } = useAppContext();
  const ref = useRef<HTMLIonMenuElement>(null);

  const handleToggleMenu = () => {
    ref.current!.toggle();
  };

  const isLoading = loading || !singletons;

  return (
    <>
      <IonMenu ref={ref} contentId="crowd-bible-app">
        <AppHeader kind="menu" onToggle={handleToggleMenu} />

        <IonContent>
          <IonMenuToggle>
            <LinkGroup
              group={menuLinks.group}
              linkItems={menuLinks.linkItems}
            />
          </IonMenuToggle>
        </IonContent>

        <IonFooter>
          <IonMenuToggle>
            <LogoutButton />
          </IonMenuToggle>
        </IonFooter>
      </IonMenu>

      <IonPage id="crowd-bible-app">
        <AppHeader kind="page" onToggle={handleToggleMenu} />

        <IonContent fullscreen className="crowd-bible-ion-content">
          {children}

          <Snackbar
            open={snack.open}
            autoHideDuration={5000}
            onClose={closeFeedback}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            sx={{
              top: '70px !important',
            }}
            key="top-center"
          >
            <Alert
              variant="standard"
              onClose={closeFeedback}
              severity={snack.severity}
              sx={{ width: '100%' }}
              content={undefined}
              rel={undefined}
              rev={undefined}
            >
              {snack.message}
            </Alert>
          </Snackbar>

          <Backdrop sx={{ color: '#fff', zIndex: 1000 }} open={isLoading}>
            <Stack justifyContent="center">
              <div style={{ margin: 'auto' }}>
                <CircularProgress color="inherit" />
              </div>
              <div>LOADING</div>
            </Stack>
          </Backdrop>

          {isSqlPortalShown && <SqlPortal />}
        </IonContent>
      </IonPage>
    </>
  );
}
