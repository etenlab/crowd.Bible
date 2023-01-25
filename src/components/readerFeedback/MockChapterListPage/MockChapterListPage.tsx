import {
  IonContent,
  IonIcon,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";

import { closeOutline } from "ionicons/icons";

import { clsx } from "clsx";
import styles from "./MockChapterListPage.module.css";

export interface IonRadioGroupCustomEvent<T> extends CustomEvent<T> {
  detail: T;
  target: HTMLIonRadioGroupElement;
}

export interface RadioGroupChangeEventDetail<T = any> {
  value: T;
}

export function MockChapterListPage() {
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

        <IonList className={styles.chapterList}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(
            (chapter) => (
              <IonItem
                key={chapter}
                href="/home/translation/feedback/verse/chapter-list/1"
                lines="full"
              >
                <IonLabel>{`Chapter ${chapter}: Name of the Chapter`}</IonLabel>
              </IonItem>
            )
          )}
        </IonList>
      </div>
    </IonContent>
  );
}
