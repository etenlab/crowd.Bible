import { useState } from "react";

import { IonContent } from "@ionic/react";

import { PageLayout } from "../components/PageLayout";
import { TranslationCandidates } from "../components/TranslationCandidates";

export function TranslationCandidatesPage() {
  return (
    <PageLayout
      content={
        <IonContent fullscreen>
          <TranslationCandidates />
        </IonContent>
      }
    />
  );
}
