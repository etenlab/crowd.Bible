import { IonButton, IonIcon } from "@ionic/react";

import { closeOutline } from "ionicons/icons";

import styles from "./FeedbackTypeSelectBox.module.css";

type FeedbackTypeSelectBoxProps = {
  onCancel(): void;
};

export function FeedbackTypeSelectBox({
  onCancel,
}: FeedbackTypeSelectBoxProps) {
  return (
    <div className={styles.container}>
      <div className={styles.titleColContainer}>
        <div className={styles.titleRowContainer}>
          <label className={styles.title}>Leave feedback for</label>
          <IonIcon
            icon={closeOutline}
            className={styles.iconButton}
            onClick={onCancel}
          />
        </div>
        <label className={styles.label}>
          Сhoose what you want to leave feedback for:
        </label>
      </div>
      <IonButton fill="outline" color="dark">
        Part of the Text (word, phrase, paragraph)
      </IonButton>
      <IonButton fill="outline" color="dark">
        Chapter
      </IonButton>
      <IonButton fill="outline" color="dark">
        Verse
      </IonButton>
    </div>
  );
}
