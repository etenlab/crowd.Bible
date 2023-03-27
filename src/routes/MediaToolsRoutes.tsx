import { Route, Switch } from 'react-router-dom';

import { SvgTranslationPage } from '@/pages/MediaTools/SvgTranslationPage';
import { SvgTranslatedPage } from '@/pages/MediaTools/SvgTranslatedPage';

export function MediaToolsRoutes() {
  return (
    <Switch>
      <Route exact path="/svg-translation">
        <SvgTranslationPage />
      </Route>
      <Route exact path="/svg-translated-map">
        <SvgTranslatedPage />
      </Route>
    </Switch>
  );
}
