import { useHistory } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import {
  DiSite,
  DiAdmin,
  DiTranslator,
  CrowdBibleUI,
  MuiMaterial,
} from '@eten-lab/ui-kit';

import { RouteConst } from '@/constants/route.constant';

import { CardGroup } from '@/components/CardGroup';

const { Stack } = MuiMaterial;
const { TitleWithIcon } = CrowdBibleUI;

const cardGroup = {
  group: 'Application Development Tools',
  linkItems: [
    {
      to: RouteConst.SITE_TEXT_ADMIN,
      title: 'Site Text User Interface',
      description:
        'Lorem ipsum is placeholder commonly used in the graphic, print',
      startIcon: (
        <Stack>
          <DiSite color="blue" />
          <DiAdmin color="blue" />
        </Stack>
      ),
    },
    {
      to: RouteConst.SITE_TEXT_TRANSLATION_APP_LIST,
      title: 'Site Text Translation',
      description:
        'Lorem ipsum is placeholder commonly used in the graphic, print',
      startIcon: (
        <Stack>
          <DiSite color="blue" />
          <DiTranslator color="blue" />
        </Stack>
      ),
      implemented: true,
    },
  ],
};

export function SiteTextMenuPage() {
  const history = useHistory();

  const handleClickBack = () => {
    history.push(RouteConst.HOME);
  };

  return (
    <IonContent>
      <br />
      <TitleWithIcon
        label="Question & Answer"
        withCloseIcon={false}
        withBackIcon={true}
        onClose={() => {}}
        onBack={handleClickBack}
      />

      <CardGroup group={cardGroup.group} linkItems={cardGroup.linkItems} />
    </IonContent>
  );
}
