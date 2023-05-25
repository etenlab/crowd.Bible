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
        to: '/translator-qa',
        label: 'Question & Answer editor for translators',
        onlineOnly: true,
        implemented: true,
      },
      {
        to: '/reader-qa',
        label: 'Question & Answer editor for readers',
        onlineOnly: true,
        implemented: true,
      },
      { to: '/feedback', label: 'Feedback', betaOnly: true, implemented: true },
      {
        to: RouteConst.TRANSLATION_DOCUMENTS_LIST,
        label: 'Translation editor',
        betaOnly: true,
        implemented: true,
      },
      {
        to: '/commentary',
        label: 'Commentary viewer',
        betaOnly: true,
        implemented: true,
      },
      {
        to: '/versification',
        label: 'Versification editor',
        betaOnly: true,
        onlineOnly: true,
      },
      { to: '/alignment', label: 'Alignment editor', betaOnly: true },
    ],
  },
  {
    group: 'Language Tools',
    linkItems: [
      { to: '/dictionary', label: 'Dictionary editor' },
      { to: '/bilingual-dictionary', label: 'Bilingual dictionary toer' },
      { to: '/phrase-book', label: 'Phrase-book editor' },
      { to: '/lexicon', label: 'Lexicon editor', betaOnly: true },
      { to: '/grammar', label: 'Grammar editor', betaOnly: true },
    ],
  },
  {
    group: 'Media Tools',
    linkItems: [{ to: '/map-list', label: 'Map translation editor' }],
  },
  {
    group: 'Data Tools',
    linkItems: [
      { to: '/graph-viewer', label: 'Data viewer' },
      { to: '/sql-runner', label: 'SQL runner', adminOnly: true },
      { to: '/file-import', label: 'File import tool', adminOnly: true },
    ],
  },
  {
    group: 'Application Development Tools',
    linkItems: [
      { to: '/site-text-admin', label: 'Site text user interface editor' },
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
