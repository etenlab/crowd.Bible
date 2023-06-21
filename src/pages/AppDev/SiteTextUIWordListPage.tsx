import { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { CrowdBibleUI, MuiMaterial } from '@eten-lab/ui-kit';

import { PageLayout } from '@/components/Layout';

import { RouteConst } from '@/constants/route.constant';

import { useAppContext } from '@/hooks/useAppContext';
import { useSiteText } from '@/hooks/useSiteText';

const { HeadBox, ButtonList } = CrowdBibleUI;
const { Stack, Chip } = MuiMaterial;

type ButtonListItemType = CrowdBibleUI.ButtonListItemType;

export function SiteTextUIWordListPage() {
  const history = useHistory();
  const {
    states: {
      global: { singletons, siteTextMap },
    },
    crowdBibleApp,
  } = useAppContext();
  const { loadSiteTextMap, tr } = useSiteText();

  const [searchStr, setSearchStr] = useState<string>('');

  console.log(singletons, crowdBibleApp);
  // Fetch Mock App Info from db
  useEffect(() => {
    if (singletons && crowdBibleApp) {
      console.log('loadSiteTextMap ===>', singletons, crowdBibleApp);
      loadSiteTextMap();
    }
  }, [loadSiteTextMap, singletons, crowdBibleApp]);

  const handleChangeSearchStr = (str: string) => {
    setSearchStr(str);
  };

  const handleClickBackBtn = () => {
    history.push(`${RouteConst.SITE_TEXT_MENU_PAGE}`);
  };

  const handleClickItem = (_siteTextId: string) => {};

  const items: ButtonListItemType[] = useMemo(() => {
    const keys = Object.keys(siteTextMap);

    return keys
      .map((key) => {
        const notranslatedBadgeCom = !siteTextMap[key].isTranslated ? (
          <Chip
            component="span"
            label={tr('Not translated')}
            variant="outlined"
            color="error"
            size="small"
            sx={{ marginLeft: 2 }}
          />
        ) : null;

        const labelCom = (
          <>
            {siteTextMap[key].siteText}
            {notranslatedBadgeCom}
          </>
        );

        return {
          value: key,
          label: labelCom,
        };
      })
      .sort((a, b) => {
        if (a.value > b.value) {
          return 1;
        } else if (a.value < b.value) {
          return -1;
        } else {
          return 0;
        }
      });
  }, [tr, siteTextMap]);

  return (
    <PageLayout>
      <HeadBox
        title={tr('User Interface Word')}
        search={{
          value: searchStr,
          onChange: handleChangeSearchStr,
          placeHolder: tr('Input a search word!'),
        }}
        back={{
          action: handleClickBackBtn,
        }}
      />
      <Stack gap="16px">
        <ButtonList
          label={tr('List of site text')}
          withUnderline={true}
          items={items}
          onClick={handleClickItem}
        />
      </Stack>
    </PageLayout>
  );
}
