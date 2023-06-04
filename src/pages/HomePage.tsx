import { IonContent } from '@ionic/react';

import {
  MuiMaterial,
  DiFileText,
  DiAskQuestion,
  DiTranslate,
  DiCross,
  DiHome,
  DiRead,
  DiPhrase,
  DiMap,
  DiDataViewer,
  DiDatabase,
  DiImport,
  DiSite,
  DiText,
  DiList,
} from '@eten-lab/ui-kit';

import { RouteConst } from '@/constants/route.constant';

import { CardGroup, CardItemProps } from '@/components/CardGroup';

const { Typography, Stack } = MuiMaterial;

const cardGroups = [
  {
    group: 'Document Tools',
    linkItems: [
      {
        to: RouteConst.DOCUMENTS_LIST,
        title: 'Documents',
        description: 'Upload a document to use in other crowd sourcing tools',
        startIcon: <DiFileText color="blue" />,
        onlineOnly: true,
        betaOnly: true,
        implemented: true,
      },
      {
        to: RouteConst.QA_MENU_PAGE,
        title: 'Question & Answer',
        description:
          'Annotate a text with questions so other users can provide answers',
        startIcon: <DiAskQuestion color="blue" />,
        onlineOnly: true,
        implemented: true,
      },
      // { to: '/feedback', label: 'Feedback', betaOnly: true, implemented: true },
      {
        to: RouteConst.TRANSLATION_DOCUMENTS_LIST,
        title: 'Translation',
        description:
          'Translate a document by submitting and voting on translations',
        startIcon: <DiTranslate color="blue" />,
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
        startIcon: <DiHome color="blue" />,
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
    group: 'Language Tools',
    linkItems: [
      {
        to: RouteConst.DICTIONARY,
        title: 'Dictionary',
        description: 'Create and vote on words and their definitions',
        startIcon: <DiRead color="blue" />,
      },
      {
        to: RouteConst.PHRASE_BOOK,
        title: 'Phrase-book',
        description:
          'Lorem ipsum is placeholder commonly used in the graphic, print',
        startIcon: (
          <Stack>
            <DiRead color="blue" />
            <DiPhrase color="blue" />
          </Stack>
        ),
      },
      {
        to: RouteConst.BILINGUAL_DICTIONARY,
        title: 'Bilingual Dictionary',
        description:
          'Lorem ipsum is placeholder commonly used in the graphic, print',
        startIcon: (
          <Stack>
            <DiRead color="blue" />
            <DiTranslate color="blue" />
          </Stack>
        ),
      },
      {
        to: RouteConst.LEXICON,
        title: 'Lexicon',
        description: 'Create and vote on lexical entries and their attributes',
        startIcon: <DiCross color="red" />,
        betaOnly: true,
      },
      {
        to: RouteConst.GRAMMAR,
        title: 'Grammar',
        description: 'Language definitions, rules, and statistics',
        startIcon: <DiCross color="red" />,
        betaOnly: true,
      },
    ],
  },
  {
    group: 'Media Tools',
    linkItems: [
      {
        to: RouteConst.MAP_LIST,
        title: 'Map',
        description: 'Upload, view, translate, link, and tag .svg map files.',
        startIcon: <DiMap color="blue" />,
      },
    ],
  },
  {
    group: 'Data Tools',
    linkItems: [
      {
        to: RouteConst.GRAPH_VIEWER,
        title: 'Data Viewer',
        description:
          'Navigate the graph layer where most data in crowd.Bible data is stored ',
        startIcon: <DiDataViewer color="blue" />,
      },
      {
        to: RouteConst.SQL_RUNNER,
        title: 'SQL Runner',
        description: 'Run custom queries on any local database table',
        startIcon: <DiDatabase color="blue" />,
        adminOnly: true,
      },
      {
        to: RouteConst.FILE_IMPORT,
        title: 'File Import',
        description: 'Custom data importing into the crowd.Bible ecosystem',
        startIcon: <DiImport color="blue" />,
        adminOnly: true,
      },
    ],
  },
  {
    group: 'Application Development Tools',
    linkItems: [
      {
        to: RouteConst.SITE_TEXT_MENU_PAGE,
        title: 'Site Text',
        description:
          'Create and translate the user interface for crowd.Bible or any other application',
        startIcon: (
          <Stack>
            <DiSite color="blue" />
            <DiText color="blue" />
          </Stack>
        ),
      },
      {
        to: RouteConst.APPLICATION_LIST,
        title: 'Application List',
        description:
          'Lorem ipsum is placeholder commonly used in the graphic, print',
        startIcon: (
          <Stack>
            <DiSite color="blue" />
            <DiList color="blue" />
          </Stack>
        ),
        implemented: true,
      },
    ],
  },
];

export function HomePage() {
  return (
    <IonContent>
      <Typography variant="h2" color="text.dark" sx={{ padding: '20px' }}>
        Home Screen
      </Typography>
      {cardGroups.map(({ group, linkItems }) => (
        <CardGroup
          key={group}
          group={group}
          linkItems={linkItems as CardItemProps[]}
        />
      ))}
    </IonContent>
  );
}
