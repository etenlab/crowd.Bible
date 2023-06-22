import { useCallback, useEffect, useRef } from 'react';

import { useAppContext } from '@/hooks/useAppContext';

import { TempSiteTextItem } from '@/reducers/global.reducer';

export function useTr() {
  const {
    states: {
      global: { singletons, siteTextMap, crowdBibleApp },
    },
    actions: { addTempSiteTextItem },
  } = useAppContext();

  const tempSiteTextsRef = useRef<TempSiteTextItem[]>([]);

  useEffect(() => {
    if (singletons && crowdBibleApp && tempSiteTextsRef.current.length > 0) {
      for (const item of tempSiteTextsRef.current) {
        addTempSiteTextItem({
          appId: item.appId,
          languageInfo: item.languageInfo,
          siteText: item.siteText,
          definition: item.definition,
        });
      }

      tempSiteTextsRef.current = [];
    }
  }, [singletons, crowdBibleApp, siteTextMap, addTempSiteTextItem]);

  const trWithInfo = useCallback(
    (siteText: string) => {
      if (!singletons || !crowdBibleApp) {
        return {
          siteText,
          isTranslated: false,
        };
      }

      if (siteText.trim() === '') {
        return {
          siteText: '',
          isTranslated: false,
        };
      }

      if (siteTextMap[siteText]) {
        return siteTextMap[siteText];
      }

      tempSiteTextsRef.current.push({
        appId: crowdBibleApp.id,
        languageInfo: crowdBibleApp.languageInfo,
        siteText: siteText.trim(),
        definition: '',
      });

      return {
        siteText,
        isTranslated: false,
      };
    },
    [singletons, crowdBibleApp, siteTextMap],
  );

  const tr = useCallback(
    (siteText: string) => {
      if (!singletons || !crowdBibleApp) {
        return siteText;
      }

      if (siteText.trim() === '') {
        return '';
      }

      if (siteTextMap[siteText]) {
        return siteTextMap[siteText].siteText;
      }

      tempSiteTextsRef.current.push({
        appId: crowdBibleApp.id,
        languageInfo: crowdBibleApp.languageInfo,
        siteText: siteText.trim(),
        definition: '',
      });

      return siteText;
    },
    [singletons, crowdBibleApp, siteTextMap],
  );

  return {
    tr,
    trWithInfo,
  };
}
