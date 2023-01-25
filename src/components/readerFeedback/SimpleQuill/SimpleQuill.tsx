import { useState, useRef } from "react";
import { IonTextarea, IonIcon, IonPopover } from "@ionic/react";

import { happyOutline } from "ionicons/icons";

import styles from "./SimpleQuill.module.css";
import { EmojiPicker } from "../EmojiPicker";
import { EmojiClickData } from "emoji-picker-react";

export interface IonTextareaCustomEvent<T> extends CustomEvent<T> {
  detail: T;
  target: HTMLIonTextareaElement;
}

export interface TextareaChangeEventDetail {
  value?: string | null;
}

export function SimpleQuill() {
  const [value, setValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const lastCursorPosRef = useRef<number>(0);

  const openEmoji = () => {
    setIsOpen(true);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setIsOpen(false);
    setValue((value) => {
      return (
        value.slice(0, lastCursorPosRef.current) +
        emojiData.emoji +
        value.slice(lastCursorPosRef.current)
      );
    });
  };

  const handleIonChange = (
    e: IonTextareaCustomEvent<TextareaChangeEventDetail>
  ) => {
    setValue(e.detail.value!);
  };

  const handleIonBlur = async (e: IonTextareaCustomEvent<FocusEvent>) => {
    const element = await e.target.getInputElement();
    lastCursorPosRef.current = element.selectionStart;
  };

  return (
    <div className={styles.container}>
      <IonTextarea
        className={styles.textarea}
        placeholder="Leave Feedback (optional)..."
        value={value}
        autoGrow={true}
        rows={1}
        onIonChange={handleIonChange}
        onIonBlur={handleIonBlur}
      />
      <div className={styles.verticalDivider} />
      <IonIcon
        icon={happyOutline}
        className={styles.happyIcon}
        id="emoji-button"
        onClick={openEmoji}
      />
      <IonPopover
        side="top"
        trigger="emoji-button"
        triggerAction="click"
        alignment="center"
        className={styles.popover}
        isOpen={isOpen}
      >
        <EmojiPicker onEmojiClick={handleEmojiClick} />
      </IonPopover>
    </div>
  );
}
