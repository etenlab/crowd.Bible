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
import './styles.css';

import { ThemeProvider } from '@eten-lab/ui-kit';
import { AppContextProvider } from './AppContext';
import useSeedService from './hooks/useSeedService';
import { useEffect } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { AppRoutes } from '@/routes/AppRoutes';

setupIonicReact();

export default function App() {
  const seedService = useSeedService();
  useEffect(() => {
    if (seedService) {
      seedService.init();
    }
  }, [seedService]);

  return (
    <IonApp>
      <AppContextProvider>
        <ThemeProvider autoDetectPrefersDarkMode={false}>
          <IonReactRouter>
            <PageLayout>
              <IonRouterOutlet id="crowd-bible-router-outlet">
                <AppRoutes />
              </IonRouterOutlet>
            </PageLayout>
          </IonReactRouter>
        </ThemeProvider>
      </AppContextProvider>
    </IonApp>
  );
}
