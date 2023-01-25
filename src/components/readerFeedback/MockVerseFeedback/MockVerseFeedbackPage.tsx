import { useState } from "react";

import {
  IonContent,
  IonIcon,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonRadio,
  IonRadioGroup,
} from "@ionic/react";

import { closeOutline } from "ionicons/icons";

import { clsx } from "clsx";
import styles from "./MockVerseFeedbackPage.module.css";

import { FeedbackEditor } from "../FeedbackEditor";

export interface IonRadioGroupCustomEvent<T> extends CustomEvent<T> {
  detail: T;
  target: HTMLIonRadioGroupElement;
}

export interface RadioGroupChangeEventDetail<T = any> {
  value: T;
}

export function MockVerseFeedbackPage() {
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  const handleSelectChapter = (
    event: IonRadioGroupCustomEvent<RadioGroupChangeEventDetail<number>>
  ) => {
    setSelectedChapter(event?.target.value);
  };

  const isShownFeedbackInput = selectedChapter !== null;

  return (
    <IonContent>
      <div className={styles.container}>
        <div className={clsx(styles.stackColumn, styles.padding20)}>
          <div className={styles.stackRow}>
            <h3 className={styles.title}>Translation</h3>
            <IonButton
              fill="clear"
              size="small"
              className={styles.iconButton}
              onClick={() => {
                alert("clicked close button!");
              }}
            >
              <IonIcon icon={closeOutline} color="dark" />
            </IonButton>
          </div>
          <label className={styles.titleLabel}>Select a Chapter</label>
        </div>

        <div className={clsx(styles.stackColumn, styles.adjustedHeight)}>
          <IonList className={styles.chapterList}>
            <IonRadioGroup
              value={selectedChapter}
              onIonChange={handleSelectChapter}
            >
              {[
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              ].map((chapter) => (
                <IonItem key={chapter} lines="full">
                  <IonLabel>{`Ch 1: Verse ${chapter} Name of the Chapter`}</IonLabel>
                  <IonRadio slot="start" value={chapter}></IonRadio>
                </IonItem>
              ))}
            </IonRadioGroup>
          </IonList>
          {isShownFeedbackInput ? <FeedbackEditor /> : null}
        </div>
      </div>
    </IonContent>
  );
}
