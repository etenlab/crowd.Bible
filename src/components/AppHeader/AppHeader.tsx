import { useRef, useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { IonHeader, IonToolbar } from '@ionic/react';

import { Toolbar, useColorModeContext } from '@eten-lab/ui-kit';

import { useAppContext } from '@/hooks/useAppContext';
import { RouteConst } from '@/constants/route.constant';

const headerlessPages = [
  RouteConst.WELCOME,
  RouteConst.LOGIN,
  RouteConst.REGISTER,
  RouteConst.FORGET_PASSWORD,
];

export function AppHeader({
  kind,
  onToggle,
}: {
  kind: 'menu' | 'page';
  onToggle(): void;
}) {
  const history = useHistory();
  const location = useLocation();
  const { setColorMode } = useColorModeContext();

  const {
    states: {
      global: { user, isNewDiscussion, isNewNotification },
    },
    actions: { setPrefersColorScheme },
  } = useAppContext();

  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    if (user && user.prefersColorScheme) {
      return user.prefersColorScheme;
    } else {
      return 'light';
    }
  });
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
    history.push(RouteConst.HOME);
  };

  const isHeader = !headerlessPages.find(
    (routeStr) => location.pathname === routeStr,
  );

  if (!isHeader) {
    return null;
  }

  return kind === 'menu' ? (
    <IonHeader>
      <IonToolbar class="ionic-toolbar">
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
          onClickMenuBtn={onToggle}
        />
      </IonToolbar>
    </IonHeader>
  ) : (
    <IonHeader>
      <IonToolbar class="ionic-toolbar">
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
          onClickMenuBtn={onToggle}
        />
      </IonToolbar>
    </IonHeader>
  );
}
