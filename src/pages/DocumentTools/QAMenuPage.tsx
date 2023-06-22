import { useHistory } from 'react-router-dom';
import { PageLayout } from '@/components/Layout';

import { DiAskQuestion, CrowdBibleUI, MuiMaterial } from '@eten-lab/ui-kit';

import { useTr } from '@/hooks/useTr';

import { RouteConst } from '@/constants/route.constant';

import { CardGroup } from '@/components/CardGroup';

const { TitleWithIcon } = CrowdBibleUI;
const { Stack } = MuiMaterial;

export function QAMenuPage() {
  const history = useHistory();
  const { tr } = useTr();

  const cardGroup = {
    group: tr('Document Tools'),
    linkItems: [
      {
        to: RouteConst.TRANSLATOR_QA,
        title: tr('Editors'),
        description: tr('Annotate a document with questions for readers'),
        startIcon: <DiAskQuestion color="blue-primary" />,
        onlineOnly: true,
        implemented: true,
      },
      {
        to: RouteConst.READER_QA,
        title: tr('Readers'),
        description: tr('Read a document and answer questions'),
        startIcon: <DiAskQuestion color="blue-primary" />,
        onlineOnly: true,
        implemented: true,
      },
    ],
  };

  const handleClickBack = () => {
    history.push(RouteConst.HOME);
  };

  return (
    <PageLayout>
      <Stack sx={{ padding: '20px 20px 0 20px' }}>
        <TitleWithIcon
          label={tr('Question & Answer')}
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
