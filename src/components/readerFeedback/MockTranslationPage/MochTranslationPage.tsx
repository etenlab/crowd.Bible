import { useRef } from "react";

import {
  IonContent,
  IonText,
  IonIcon,
  IonButton,
  IonModal,
} from "@ionic/react";

import { chatboxOutline } from "ionicons/icons";
import styles from "./MockTranslationPage.module.css";
import { FeedbackTypeSelectBox } from "../FeedbackTypeSelectBox";

export function MockTranslationPage() {
  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  return (
    <IonContent>
      <div style={{ padding: "60px 20px 20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <IonText>
            <h3>Translation</h3>
          </IonText>
          <IonButton fill="clear" id="open-feedback-modal">
            <IonIcon icon={chatboxOutline} size="mid" color="dark" />
          </IonButton>
        </div>
        <IonText>
          <p>
            1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. 2. Ut
            enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
            ut aliquip ex ea commodo consequat. 3. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. 4. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum. 5. From its
            medieval origins to the digital era, learn everything there is to
            know about the ubiquitous lorem ipsum passage. 6. Ut enim ad minim
            veniam, quis nostrud exercitation.
          </p>
        </IonText>
        <IonModal
          ref={modal}
          trigger="open-feedback-modal"
          className={styles.ionModal}
        >
          <IonContent>
            <FeedbackTypeSelectBox onCancel={dismiss} />
          </IonContent>
        </IonModal>
      </div>
    </IonContent>
  );
}
