import { Route, Switch } from 'react-router-dom';

import { SiteTextAdminPage } from '@/pages/AppDev/SiteTextAdminPage';

import { SiteTextAppListPage } from '@/src/pages/AppDev/SiteTextAppListPage';
import { SiteTextListPage } from '@/pages/AppDev/SiteTextListPage';
import { SiteTextEditorPage } from '@/pages/AppDev/SiteTextEditorPage';
import { SiteTextDetailPage } from '@/pages/AppDev/SiteTextDetailPage';
import { SiteTextTranslationEditorPage } from '@/pages/AppDev/SiteTextTranslationEditorPage';

import { RouteConst } from '@/constants/route.constant';

export function AppDevRoutes() {
  return (
    <Switch>
      <Route exact path="/site-text-admin">
        <SiteTextAdminPage />
      </Route>
      <Route exact path={RouteConst.SITE_TEXT_TRANSLATION_APP_LIST}>
        <SiteTextAppListPage />
      </Route>

      <Route exact path={`${RouteConst.SITE_TEXT_LIST}/:appId`}>
        <SiteTextListPage />
      </Route>

      {/* create a new site text */}
      <Route exact path={`${RouteConst.SITE_TEXT_EDITOR}/:appId`}>
        <SiteTextEditorPage />
      </Route>
      <Route exact path={`${RouteConst.SITE_TEXT_EDITOR}/:appId/:siteTextId`}>
        <SiteTextEditorPage />
      </Route>

      <Route exact path={`${RouteConst.SITE_TEXT_DETAIL}/:siteTextId`}>
        <SiteTextDetailPage />
      </Route>
      <Route
        exact
        path={`${RouteConst.SITE_TEXT_CHANGE_TRANSLATION}/:siteTextId`}
      >
        <SiteTextDetailPage isChangeTranslationPage={true} />
      </Route>

      <Route
        exact
        path={`${RouteConst.SITE_TEXT_TRANSLATION_EDITOR}/:siteTextId`}
      >
        <SiteTextTranslationEditorPage />
      </Route>
    </Switch>
  );
}
