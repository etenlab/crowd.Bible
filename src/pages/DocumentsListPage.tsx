import { IonContent } from "@ionic/react";

import { PageLayout } from "../components/PageLayout";
import { LangugeSelectionBox } from "../components/LanguageSelectionBox";
import { DocumentList } from "../components/DocumentList";

export function DocumentsListPage() {
  return (
    <PageLayout
      content={
        <IonContent fullscreen>
          <LangugeSelectionBox />
          <DocumentList />
        </IonContent>
      }
    />
  );
}
