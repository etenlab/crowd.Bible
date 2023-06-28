import { FileImportPage } from '@/pages/DataTools/FileImportPage';
import { SearchNodePage } from '@/pages/DataTools/GraphViewer/SearchNodePage';
import { NodeDetailsPage } from '@/pages/DataTools/GraphViewer/NodeDetailsPage';
import { SqlPage } from '@/pages/DataTools/SqlRunner/SqlPage';

import { RouteConst } from '@/constants/route.constant';
import { CustomRouteProps } from './AppRoutes';

export const DataToolsRoutes: CustomRouteProps[] = [
  {
    path: RouteConst.GRAPH_VIEWER,
    children: <SearchNodePage />,
  },
  {
    path: `${RouteConst.GRAPH_VIEWER}/:nodeId`,
    children: <NodeDetailsPage />,
  },
  {
    path: RouteConst.FILE_IMPORT,
    children: <FileImportPage />,
  },
  {
    path: RouteConst.SQL_RUNNER,
    children: <SqlPage />,
  },
];
