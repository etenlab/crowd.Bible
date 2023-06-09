import { useRef, useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { IonHeader, IonToolbar } from '@ionic/react';

import { Toolbar, useColorModeContext } from '@eten-lab/ui-kit';

import { useAppContext } from '@/hooks/useAppContext';
import { RouteConst } from '@/constants/route.constant';
import { ColorThemes } from '@/constants/common.constant';

const headerlessPages = [
  RouteConst.WELCOME,
  RouteConst.LOGIN,
  RouteConst.REGISTER,
  RouteConst.FORGET_PASSWORD,
];

export function AppHeader({ kind }: { kind: 'menu' | 'page' }) {
  const history = useHistory();
  const location = useLocation();
  const { setColorMode } = useColorModeContext();

  const {
    states: {
      components: { menu },
      global: { prefersColorScheme, isNewDiscussion, isNewNotification, mode },
    },
    actions: { setPrefersColorScheme },
  } = useAppContext();

  const [themeMode, setThemeMode] = useState<
    ColorThemes.DARK | ColorThemes.LIGHT
  >(() => {
    if (prefersColorScheme) {
      return prefersColorScheme;
    } else {
      return ColorThemes.LIGHT;
    }
  });
  const prefersDarkRef = useRef<MediaQueryList | null>(null);
  const bodyRef = useRef<HTMLElement | null>(null);

  const toggleDarkTheme = useCallback(
    (shouldToggle: boolean) => {
      if (shouldToggle) {
        setThemeMode(ColorThemes.DARK);
        setColorMode(ColorThemes.DARK);
      } else {
        setThemeMode(ColorThemes.LIGHT);
        setColorMode(ColorThemes.LIGHT);
      }

      bodyRef.current?.classList.toggle(ColorThemes.DARK, shouldToggle);
    },
    [setColorMode],
  );

  useEffect(() => {
    bodyRef.current = window.document.body;

    if (prefersColorScheme) {
      toggleDarkTheme(prefersColorScheme === ColorThemes.DARK);
      return;
    }

    prefersDarkRef.current = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDarkRef.current.addListener((e) => {
      toggleDarkTheme(e.matches);
    });
    toggleDarkTheme(prefersDarkRef.current.matches);
  }, [toggleDarkTheme, prefersColorScheme]);

  const handleToogleTheme = () => {
    if (themeMode === ColorThemes.LIGHT) {
      toggleDarkTheme(true);
      setPrefersColorScheme(ColorThemes.DARK);
    } else {
      toggleDarkTheme(false);
      setPrefersColorScheme(ColorThemes.LIGHT);
    }
  };

  const handleGoToHomePage = () => {
    history.push(RouteConst.HOME);
  };

  const handleToggleMenu = () => {
    if (menu) {
      console.log(menu);
      menu.toggle();
    }
  };

  const isHeader = !headerlessPages.find(
    (routeStr) => location.pathname === routeStr,
  );

  const buttonsConfig = mode.beta
    ? {
        notification: true,
        discussion: true,
        menu: true,
      }
    : {
        notification: false,
        discussion: false,
        menu: true,
      };

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
            history.push(RouteConst.DISCUSSIONS_LIST);
          }}
          onClickNotificationBtn={() => {
            history.push(RouteConst.NOTIFICATIONS);
          }}
          onClickMenuBtn={handleToggleMenu}
        />
      </IonToolbar>
    </IonHeader>
  ) : (
    <IonHeader>
      <IonToolbar class="ionic-toolbar">
        <Toolbar
          title="crowd.Bible"
          buttons={buttonsConfig}
          themeMode={themeMode}
          onClickTitleBtn={handleGoToHomePage}
          onClickThemeModeBtn={handleToogleTheme}
          isNewDiscussion={isNewDiscussion}
          isNewNotification={isNewNotification}
          onClickDiscussionBtn={() => {
            history.push(RouteConst.DISCUSSIONS_LIST);
          }}
          onClickNotificationBtn={() => {
            history.push(RouteConst.NOTIFICATIONS);
          }}
          onClickMenuBtn={handleToggleMenu}
        />
      </IonToolbar>
    </IonHeader>
  );
}
