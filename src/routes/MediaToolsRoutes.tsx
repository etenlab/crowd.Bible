import { Route } from 'react-router-dom';

import { SvgTranslationPage } from '@/pages/MediaTools/SvgTranslationPage';
import { SvgTranslatedPage } from '@/pages/MediaTools/SvgTranslatedPage';
import { MapListPage } from '@/pages/MediaTools/MapListPage';
import { MapStringsListPage } from '@/pages/MediaTools/MapStringsListPage';

export function MediaToolsRoutes() {
  return (
    <>
      <Route exact path="/svg-translation">
        <SvgTranslationPage />
      </Route>
      <Route exact path="/svg-translated-map">
        <SvgTranslatedPage />
      </Route>
      <Route exact path="/map-list">
        <MapListPage />
      </Route>
      <Route exact path="/map-strings-list">
        <MapStringsListPage />
      </Route>
    </>
  );
}
