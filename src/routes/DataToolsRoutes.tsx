import { Route, Switch } from 'react-router-dom';

import { FileImportPage } from '@/pages/DataTools/FileImportPage';
import { SearchNodePage } from '@/pages/DataTools/GraphViewer/SearchNodePage';
import { NodeDetailsPage } from '@/pages/DataTools/GraphViewer/NodeDetailsPage';
import { SqlRunner } from '../pages/DataTools/SqlRunner/SqlRunner';

export function DataToolsRoutes() {
  return (
    <Switch>
      <Route exact path="/graph-viewer">
        <SearchNodePage />
      </Route>

      <Route exact path="/graph-viewer/:nodeId">
        <NodeDetailsPage />
      </Route>

      <Route exact path="/file-import">
        <FileImportPage />
      </Route>

      <Route exact path="/sql-runner">
        <SqlRunner />
      </Route>
    </Switch>
  );
}
