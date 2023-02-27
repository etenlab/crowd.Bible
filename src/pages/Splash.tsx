import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

const SplashPage: React.FC = () => {
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
        Splash
      </IonContent>
    </IonPage>
  );
};

export default SplashPage;
