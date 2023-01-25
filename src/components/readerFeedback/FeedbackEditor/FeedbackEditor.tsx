import styles from "./FeedbackEditor.module.css";

import { AgreeButton } from "../AgreeButton";
import { SimpleQuill } from "../SimpleQuill";

// type FeedbackEditorProps = {};

export function FeedbackEditor() {
  return (
    <div className={styles.stackColumn}>
      <AgreeButton />
      <SimpleQuill />
    </div>
  );
}
