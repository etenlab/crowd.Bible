import React, { memo } from 'react';

import EmojiPicker, { Theme, EmojiClickData } from 'emoji-picker-react';

type EmojiPickerProps = {
  onEmojiClick(emojiData: EmojiClickData): void;
};

export const CustomEmojiPicker = memo(function CustomEmojiPicker({
  onEmojiClick,
}: EmojiPickerProps) {
  return (
    <EmojiPicker
      onEmojiClick={onEmojiClick}
      autoFocusSearch={true}
      lazyLoadEmojis={true}
      theme={Theme.AUTO}
    />
  );
});
