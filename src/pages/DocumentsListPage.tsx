import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';

const DocumentsListPage: React.FC = () => {
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
        Documents List
      </IonContent>
    </IonPage>
  );
};

export default DocumentsListPage;
