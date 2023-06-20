import { useState, useEffect, useMemo, useRef } from 'react';
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
  const updated = useRef<boolean>(false);

  // Fetch Mock App Info from db
  useEffect(() => {
    if (singletons && crowdBibleApp && updated.current === false) {
      // loadSiteTextMap();
      // updated.current = true;
      console.log('loadSiteTextMap calling');
    }
  }, [loadSiteTextMap, singletons, crowdBibleApp]);

  const handleChangeSearchStr = (str: string) => {
    setSearchStr(str);
  };

  const handleClickBackBtn = () => {
    history.push(`${RouteConst.SITE_TEXT_MENU_PAGE}`);
  };

  const handleClickItem = (_siteTextId: string) => {};

  console.log(siteTextMap);

  const items: ButtonListItemType[] = useMemo(() => {
    const keys = Object.keys(siteTextMap);

    console.log(keys);
    return keys.map((key) => {
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
    });
  }, [tr, siteTextMap]);

  console.log(items, crowdBibleApp, singletons);

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
