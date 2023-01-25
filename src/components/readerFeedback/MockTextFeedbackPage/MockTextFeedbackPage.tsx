import { useState } from "react";

import { IonContent, IonText, IonIcon, IonButton } from "@ionic/react";

import { closeOutline } from "ionicons/icons";

import styles from "./MockTextFeedbackPage.module.css";

import {
  ColumnSpaceBetweenStack,
  RowSpaceBetweenStack,
} from "../SpaceBetweenStack";
import { AgreeButton } from "../AgreeButton";
import { SimpleQuill } from "../SimpleQuill";
import { TextSelection } from "../TextSelection";

const TEMP_DOCUMENT =
  "1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 2. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 3. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 4. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 5. From its medieval origins to the digital era, learn everything there is to know about the ubiquitous lorem ipsum passage. 6. Ut enim ad minim veniam, quis nostrud exercitation.1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 2. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 3. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 4. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 5. From its medieval origins to the digital era, learn everything there is to know about the ubiquitous lorem ipsum passage. 6. Ut enim ad minim veniam, quis nostrud exercitation.";

export function MockTextFeedbackPage() {
  const [range, setRange] = useState<{
    start: number | null;
    end: number | null;
  }>({ start: null, end: null });

  const isShownFeedbackInput = range.start !== null && range.end !== null;

  console.log(isShownFeedbackInput);

  return (
    <IonContent className={styles.container}>
      <RowSpaceBetweenStack
        firstComponent={<h3 className={styles.title}>Translation</h3>}
        lastComponent={
          <IonButton
            fill="clear"
            size="small"
            onClick={() => {
              alert("clicked close button!");
            }}
            className={styles.iconButton}
          >
            <IonIcon icon={closeOutline} color="dark" />
          </IonButton>
        }
        className={styles.titleContainer}
      />

      <ColumnSpaceBetweenStack
        firstComponent={
          <TextSelection
            text={TEMP_DOCUMENT}
            range={range}
            onChangeRange={({ start, end }) => setRange({ start, end })}
            className={`${styles.textSelection}`}
          />
        }
        lastComponent={
          isShownFeedbackInput ? (
            <ColumnSpaceBetweenStack
              firstComponent={<AgreeButton />}
              lastComponent={<SimpleQuill />}
              className={styles.fullWidth}
            />
          ) : null
        }
        className={styles.textSelectionContainer}
      />
    </IonContent>
  );
}
