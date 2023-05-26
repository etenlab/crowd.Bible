import { Route, Switch } from 'react-router-dom';

import { SiteTextAdminPage } from '@/pages/AppDev/SiteTextAdminPage';

import { AppListPage } from '@/pages/AppDev/AppListPage';
import { NewApplicationAddPage } from '@/pages/AppDev/NewApplicationAddPage';

import { SiteTextAppListPage } from '@/pages/AppDev/SiteTextAppListPage';
import { SiteTextListPage } from '@/pages/AppDev/SiteTextListPage';

import { NewSiteTextAddPage } from '@/src/pages/AppDev/NewSiteTextAddPage';
import { NewSiteTextTranslationAddPage } from '@/src/pages/AppDev/NewSiteTextTranslationAddPage';

import { SiteTextDetailPage } from '@/pages/AppDev/SiteTextDetailPage';

import { SiteTextDefinitionPage } from '@/pages/AppDev/SiteTextDefinitionPage';
import { SiteTextTranslationSwitchPage } from '@/pages/AppDev/SiteTextTranslationSwitchPage';

import { RouteConst } from '@/constants/route.constant';

export function AppDevRoutes() {
  return (
    <Switch>
      <Route exact path="/site-text-admin">
        <SiteTextAdminPage />
      </Route>

      <Route exact path={RouteConst.APPLICATION_LIST}>
        <AppListPage />
      </Route>
      <Route exact path={RouteConst.ADD_APPLICATION}>
        <NewApplicationAddPage />
      </Route>

      <Route exact path={RouteConst.SITE_TEXT_TRANSLATION_APP_LIST}>
        <SiteTextAppListPage />
      </Route>
      <Route exact path={`${RouteConst.SITE_TEXT_LIST}/:appId`}>
        <SiteTextListPage />
      </Route>

      <Route exact path={`${RouteConst.SITE_TEXT_DETAIL}/:appId/:siteTextId`}>
        <SiteTextDetailPage />
      </Route>
      <Route
        exact
        path={`${RouteConst.SITE_TEXT_DETAIL}/:appId/:siteTextId/:originalDefinitionRel`}
      >
        <SiteTextDetailPage />
      </Route>
      <Route
        exact
        path={`${RouteConst.SITE_TEXT_DETAIL}/:appId/:siteTextId/:originalDefinitionRel/:translatedDefinitionRel`}
      >
        <SiteTextDetailPage />
      </Route>

      <Route exact path={`${RouteConst.ADD_NEW_SITE_TEXT}/:appId`}>
        <NewSiteTextAddPage />
      </Route>
      <Route exact path={`${RouteConst.ADD_NEW_SITE_TEXT}/:appId/:siteTextId`}>
        <NewSiteTextAddPage />
      </Route>

      <Route
        exact
        path={`${RouteConst.ADD_NEW_SITE_TEXT_TRANSLATION}/:appId/:siteTextId/:originalDefinitionRel`}
      >
        <NewSiteTextTranslationAddPage />
      </Route>
      <Route
        exact
        path={`${RouteConst.ADD_NEW_SITE_TEXT_TRANSLATION}/:appId/:siteTextId/:originalDefinitionRel/:translatedDefinitionRel`}
      >
        <NewSiteTextTranslationAddPage />
      </Route>

      <Route
        exact
        path={`${RouteConst.SITE_TEXT_DEFINITION}/:appId/:siteTextId/:originalDefinitionRel`}
      >
        <SiteTextDefinitionPage />
      </Route>

      <Route
        exact
        path={`${RouteConst.SITE_TEXT_TRANSLATION_SWITCH}/:appId/:siteTextId/:originalDefinitionRel/:translatedDefinitionRel`}
      >
        <SiteTextTranslationSwitchPage />
      </Route>
    </Switch>
  );
}
