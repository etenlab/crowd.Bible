import { useHistory } from 'react-router-dom';
import { PageLayout } from '@/components/Layout';

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
      title: 'Editors',
      description: 'Annotate a document with questions for readers',
      startIcon: <DiAskQuestion color="blue-primary" />,
      onlineOnly: true,
      implemented: true,
    },
    {
      to: RouteConst.READER_QA,
      title: 'Readers',
      description: 'Read a document and answer questions',
      startIcon: <DiAskQuestion color="blue-primary" />,
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
    <PageLayout>
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
    </PageLayout>
  );
}
