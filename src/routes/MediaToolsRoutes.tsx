import { Route, Switch } from 'react-router-dom';

import { MapDetailPage } from '../pages/MediaTools/MapDetailPage';
import { MapTranslatorPage } from '../pages/MediaTools/MapTranslator';

export function MediaToolsRoutes() {
  return (
    <Switch>
      <Route exact path="/map-list">
        <MapTranslatorPage />
      </Route>
      <Route exact path="/map-detail/:id">
        <MapDetailPage />
      </Route>
    </Switch>
  );
}
