import { IonIcon } from "@ionic/react";
import { checkmarkCircleOutline } from "ionicons/icons";

import styles from "./Alert.module.css";

type AlertProps = {
  label: string;
};

export function SuccessAlert({ label }: AlertProps) {
  return (
    <div className={styles.container}>
      <IonIcon icon={checkmarkCircleOutline} className={styles.icon} />
      {label}
    </div>
  );
}
