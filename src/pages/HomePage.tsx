import {
  IonLabel,
  IonList,
  IonContent,
  IonItemGroup,
  IonItemDivider,
} from '@ionic/react';

import { LinkItem, LinkItemProps } from '@/components/LinkItem';

const linkGroups = [
  {
    group: 'Document Tools',
    linkItems: [
      { to: '/documents-list', label: 'Documents viewer', onlineOnly: true },
      {
        to: '/translator-qa',
        label: 'Question & Answer editor for translators',
        onlineOnly: true,
      },
      {
        to: '/reader-qa',
        label: 'Question & Answer editor for readers',
        onlineOnly: true,
      },
      { to: '/feedback', label: 'Feedback' },
      { to: '/translation', label: 'Translation editor' },
      { to: '/commentary', label: 'Commentary viewer' },
      { to: '/versification', label: 'Versification editor', onlineOnly: true },
      { to: '/alignment', label: 'Alignment editor' },
    ],
  },
  {
    group: 'Language Tools',
    linkItems: [
      { to: '/dictionary', label: 'Dictionary editor' },
      { to: '/bilingual-dictionary', label: 'Bilingual dictionary toer' },
      { to: '/phrase-book', label: 'Phrase-book editor' },
      { to: '/lexicon', label: 'Lexicon editor' },
      { to: '/grammar', label: 'Grammar editor' },
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
      { to: '/sql-runner', label: 'SQL runner' },
      { to: '/file-import', label: 'File import tool' },
    ],
  },
  {
    group: 'Application Development Tools',
    linkItems: [
      { to: '/site-text-admin', label: 'Site text user interface editor' },
      { to: '/site-text-translation', label: 'Site text translation editor' },
    ],
  },
];

type LinkGroupType = {
  group: string;
  linkItems: LinkItemProps[];
};

function LinkGroup({ group, linkItems }: LinkGroupType) {
  return (
    <IonItemGroup>
      <IonItemDivider>
        <IonLabel>{group}</IonLabel>
      </IonItemDivider>

      {linkItems.map((linkItem) => (
        <LinkItem key={linkItem.to} {...linkItem} />
      ))}
    </IonItemGroup>
  );
}

export function HomePage() {
  return (
    <IonContent>
      <IonList>
        {linkGroups.map(({ group, linkItems }) => (
          <LinkGroup key={group} group={group} linkItems={linkItems} />
        ))}
      </IonList>
    </IonContent>
  );
}
