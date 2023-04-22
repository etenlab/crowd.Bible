import { Route, Switch } from 'react-router-dom';

import { SvgTranslationPage } from '@/pages/MediaTools/SvgTranslationPage';
import { SvgTranslatedPage } from '@/pages/MediaTools/SvgTranslatedPage';
import { MapStringsListPage } from '@/pages/MediaTools/MapStringsListPage';
import { MapDetailPage } from '../pages/MediaTools/MapDetailPage';
import { MapTranslatorPage } from '../pages/MediaTools/MapTranslator';

export function MediaToolsRoutes() {
  return (
    <Switch>
      <Route exact path="/svg-translation">
        <SvgTranslationPage />
      </Route>
      <Route exact path="/svg-translated-map">
        <SvgTranslatedPage />
      </Route>
      <Route exact path="/map-list">
        <MapTranslatorPage />
      </Route>
      <Route exact path="/map-detail/:id">
        <MapDetailPage />
      </Route>
      <Route exact path="/map-strings-list">
        <MapStringsListPage />
      </Route>
    </Switch>
  );
}
