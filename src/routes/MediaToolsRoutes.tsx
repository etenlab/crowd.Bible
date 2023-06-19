import { MapDetailPage } from '@/pages/MediaTools/MapDetailPage';
import { MapTranslatorPage } from '@/pages/MediaTools/MapTranslator';

import { RouteConst } from '@/constants/route.constant';
import { CustomRouteProps } from './AppRoutes';

export const MediaToolsRoutes: CustomRouteProps[] = [
  {
    path: RouteConst.MAP_LIST,
    children: <MapTranslatorPage />,
  },
  {
    path: `${RouteConst.MAP_DETAIL}/:id`,
    children: <MapDetailPage />,
  },
];
