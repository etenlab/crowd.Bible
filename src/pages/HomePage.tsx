import { PageLayout } from '@/components/Layout';

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
  DiPlay,
} from '@eten-lab/ui-kit';

import { RouteConst } from '@/constants/route.constant';

import { CardGroup, CardItemProps } from '@/components/CardGroup';

import { useTr } from '@/hooks/useTr';

const { Stack } = MuiMaterial;

export function HomePage() {
  const { tr } = useTr();

  const cardGroups = [
    {
      group: tr('Media'),
      linkItems: [
        {
          to: RouteConst.MAP_LIST,
          title: tr('Map'),
          description: tr(
            'Upload, view, translate, link, and tag .svg map files.',
          ),
          startIcon: <DiMap color="blue-primary" />,
        },
      ],
    },
    {
      group: tr('Document'),
      linkItems: [
        {
          to: RouteConst.DOCUMENTS_LIST,
          title: tr('Documents'),
          description: tr(
            'Upload a document to use in other crowd sourcing tools',
          ),
          startIcon: <DiFileText color="blue-primary" />,
          onlineOnly: true,
          betaOnly: true,
          implemented: true,
        },
        {
          to: RouteConst.QA_MENU_PAGE,
          title: tr('Question & Answer'),
          description: tr(
            'Annotate a text with questions so other users can provide answers',
          ),
          startIcon: <DiAskQuestion color="blue-primary" />,
          onlineOnly: true,
          betaOnly: true,
          implemented: true,
        },
        // { to: '/feedback', label: 'Feedback', betaOnly: true, implemented: true },
        {
          to: RouteConst.TRANSLATION_DOCUMENTS_LIST,
          title: tr('Translation'),
          description: tr(
            'Translate a document by submitting and voting on translations',
          ),
          startIcon: <DiTranslate color="blue-primary" />,
          label: '',
          betaOnly: true,
          implemented: true,
        },
        {
          to: RouteConst.COMMENTARY,
          title: tr('Commentary'),
          description: tr('Annotate a document and vote on what you support'),
          startIcon: <DiCross color="red" />,
          betaOnly: true,
          implemented: true,
        },
        {
          to: RouteConst.VERSIFICATION,
          title: tr('Versification'),
          description: tr('Chapter and verse annotations for a Biblical text'),
          startIcon: <DiHome color="blue-primary" />,
          betaOnly: true,
          onlineOnly: true,
        },
        {
          to: RouteConst.ALIGNMENT,
          title: tr('Alignment'),
          description: tr('Create or vote on hyperlinks between documents'),
          startIcon: <DiCross color="red" />,
          betaOnly: true,
        },
      ],
    },
    {
      group: tr('Language'),
      linkItems: [
        {
          to: RouteConst.DICTIONARY,
          title: tr('Dictionary'),
          description: tr('Create and vote on words and their definitions'),
          startIcon: <DiRead color="blue-primary" />,
          betaOnly: true,
        },
        {
          to: RouteConst.PHRASE_BOOK,
          title: tr('Phrase-book'),
          description: tr('Common phrases in your language'),
          startIcon: (
            <Stack>
              <DiRead color="blue-primary" />
              <DiPhrase color="blue-primary" />
            </Stack>
          ),
          betaOnly: true,
        },
        {
          to: RouteConst.BILINGUAL_DICTIONARY,
          title: tr('Bilingual Dictionary'),
          description: tr(
            'Connect the definitions in two different language dictionaries',
          ),
          startIcon: (
            <Stack>
              <DiRead color="blue-primary" />
              <DiTranslate color="blue-primary" />
            </Stack>
          ),
          betaOnly: true,
        },
        {
          to: RouteConst.LEXICON,
          title: tr('Lexicon'),
          description: tr(
            'Create and vote on lexical entries and their attributes',
          ),
          startIcon: <DiCross color="red" />,
          betaOnly: true,
        },
        {
          to: RouteConst.GRAMMAR,
          title: tr('Grammar'),
          description: tr('Language definitions, rules, and statistics'),
          startIcon: <DiCross color="red" />,
          betaOnly: true,
        },
      ],
    },
    {
      group: tr('Data'),
      linkItems: [
        {
          to: RouteConst.GRAPH_VIEWER,
          title: tr('Data Viewer'),
          description: tr(
            'Navigate the graph layer where most data in crowd.Bible data is stored',
          ),
          startIcon: <DiDataViewer color="blue-primary" />,
          adminOnly: true,
        },
        {
          to: RouteConst.SQL_RUNNER,
          title: tr('SQL Runner'),
          description: tr('Run custom queries on any local database table'),
          startIcon: <DiDatabase color="blue-primary" />,
          adminOnly: true,
        },
        {
          to: RouteConst.FILE_IMPORT,
          title: tr('File Import'),
          description: tr(
            'Custom data importing into the crowd.Bible ecosystem',
          ),
          startIcon: <DiImport color="blue-primary" />,
          adminOnly: true,
        },
      ],
    },
    {
      group: tr('Application Development'),
      linkItems: [
        {
          to: RouteConst.SITE_TEXT_MENU_PAGE,
          title: tr('Site Text'),
          description: tr(
            'Create and translate the user interface for crowd.Bible or any other application',
          ),
          startIcon: (
            <Stack>
              <DiSite color="blue-primary" />
              <DiText color="blue-primary" />
            </Stack>
          ),
        },
        {
          to: RouteConst.APPLICATION_LIST,
          title: tr('Application List'),
          description: tr(
            'Lorem ipsum is placeholder commonly used in the graphic, print',
          ),
          startIcon: (
            <Stack>
              <DiSite color="blue-primary" />
              <DiList color="blue-primary" />
            </Stack>
          ),
          implemented: true,
        },
      ],
    },
    {
      group: tr('Playground'),
      linkItems: [
        {
          to: RouteConst.PLAYGROUND,
          title: tr('Playground'),
          description: tr('Drag & Drop playground'),
          startIcon: <DiPlay color="blue-primary" />,
          betaOnly: true,
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
