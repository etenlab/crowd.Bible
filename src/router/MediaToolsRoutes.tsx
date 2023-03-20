import { Route } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';

import { SvgTranslationPage } from '@/pages/MediaTools/SvgTranslationPage';
import { SvgTranslatedPage } from '@/pages/MediaTools/SvgTranslatedPage';

export function MediaToolsRoutes() {
  return (
    <IonRouterOutlet>
      <Route exact path="/svg-translation">
        <SvgTranslationPage />
      </Route>
      <Route exact path="/svg-translated-map">
        <SvgTranslatedPage />
      </Route>
    </IonRouterOutlet>
  );
}
