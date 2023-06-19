import { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { CrowdBibleUI, Typography, MuiMaterial } from '@eten-lab/ui-kit';

import { PageLayout } from '@/components/PageLayout';

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
  } = useAppContext();
  const { loadSiteTextMap } = useSiteText();

  const [searchStr, setSearchStr] = useState<string>('');

  // Fetch Mock App Info from db
  useEffect(() => {
    if (singletons) {
      loadSiteTextMap();
    }
  }, [loadSiteTextMap, singletons]);

  const handleChangeSearchStr = (str: string) => {
    setSearchStr(str);
  };

  const handleClickBackBtn = () => {
    history.push(`${RouteConst.SITE_TEXT_MENU_PAGE}`);
  };

  const handleClickItem = (_siteTextId: string) => {};

  console.log('siteTextMap ===>', siteTextMap);

  // const items: ButtonListItemType[] = useMemo(() => {
  //   const keys = Object.keys(siteTextMap);
  //   return keys.map((key) => {
  //     // const notranslatedBadgeCom = !siteTextMap[key].isTranslated ? (
  //     //   <Chip
  //     //     component="span"
  //     //     label="Not translated"
  //     //     variant="outlined"
  //     //     color="error"
  //     //     size="small"
  //     //     sx={{ marginLeft: 2 }}
  //     //   />
  //     // ) : null;

  //     // const notranslatedBadgeCom = null;

  //     // const labelCom = (
  //     //   <>
  //     //     {/* <Typography variant="body1" color="text.dark"> */}
  //     //     {key}
  //     //     {/* </Typography> */}

  //     //     {/* {siteTextMap[key].isTranslated
  //     //       ? // <Typography variant="body1" color="text.dark">
  //     //         siteTextMap[key].siteText
  //     //       : // </Typography>
  //     //         notranslatedBadgeCom} */}
  //     //   </>
  //     // );

  //     // const labelCom = key;

  //     return {
  //       value: key,
  //       label: key,
  //     };
  //   });
  // }, [siteTextMap]);

  // console.log('items ===>', items);

  return (
    <PageLayout>
      <HeadBox
        title={'User Interface Word'}
        search={{
          value: searchStr,
          onChange: handleChangeSearchStr,
          placeHolder: 'Input a search word!',
        }}
        back={{
          action: handleClickBackBtn,
        }}
      />
      <Stack gap="16px">
        {/* <ButtonList
          label={'List of site text'}
          withUnderline={true}
          items={[]}
          onClick={handleClickItem}
        /> */}
      </Stack>
    </PageLayout>
  );
}
