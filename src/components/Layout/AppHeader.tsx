import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { IonHeader, IonToolbar } from '@ionic/react';

import {
  Toolbar,
  useColorModeContext,
  CrowdBibleUI,
  LanguageInfo,
  MuiMaterial,
} from '@eten-lab/ui-kit';

import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';
import { useSiteText } from '@/hooks/useSiteText';

import { RouteConst } from '@/constants/route.constant';
import { ColorThemes } from '@/constants/common.constant';

import { langInfo2String, langInfo2tag, tag2langInfo } from '@/utils/langUtils';

const { ButtonList } = CrowdBibleUI;
const { Box } = MuiMaterial;

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
  const { tr } = useTr();

  const {
    states: {
      components: { menu },
      global: { prefersColorScheme, isNewDiscussion, isNewNotification, mode },
    },
    actions: { setPrefersColorScheme, setModalCom },
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
      menu.toggle();
    }
  };

  const handleClickDiscussionButton = () => {
    history.push(RouteConst.DISCUSSIONS_LIST);
  };

  const handleClickNotificationButton = () => {
    history.push(RouteConst.NOTIFICATIONS);
  };

  const handleClickLanguageButton = () => {
    setModalCom(<LanguageList />);
  };

  const isHeader = !headerlessPages.find(
    (routeStr) => location.pathname === routeStr,
  );

  const buttonsConfig = mode.beta
    ? {
        notification: true,
        discussion: true,
        language: true,
        menu: true,
      }
    : {
        notification: false,
        discussion: false,
        language: true,
        menu: true,
      };

  if (!isHeader) {
    return null;
  }

  return kind === 'menu' ? (
    <IonHeader>
      <IonToolbar class="ionic-toolbar">
        <Toolbar
          title={tr('crowd.Bible')}
          buttons={{
            notification: false,
            discussion: false,
            language: false,
            menu: false,
          }}
          themeMode={themeMode}
          onClickThemeModeBtn={handleToogleTheme}
          onClickDiscussionBtn={handleClickDiscussionButton}
          onClickNotificationBtn={handleClickNotificationButton}
          onClickLanguageBtn={handleClickLanguageButton}
          onClickMenuBtn={handleToggleMenu}
        />
      </IonToolbar>
    </IonHeader>
  ) : (
    <IonHeader>
      <IonToolbar class="ionic-toolbar">
        <Toolbar
          title={tr('crowd.Bible')}
          buttons={buttonsConfig}
          themeMode={themeMode}
          onClickTitleBtn={handleGoToHomePage}
          onClickThemeModeBtn={handleToogleTheme}
          isNewDiscussion={isNewDiscussion}
          isNewNotification={isNewNotification}
          onClickDiscussionBtn={handleClickDiscussionButton}
          onClickNotificationBtn={handleClickNotificationButton}
          onClickLanguageBtn={handleClickLanguageButton}
          onClickMenuBtn={handleToggleMenu}
        />
      </IonToolbar>
    </IonHeader>
  );
}

function LanguageList() {
  const {
    states: {
      global: { singletons, crowdBibleApp },
    },
    actions: { changeAppLanguage },
  } = useAppContext();
  const { getColor } = useColorModeContext();

  const { getAppLanguageList } = useSiteText();
  const { tr } = useTr();

  const [languageList, setLanguageList] = useState<LanguageInfo[]>([]);

  useEffect(() => {
    if (singletons && crowdBibleApp) {
      getAppLanguageList().then((list) =>
        setLanguageList([crowdBibleApp.languageInfo, ...list]),
      );
    }
  }, [getAppLanguageList, singletons, crowdBibleApp]);

  const items = useMemo(() => {
    return languageList
      .filter((languageInfo) => langInfo2tag(languageInfo))
      .map((languageInfo) => ({
        value: langInfo2tag(languageInfo)!,
        label: langInfo2String(languageInfo),
      }));
  }, [languageList]);

  const handleClickItem = (value: string) => {
    const langInfo = tag2langInfo(value);
    changeAppLanguage(langInfo);
  };

  return (
    <Box
      sx={{
        maxHeight: '300px',
        padding: '20px 0',
        backgroundColor: getColor('light-blue'),
        overflowY: 'auto',
      }}
    >
      <ButtonList
        label={tr('Help Us Translate!')}
        withUnderline
        items={items}
        onClick={handleClickItem}
        subheaderBGColor={getColor('light-blue')}
      />
    </Box>
  );
}
