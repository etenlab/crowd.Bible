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

          <IonItem href="/documents-list">
            <IonLabel>Documents viewer</IonLabel>
          </IonItem>

          <IonItem href={'/translator-qa'}>
            <IonLabel>Feedback editor for translators</IonLabel>
          </IonItem>

          <IonItem href={'/reader-qa'}>
            <IonLabel>Feedback editor for readers</IonLabel>
          </IonItem>

          <IonItem href="/translation">
            <IonLabel>Translation editor</IonLabel>
          </IonItem>

          <IonItem href="/commentary">
            <IonLabel>Commentary viewer</IonLabel>
          </IonItem>

          <IonItem href="/versification">
            <IonLabel>Versification editor</IonLabel>
          </IonItem>
          <IonItem href="/alignment">
            <IonLabel>Alignment editor</IonLabel>
          </IonItem>
        </IonItemGroup>

        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Language Tools</IonLabel>
          </IonItemDivider>

          <IonItem href="/dictionary">
            <IonLabel>Dictionary editor</IonLabel>
          </IonItem>

          <IonItem href="/bilingual-dictionary">
            <IonLabel>Bilingual dictionary linker</IonLabel>
          </IonItem>

          <IonItem href="/key-terms">
            <IonLabel>Key terms editor</IonLabel>
          </IonItem>

          <IonItem href="/lexicon">
            <IonLabel>Lexicon editor</IonLabel>
          </IonItem>

          <IonItem href="/grammar">
            <IonLabel>Grammar editor</IonLabel>
          </IonItem>
        </IonItemGroup>

        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Media Tools</IonLabel>
          </IonItemDivider>

          <IonItem href="/svg-translation">
            <IonLabel>svg file translation editor</IonLabel>
          </IonItem>
        </IonItemGroup>

        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Data Tools</IonLabel>
          </IonItemDivider>

          <IonItem href="/graph-viewer">
            <IonLabel>Data viewer</IonLabel>
          </IonItem>

          <IonItem href="/file-import">
            <IonLabel>File import tool</IonLabel>
          </IonItem>
        </IonItemGroup>

        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Application Development Tools</IonLabel>
          </IonItemDivider>

          <IonItem href="/site-text-admin">
            <IonLabel>Site text user interface editor</IonLabel>
          </IonItem>

          <IonItem href="/site-text-translation">
            <IonLabel>Site text translation editor</IonLabel>
          </IonItem>
        </IonItemGroup>

        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Other Tools</IonLabel>
          </IonItemDivider>

          <IonItem href="/discussions-list">
            <IonLabel>Discussions list</IonLabel>
          </IonItem>
        </IonItemGroup>
      </IonList>
    </IonContent>
  );
}
