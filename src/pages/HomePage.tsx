import { PageLayout } from '@/components/Layout';

import {
  MuiMaterial,
  DiFileText,
  DiAskQuestion,
  DiTranslate,
  DiCross,
  DiHome,
  DiMap,
  DiSite,
  DiText,
} from '@eten-lab/ui-kit';

import { RouteConst } from '@/constants/route.constant';

import { CardGroup, CardItemProps } from '@/components/CardGroup';

const { Stack } = MuiMaterial;

export function HomePage() {
  const cardGroups = [
    {
      group: 'Media',
      linkItems: [
        {
          to: RouteConst.MAP_LIST,
          title: 'Map',
          description: 'Upload, view, translate, link, and tag .svg map files.',

          startIcon: <DiMap color="blue-primary" />,
        },
      ],
    },
    {
      group: 'Document',
      linkItems: [
        {
          to: RouteConst.DOCUMENTS_LIST,
          title: 'Documents',
          description: 'Upload a document to use in other crowd sourcing tools',
          startIcon: <DiFileText color="blue-primary" />,
          onlineOnly: true,
          betaOnly: true,
          implemented: true,
        },
        {
          to: RouteConst.QA_MENU_PAGE,
          title: 'Question & Answer',
          description:
            'Annotate a text with questions so other users can provide answers',
          startIcon: <DiAskQuestion color="blue-primary" />,
          onlineOnly: true,
          betaOnly: true,
          implemented: true,
        },
        // { to: '/feedback', label: 'Feedback', betaOnly: true, implemented: true },
        {
          to: RouteConst.TRANSLATION_DOCUMENTS_LIST,
          title: 'Translation',
          description:
            'Translate a document by submitting and voting on translations',
          startIcon: <DiTranslate color="blue-primary" />,
          label: '',
          betaOnly: true,
          implemented: true,
        },
        {
          to: RouteConst.COMMENTARY,
          title: 'Commentary',
          description: 'Annotate a document and vote on what you support',
          startIcon: <DiCross color="red" />,
          betaOnly: true,
          implemented: true,
        },
        {
          to: RouteConst.VERSIFICATION,
          title: 'Versification',
          description: 'Chapter and verse annotations for a Biblical text',
          startIcon: <DiHome color="blue-primary" />,
          betaOnly: true,
          onlineOnly: true,
        },
        {
          to: RouteConst.ALIGNMENT,
          title: 'Alignment',
          description: 'Create or vote on hyperlinks between documents',
          startIcon: <DiCross color="red" />,
          betaOnly: true,
        },
      ],
    },
    {
      group: 'Application Development',
      linkItems: [
        {
          to: RouteConst.SITE_TEXT_MENU_PAGE,
          title: 'Site Text',
          description:
            'Create and translate the user interface for crowd.Bible or any other application',
          startIcon: (
            <Stack>
              <DiSite color="blue-primary" />
              <DiText color="blue-primary" />
            </Stack>
          ),
        },
      ],
    },
  ];

  return (
    <PageLayout>
      {cardGroups.map(({ group, linkItems }) => (
        <CardGroup
          key={group}
          group={group}
          linkItems={linkItems as CardItemProps[]}
        />
      ))}
      <br />
    </PageLayout>
  );
}
