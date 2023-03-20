import { Route } from 'react-router-dom';

import { FileImportPage } from '@/pages/DataTools/FileImportPage';
import { GraphViewerPage } from '@/pages/DataTools/GraphViewerPage';

export function DataToolsRoutes() {
  return (
    <>
      <Route exact path="/graph-viewer">
        <GraphViewerPage />
      </Route>

      <Route exact path="/file-import">
        <FileImportPage />
      </Route>
    </>
  );
}
