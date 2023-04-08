import { useRef, useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import {
  IonMenu,
  IonPage,
  IonHeader,
  IonContent,
  IonToolbar,
  IonList,
  IonItem,
} from '@ionic/react';

import { LinkItem } from '../LinkItem';
import './PageLayout.css';

import {
  Toolbar,
  MuiMaterial,
  Alert,
  useColorModeContext,
  Typography,
} from '@eten-lab/ui-kit';

import { useAppContext } from '@/hooks/useAppContext';

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
    actions: { closeFeedback, setPrefersColorScheme },
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

  const toggleDarkTheme = useCallback(
    (shouldToggle: boolean) => {
      if (shouldToggle) {
        setThemeMode('dark');
        setColorMode('dark');
      } else {
        setThemeMode('light');
        setColorMode('light');
      }

      bodyRef.current?.classList.toggle('dark', shouldToggle);
    },
    [setColorMode],
  );

  useEffect(() => {
    bodyRef.current = window.document.body;

    if (user && user.prefersColorScheme) {
      toggleDarkTheme(user.prefersColorScheme === 'dark');
      return;
    }

    prefersDarkRef.current = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDarkRef.current.addListener((e) => {
      toggleDarkTheme(e.matches);
    });
    toggleDarkTheme(prefersDarkRef.current.matches);
  }, [user, toggleDarkTheme]);

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

  const handleGoToHomePage = () => {
    history.push('/home');
  };

  const handleLogout = () => {
    localStorage.clear();
    history.push('/login');
  };

  let isHeader = true;

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
            <LinkItem to="/home" label="Home" />
            <LinkItem
              to="/language-proficiency"
              label="Language proficiency setting"
            />
            <LinkItem to="/settings" label="Settings" />
            <LinkItem to="/admin" label="Admin" />
            {/* <LinkItem to="/home" label="Logout" /> */}
            <IonItem button onClick={handleLogout}>
              <Typography variant="body1" color="text.dark">
                Logout
              </Typography>
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
                onClickTitleBtn={handleGoToHomePage}
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
