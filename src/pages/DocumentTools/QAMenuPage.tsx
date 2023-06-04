import { useHistory } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import { DiAskQuestion, CrowdBibleUI, MuiMaterial } from '@eten-lab/ui-kit';

import { RouteConst } from '@/constants/route.constant';

import { CardGroup } from '@/components/CardGroup';

const { TitleWithIcon } = CrowdBibleUI;
const { Stack } = MuiMaterial;

const cardGroup = {
  group: 'Document Tools',
  linkItems: [
    {
      to: RouteConst.TRANSLATOR_QA,
      title: 'Editor for Translators',
      description:
        'Lorem ipsum is placeholder commonly used in the graphic, print',
      startIcon: <DiAskQuestion color="blue" />,
      onlineOnly: true,
      implemented: true,
    },
    {
      to: RouteConst.READER_QA,
      title: 'Editor for Readers',
      description:
        'Lorem ipsum is placeholder commonly used in the graphic, print',
      startIcon: <DiAskQuestion color="blue" />,
      onlineOnly: true,
      implemented: true,
    },
  ],
};

export function QAMenuPage() {
  const history = useHistory();

  const handleClickBack = () => {
    history.push(RouteConst.HOME);
  };

  return (
    <IonContent>
      <Stack sx={{ padding: '20px 20px 0 20px' }}>
        <TitleWithIcon
          label="Question & Answer"
          withCloseIcon={false}
          withBackIcon={true}
          onClose={() => {}}
          onBack={handleClickBack}
        />
      </Stack>

      <CardGroup group={cardGroup.group} linkItems={cardGroup.linkItems} />
    </IonContent>
  );
}
