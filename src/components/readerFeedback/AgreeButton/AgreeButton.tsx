import { IonButton, IonGrid, IonRow, IonCol, IonIcon } from "@ionic/react";

import { thumbsUpSharp, thumbsDownSharp } from "ionicons/icons";

import styles from "./AgreeButton.module.css";

export function AgreeButton() {
  return (
    <IonGrid className={styles.buttonGrid}>
      <IonRow className={styles.buttonRow}>
        <IonCol className={styles.buttonCol}>
          <IonButton color="success" expand="full" className={styles.button}>
            <IonIcon icon={thumbsUpSharp} />
            <label>Agree</label>
          </IonButton>
        </IonCol>
        <IonCol className={styles.buttonCol}>
          <IonButton color="danger" expand="full" className={styles.button}>
            <IonIcon icon={thumbsDownSharp} />
            <label>Disagree</label>
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
