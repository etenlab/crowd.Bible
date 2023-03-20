import { useRef, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import {
  IonMenu,
  IonPage,
  IonHeader,
  IonContent,
  IonToolbar,
  IonList,
  IonLabel,
  IonItem,
} from '@ionic/react';

import './PageLayout.css';

import {
  Toolbar,
  MuiMaterial,
  Alert,
  useColorModeContext,
} from '@eten-lab/ui-kit';

import { useAppContext } from '../../hooks/useAppContext';

const { Snackbar, CircularProgress, Backdrop, Stack } = MuiMaterial;

interface PageLayoutProps {
  children?: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const history = useHistory();
  const location = useLocation();
  const { setColorMode } = useColorModeContext();

  const {
    states: {
      global: { user, snack, isNewDiscussion, isNewNotification, loading },
    },
    actions: { closeFeedback, setPrefersColorScheme, logout },
  } = useAppContext();

  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    if (user && user.prefersColorScheme) {
      return user.prefersColorScheme;
    } else {
      return 'light';
    }
  });
  const ref = useRef<HTMLIonMenuElement>(null);
  const prefersDarkRef = useRef<MediaQueryList | null>(null);
  const bodyRef = useRef<HTMLElement | null>(null);

  const toggleDarkTheme = (shouldToggle: boolean) => {
    if (shouldToggle) {
      setThemeMode('dark');
      setColorMode('dark');
    } else {
      setThemeMode('light');
      setColorMode('light');
    }

    bodyRef.current?.classList.toggle('dark', shouldToggle);
  };

  useEffect(() => {
    if (user && user.prefersColorScheme) {
      return;
    }

    bodyRef.current = window.document.body;
    prefersDarkRef.current = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDarkRef.current.addListener((e) => {
      toggleDarkTheme(e.matches);
    });
    toggleDarkTheme(prefersDarkRef.current.matches);
  }, [user]);

  const handleToggleMenu = () => {
    ref.current!.toggle();
  };

  const handleToogleTheme = () => {
    if (themeMode === 'light') {
      toggleDarkTheme(true);
      setPrefersColorScheme('dark');
    } else {
      toggleDarkTheme(false);
      setPrefersColorScheme('light');
    }
  };

  const handleLogout = () => {
    logout();
  };

  let isHeader = true;
  const qaUrl = user?.role === 'translator' ? '/translator-qa' : '/reader-qa';

  switch (location.pathname) {
    case '/welcome': {
      isHeader = false;
      break;
    }
    case '/login': {
      isHeader = false;
      break;
    }
    case '/register': {
      isHeader = false;
      break;
    }
    default: {
      break;
    }
  }

  return (
    <>
      <IonMenu ref={ref} contentId="crowd-bible-app">
        {isHeader ? (
          <IonHeader>
            <IonToolbar>
              <Toolbar
                title="crowd.Bible"
                buttons={{
                  notification: false,
                  discussion: false,
                  menu: false,
                }}
                themeMode={themeMode}
                onClickThemeModeBtn={handleToogleTheme}
                onClickDiscussionBtn={() => {
                  history.push('/discussions-list');
                }}
                onClickNotificationBtn={() => {
                  history.push('/notifications');
                }}
                onClickMenuBtn={handleToggleMenu}
              />
            </IonToolbar>
          </IonHeader>
        ) : null}
        <IonContent>
          <IonList>
            <IonItem routerLink="/home">
              <IonLabel>Home</IonLabel>
            </IonItem>

            <IonItem routerLink="/language-proficiency">
              <IonLabel>Language proficiency setting</IonLabel>
            </IonItem>

            <IonItem routerLink="/settings">
              <IonLabel>Settings</IonLabel>
            </IonItem>

            <IonItem routerLink="/admin">
              <IonLabel>Admin</IonLabel>
            </IonItem>

            <IonItem routerLink={qaUrl}>
              <IonLabel>Question & Answer</IonLabel>
            </IonItem>

            <IonItem routerLink="/logout" onClick={handleLogout}>
              <IonLabel>Logout</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>
      <IonPage id="crowd-bible-app">
        {isHeader ? (
          <IonHeader>
            <IonToolbar>
              <Toolbar
                title="crowd.Bible"
                themeMode={themeMode}
                onClickThemeModeBtn={handleToogleTheme}
                isNewDiscussion={isNewDiscussion}
                isNewNotification={isNewNotification}
                onClickDiscussionBtn={() => {
                  history.push('/discussions-list');
                }}
                onClickNotificationBtn={() => {
                  history.push('/notifications');
                }}
                onClickMenuBtn={handleToggleMenu}
              />
            </IonToolbar>
          </IonHeader>
        ) : null}

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
            key="top-center"
          >
            <Alert
              variant="standard"
              onClose={closeFeedback}
              severity={snack.severity}
              sx={{ width: '100%' }}
            >
              {snack.message}
            </Alert>
          </Snackbar>

          <Backdrop sx={{ color: '#fff', zIndex: 1000 }} open={loading}>
            <Stack justifyContent="center">
              <div style={{ margin: 'auto' }}>
                <CircularProgress color="inherit" />
              </div>
              <div>LOADING</div>
            </Stack>
          </Backdrop>
        </IonContent>
      </IonPage>
    </>
  );
}
