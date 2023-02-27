import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

const DiscussionPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>crowd.Bible</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">crowd.Bible</IonTitle>
          </IonToolbar>
        </IonHeader>
        Discussion Page
      </IonContent>
    </IonPage>
  );
};

export default DiscussionPage;
