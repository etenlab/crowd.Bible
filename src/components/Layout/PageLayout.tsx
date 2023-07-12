import { IonPage, IonContent } from '@ionic/react';

import { AppHeader } from './AppHeader';

interface PageLayoutProps {
  children?: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <IonPage id="crowd-bible-app">
      <AppHeader kind="page" />

      <IonContent fullscreen className="crowd-bible-ion-content">
        {children}
      </IonContent>
    </IonPage>
  );
}
