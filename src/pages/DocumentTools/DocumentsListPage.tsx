import { IonContent } from '@ionic/react';
import { LangugeSelectionBox } from '@/components/LanguageSelectionBox';
import { DocumentList } from '@/components/DocumentList';

export function DocumentsListPage() {
  return (
    <IonContent>
      <LangugeSelectionBox />
      <DocumentList />
    </IonContent>
  );
}
