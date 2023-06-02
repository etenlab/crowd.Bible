import { IonContent } from '@ionic/react';

import { MuiMaterial } from '@eten-lab/ui-kit';

import { LinkGroup } from '@/components/LinkGroup';

import { RouteConst } from '@/constants/route.constant';

const { Typography } = MuiMaterial;

const linkGroups = [
  {
    group: 'Document Tools',
    linkItems: [
      {
        to: RouteConst.DOCUMENTS_LIST,
        label: 'Documents viewer',
        onlineOnly: true,
        betaOnly: true,
        implemented: true,
      },
      {
        to: RouteConst.TRANSLATOR_QA,
        label: 'Question & Answer editor for translators',
        onlineOnly: true,
        implemented: true,
      },
      {
        to: RouteConst.READER_QA,
        label: 'Question & Answer editor for readers',
        onlineOnly: true,
        implemented: true,
      },
      {
        to: RouteConst.FEEDBACK,
        label: 'Feedback',
        betaOnly: true,
        implemented: true,
      },
      {
        to: RouteConst.TRANSLATION_DOCUMENTS_LIST,
        label: 'Translation editor',
        betaOnly: true,
        implemented: true,
      },
      {
        to: RouteConst.COMMENTARY,
        label: 'Commentary viewer',
        betaOnly: true,
        implemented: true,
      },
      {
        to: RouteConst.VERSIFICATION,
        label: 'Versification editor',
        betaOnly: true,
        onlineOnly: true,
      },
      { to: RouteConst.ALIGNMENT, label: 'Alignment editor', betaOnly: true },
    ],
  },
  {
    group: 'Language Tools',
    linkItems: [
      { to: RouteConst.DICTIONARY, label: 'Dictionary editor' },
      {
        to: RouteConst.BILINGUAL_DICTIONARY,
        label: 'Bilingual dictionary toer',
      },
      { to: RouteConst.PHRASE_BOOK, label: 'Phrase-book editor' },
      { to: RouteConst.LEXICON, label: 'Lexicon editor', betaOnly: true },
      { to: RouteConst.GRAMMAR, label: 'Grammar editor', betaOnly: true },
    ],
  },
  {
    group: 'Media Tools',
    linkItems: [{ to: RouteConst.MAP_LIST, label: 'Map translation editor' }],
  },
  {
    group: 'Data Tools',
    linkItems: [
      { to: RouteConst.GRAPH_VIEWVER, label: 'Data viewer' },
      { to: RouteConst.SQL_RUNNER, label: 'SQL runner', adminOnly: true },
      {
        to: RouteConst.FILE_IMPORT,
        label: 'File import tool',
        adminOnly: true,
      },
    ],
  },
  {
    group: 'Application Development Tools',
    linkItems: [
      {
        to: RouteConst.SITE_TEXT_ADMIN,
        label: 'Site text user interface editor',
      },
      {
        to: RouteConst.SITE_TEXT_TRANSLATION_APP_LIST,
        label: 'Site text translation editor',
        implemented: true,
      },
      {
        to: RouteConst.APPLICATION_LIST,
        label: 'Application List',
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
      {linkGroups.map(({ group, linkItems }) => (
        <LinkGroup key={group} group={group} linkItems={linkItems} />
      ))}
    </IonContent>
  );
}
