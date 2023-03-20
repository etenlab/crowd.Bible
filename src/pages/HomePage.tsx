import {
  IonItem,
  IonLabel,
  IonList,
  IonContent,
  IonItemGroup,
  IonItemDivider,
} from '@ionic/react';

export function HomePage() {
  return (
    <IonContent>
      <IonList>
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Document Tools</IonLabel>
          </IonItemDivider>

          <IonItem routerLink="/documents-list">
            <IonLabel>Documents viewer</IonLabel>
          </IonItem>

          <IonItem routerLink={'/translator-qa'}>
            <IonLabel>Feedback editor for translators</IonLabel>
          </IonItem>

          <IonItem routerLink={'/reader-qa'}>
            <IonLabel>Feedback editor for readers</IonLabel>
          </IonItem>

          <IonItem routerLink="/translation">
            <IonLabel>Translation editor</IonLabel>
          </IonItem>

          <IonItem routerLink="/commentary">
            <IonLabel>Commentary viewer</IonLabel>
          </IonItem>

          <IonItem routerLink="/versification">
            <IonLabel>Versification editor</IonLabel>
          </IonItem>
          <IonItem routerLink="/alignment">
            <IonLabel>Alignment editor</IonLabel>
          </IonItem>
        </IonItemGroup>

        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Language Tools</IonLabel>
          </IonItemDivider>

          <IonItem routerLink="/dictionary">
            <IonLabel>Dictionary editor</IonLabel>
          </IonItem>

          <IonItem routerLink="/bilingual-dictionary">
            <IonLabel>Bilingual dictionary linker</IonLabel>
          </IonItem>

          <IonItem routerLink="/phrase-book">
            <IonLabel>Phrase-book editor</IonLabel>
          </IonItem>
          <IonItem href="/phrase-book-v2">
            <IonLabel>Phrase-book editor v2</IonLabel>
          </IonItem>

          <IonItem routerLink="/lexicon">
            <IonLabel>Lexicon editor</IonLabel>
          </IonItem>

          <IonItem routerLink="/grammar">
            <IonLabel>Grammar editor</IonLabel>
          </IonItem>
        </IonItemGroup>

        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Media Tools</IonLabel>
          </IonItemDivider>

          <IonItem routerLink="/svg-translation">
            <IonLabel>Map translation editor</IonLabel>
          </IonItem>
        </IonItemGroup>

        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Data Tools</IonLabel>
          </IonItemDivider>

          <IonItem routerLink="/graph-viewer">
            <IonLabel>Data viewer</IonLabel>
          </IonItem>

          <IonItem routerLink="/file-import">
            <IonLabel>File import tool</IonLabel>
          </IonItem>
        </IonItemGroup>

        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Application Development Tools</IonLabel>
          </IonItemDivider>

          <IonItem routerLink="/site-text-admin">
            <IonLabel>Site text user interface editor</IonLabel>
          </IonItem>

          <IonItem routerLink="/site-text-translation">
            <IonLabel>Site text translation editor</IonLabel>
          </IonItem>
        </IonItemGroup>
      </IonList>
    </IonContent>
  );
}
