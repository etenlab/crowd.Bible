import { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { IonRouterOutlet, setupIonicReact, IonApp } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './styles.css';

import { ThemeProvider } from '@eten-lab/ui-kit';
import { AppContextProvider } from './AppContext';

import { AppMenu } from '@/components/Layout';

import { RouteConst } from '@/constants/route.constant';

import { AppRoutes } from '@/routes/AppRoutes';
import { RouteGuarder } from '@/components/RouteGuarder';
import { useCacheBuster } from '@/hooks/useCacheBuster';

setupIonicReact();

const duplicated: string[] = [];

for (let i = 0; i < AppRoutes.length; i++) {
  const route = AppRoutes[i];
  for (let j = i + 1; j < AppRoutes.length; j++) {
    if (AppRoutes[j].path === route.path) {
      duplicated.push(route.path as string);
    }
  }
}

export default function App() {
  const { loading, isLatestVersion, refreshCacheAndReload } = useCacheBuster();

  if (duplicated.length > 0) {
    alert(`There are duplicated Routes! \n ${duplicated.join('\n')}`);
  }

  useEffect(() => {
    if (!loading && !isLatestVersion) refreshCacheAndReload();
  }, [loading, isLatestVersion, refreshCacheAndReload]);

  return (
    <>
      {loading || !isLatestVersion ? null : (
        <IonApp>
          <AppContextProvider>
            <ThemeProvider autoDetectPrefersDarkMode={false}>
              <IonReactRouter>
                <AppMenu />
                <IonRouterOutlet id="crowd-bible-app">
                  {AppRoutes.map((route) => {
                    if (route.protected) {
                      return (
                        <Route
                          key={route.path as string}
                          path={route.path}
                          exact
                          render={() => (
                            <RouteGuarder>{route.children}</RouteGuarder>
                          )}
                        />
                      );
                    } else {
                      return (
                        <Route
                          key={route.path as string}
                          exact
                          path={route.path}
                          render={() => <>{route.children}</>}
                        />
                      );
                    }
                  })}
                  <Route render={() => <Redirect to={RouteConst.HOME} />} />
                </IonRouterOutlet>
              </IonReactRouter>
            </ThemeProvider>
          </AppContextProvider>
        </IonApp>
      )}
    </>
  );
}

// trigger rebuild 37
