import { Route, Switch } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
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
import { WelcomePage } from './pages/WelcomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

import { ThemeProvider } from '@eten-lab/ui-kit';
import { AppContextProvider } from './AppContext';
import { PageLayout } from './components/PageLayout';
import { RoutesGuardian } from './components/RoutesGuardian';
import { ProtectedRoutes } from './routes/ProtectedRoutes';

setupIonicReact();

export default function App() {
  return (
    <IonApp>
      <AppContextProvider>
        <ThemeProvider autoDetectPrefersDarkMode={false}>
          <IonReactRouter>
            <PageLayout>
              <IonRouterOutlet id="crowd-bible-router-outlet">
                <Switch>
                  <Route exact path="/welcome">
                    <WelcomePage />
                  </Route>

                  <Route exact path="/login">
                    <LoginPage />
                  </Route>
                  <Route exact path="/register">
                    <RegisterPage />
                  </Route>

                  <RoutesGuardian>
                    <ProtectedRoutes />
                  </RoutesGuardian>
                </Switch>
              </IonRouterOutlet>
            </PageLayout>
          </IonReactRouter>
        </ThemeProvider>
      </AppContextProvider>
    </IonApp>
  );
}
