import { IonItem, IonLabel, IonList, IonContent } from '@ionic/react';

export function HomePage() {
  return (
    <IonContent>
      <IonList>
        <IonItem href="/documents-list">
          <IonLabel>/documents</IonLabel>
        </IonItem>
        <IonItem href="/translation">
          <IonLabel>/translation</IonLabel>
        </IonItem>
        <IonItem href="/discussions-list">
          <IonLabel>/discussions-list</IonLabel>
        </IonItem>
        <IonItem href="/file-import">
          <IonLabel>/file-import</IonLabel>
        </IonItem>
        <IonItem href="/graph-viewer">
          <IonLabel>/graph-viewer</IonLabel>
        </IonItem>
        <IonItem href="/dictionary">
          <IonLabel>/dictionary</IonLabel>
        </IonItem>
        <IonItem href="/bilingual-dictionary">
          <IonLabel>/bilingual-dictionary</IonLabel>
        </IonItem>
        <IonItem href="/language-proficiency">
          <IonLabel>/language-proficiency</IonLabel>
        </IonItem>
        <IonItem href="/site-text-admin">
          <IonLabel>/site-text-admin</IonLabel>
        </IonItem>
        <IonItem href="/site-text-translation">
          <IonLabel>/site-text-translation</IonLabel>
        </IonItem>
        <IonItem href="/admin">
          <IonLabel>/admin</IonLabel>
        </IonItem>
        <IonItem href="/key-terms">
          <IonLabel>/key-terms</IonLabel>
        </IonItem>
        <IonItem href="/lexicon">
          <IonLabel>/lexicon</IonLabel>
        </IonItem>
        <IonItem href="/commentary">
          <IonLabel>/commentary</IonLabel>
        </IonItem>
        <IonItem href="/grammar">
          <IonLabel>/grammar</IonLabel>
        </IonItem>
        <IonItem href="/versification">
          <IonLabel>/versification</IonLabel>
        </IonItem>
        <IonItem href="/alignment">
          <IonLabel>/alignment</IonLabel>
        </IonItem>
        <IonItem href="/svg-translation">
          <IonLabel>/svg-translation</IonLabel>
        </IonItem>
      </IonList>
    </IonContent>
  );
}
