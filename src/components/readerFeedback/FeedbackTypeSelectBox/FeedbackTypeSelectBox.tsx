import { IonButton, IonIcon } from "@ionic/react";

import { closeOutline } from 'ionicons/icons';

import styles from "./FeedbackTypeSelectBox.module.css";

// type FeedbackTypeSelectBoxProps = {};

export function FeedbackTypeSelectBox() {
  return <div className={styles.container}>
    <div className={styles.titleContainer}>
      <label className={styles.title}>Leave feedback for</label>
      <IonButton fill="clear" color="dark" className={styles.iconButton}><IonIcon icon={closeOutline} /></IonButton>
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
  </div>;
}
