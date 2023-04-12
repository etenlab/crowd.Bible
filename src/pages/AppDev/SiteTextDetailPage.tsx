import { useHistory } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import { CrowdBibleUI, MuiMaterial, Button } from '@eten-lab/ui-kit';

import { RouteConst } from '@/constants/route.constant';

import { DescriptionList } from '@/components/DescriptionList';

const { HeadBox } = CrowdBibleUI;

const { Typography, Stack } = MuiMaterial;

export function SiteTextDetailPage() {
  const history = useHistory();

  const handleClickBackBtn = () => {
    history.goBack();
  };

  const handleClickEditBtn = () => {
    history.push(RouteConst.SITE_TEXT_EDITOR);
  };

  const handleClickPlusDescriptionBtn = () => {
    history.push(RouteConst.SITE_TEXT_TRANSLATION_EDITOR);
  };

  return (
    <IonContent>
      <HeadBox back={{ action: handleClickBackBtn }} title="Ipsum" />
      <Stack gap="20px" sx={{ padding: '20px' }}>
        <Typography variant="body1" color="text.dark">
          Ipsum is placeholder text commonly used in the graphic, print, and
          publishing industries for previewing layouts.
        </Typography>
        <Stack
          gap="20px"
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button variant="outlined" fullWidth onClick={handleClickEditBtn}>
            Edit
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={handleClickPlusDescriptionBtn}
          >
            + Translation
          </Button>
        </Stack>
      </Stack>
      <DescriptionList />
    </IonContent>
  );
}
