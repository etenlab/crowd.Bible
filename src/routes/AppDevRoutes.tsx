import { AppListPage } from '@/pages/AppDev/AppListPage';
import { NewApplicationAddPage } from '@/pages/AppDev/NewApplicationAddPage';

import { SiteTextMenuPage } from '@/pages/AppDev/SiteTextMenuPage';
import { SiteTextUIWordListPage } from '@/pages/AppDev/SiteTextUIWordListPage';
import { SiteTextAppListPage } from '@/pages/AppDev/SiteTextAppListPage';
import { SiteTextListPage } from '@/pages/AppDev/SiteTextListPage';

import { NewSiteTextAddPage } from '@/pages/AppDev/NewSiteTextAddPage';
import { NewSiteTextTranslationAddPage } from '@/pages/AppDev/NewSiteTextTranslationAddPage';

import { SiteTextDetailPage } from '@/pages/AppDev/SiteTextDetailPage';

import { SiteTextDefinitionPage } from '@/pages/AppDev/SiteTextDefinitionPage';
import { SiteTextTranslationSwitchPage } from '@/pages/AppDev/SiteTextTranslationSwitchPage';
import { SiteTextLanguageListPage } from '@/pages/AppDev/SiteTextLanguageListPage';

import { RouteConst } from '@/constants/route.constant';
import { CustomRouteProps } from './AppRoutes';

export const AppDevRoutes: CustomRouteProps[] = [
  {
    path: RouteConst.APPLICATION_LIST,
    children: <AppListPage />,
  },
  {
    path: RouteConst.ADD_APPLICATION,
    children: <NewApplicationAddPage />,
  },
  {
    path: RouteConst.SITE_TEXT_MENU_PAGE,
    children: <SiteTextMenuPage />,
  },
  {
    path: RouteConst.SITE_TEXT_UI_WORD_LIST,
    children: <SiteTextUIWordListPage />,
  },
  {
    path: RouteConst.SITE_TEXT_TRANSLATION_APP_LIST,
    children: <SiteTextAppListPage />,
  },
  {
    path: `${RouteConst.SITE_TEXT_LIST}/:appId`,
    children: <SiteTextListPage />,
  },
  {
    path: `${RouteConst.SITE_TEXT_DETAIL}/:appId/:siteTextId`,
    children: <SiteTextDetailPage />,
  },
  {
    path: `${RouteConst.SITE_TEXT_DETAIL}/:appId/:siteTextId/:originalDefinitionRel`,
    children: <SiteTextDetailPage />,
  },
  {
    path: `${RouteConst.SITE_TEXT_DETAIL}/:appId/:siteTextId/:originalDefinitionRel/:translatedDefinitionRel`,
    children: <SiteTextDetailPage />,
  },
  {
    path: `${RouteConst.ADD_NEW_SITE_TEXT}/:appId`,
    children: <NewSiteTextAddPage />,
  },
  {
    path: `${RouteConst.ADD_NEW_SITE_TEXT}/:appId/:siteTextId`,
    children: <NewSiteTextAddPage />,
  },
  {
    path: `${RouteConst.ADD_NEW_SITE_TEXT_TRANSLATION}/:appId/:siteTextId/:originalDefinitionRel`,
    children: <NewSiteTextTranslationAddPage />,
  },
  {
    path: `${RouteConst.ADD_NEW_SITE_TEXT_TRANSLATION}/:appId/:siteTextId/:originalDefinitionRel/:translatedDefinitionRel`,
    children: <NewSiteTextTranslationAddPage />,
  },
  {
    path: `${RouteConst.SITE_TEXT_DEFINITION}/:appId/:siteTextId/:originalDefinitionRel`,
    children: <SiteTextDefinitionPage />,
  },
  {
    path: `${RouteConst.SITE_TEXT_TRANSLATION_SWITCH}/:appId/:siteTextId/:originalDefinitionRel/:translatedDefinitionRel`,
    children: <SiteTextTranslationSwitchPage />,
  },
  {
    path: `${RouteConst.SITE_TEXT_LANGUAGE_LIST}`,
    children: <SiteTextLanguageListPage />,
  },
];
