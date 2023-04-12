import { Route, Switch } from 'react-router-dom';

import { SiteTextAdminPage } from '@/pages/AppDev/SiteTextAdminPage';
import { SiteTextTranslationPage } from '@/pages/AppDev/SiteTextTranslationPage';

import { ApplicationsListPage } from '@/pages/AppDev/ApplicationsListPage';
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
      <Route exact path="/site-text-translation">
        <SiteTextTranslationPage />
      </Route>

      <Route exact path={RouteConst.APPLICATIONS}>
        <ApplicationsListPage />
      </Route>
      <Route exact path={RouteConst.SITE_TEXT_LIST}>
        <SiteTextListPage />
      </Route>
      <Route exact path={RouteConst.SITE_TEXT_EDITOR}>
        <SiteTextEditorPage />
      </Route>
      <Route exact path={RouteConst.SITE_TEXT_DETAIL}>
        <SiteTextDetailPage />
      </Route>
      <Route exact path={RouteConst.SITE_TEXT_TRANSLATION_EDITOR}>
        <SiteTextTranslationEditorPage />
      </Route>

      {/* <Route exact path={`${RouteConst.SITE_TEXT_EDITOR}/:appId`}>
        <SiteTextEditorPage />
      </Route>
      <Route exact path={`${RouteConst.SITE_TEXT_EDITOR}/:appId/:wordId`}>
        <SiteTextEditorPage />
      </Route> */}
    </Switch>
  );
}
