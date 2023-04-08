import { Route, Switch } from 'react-router-dom';

import { SvgTranslationPage } from '@/pages/MediaTools/SvgTranslationPage';
import { SvgTranslatedPage } from '@/pages/MediaTools/SvgTranslatedPage';
import { MapListPage } from '@/pages/MediaTools/MapListPage';
import { MapStringsListPage } from '@/pages/MediaTools/MapStringsListPage';
import { MapDetailPage } from '../pages/MediaTools/MapDetailPage';

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
        <MapListPage />
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
