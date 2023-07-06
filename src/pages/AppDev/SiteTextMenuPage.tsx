import { useHistory } from 'react-router-dom';
import { PageLayout } from '@/components/Layout';

import {
  DiSite,
  DiAdmin,
  DiTranslator,
  CrowdBibleUI,
  MuiMaterial,
} from '@eten-lab/ui-kit';

import { RouteConst } from '@/constants/route.constant';

import { CardGroup } from '@/components/CardGroup';

import { useTr } from '@/hooks/useTr';

const { Stack, Box } = MuiMaterial;
const { TitleWithIcon } = CrowdBibleUI;

export function SiteTextMenuPage() {
  const history = useHistory();
  const { tr } = useTr();

  const cardGroup = {
    group: tr('Application Development Tools'),
    linkItems: [
      {
        to: RouteConst.SITE_TEXT_UI_WORD_LIST,
        title: tr('User Interface'),
        description: tr('User interface words for your application'),
        startIcon: (
          <Stack>
            <DiSite color="blue-primary" />
            <DiAdmin color="blue-primary" />
          </Stack>
        ),
      },
      {
        to: RouteConst.APPLICATION_LIST,
        title: tr('Translation'),
        description: tr(
          'Translate user interface words so applications can be available in many languages',
        ),
        startIcon: (
          <Stack>
            <DiSite color="blue-primary" />
            <DiTranslator color="blue-primary" />
          </Stack>
        ),
        implemented: true,
      },
    ],
  };

  const handleClickBack = () => {
    history.push(RouteConst.HOME);
  };

  return (
    <PageLayout>
      <Box sx={{ padding: '20px', paddingBottom: 0 }}>
        <TitleWithIcon
          label={tr('Site Text')}
          withCloseIcon={false}
          withBackIcon={true}
          onClose={() => {}}
          onBack={handleClickBack}
        />
      </Box>

      <CardGroup group={cardGroup.group} linkItems={cardGroup.linkItems} />
    </PageLayout>
  );
}
