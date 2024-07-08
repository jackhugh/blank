import emojiRegex from "emoji-regex";

export const validateMessage = (message: string) => {
  // When sending the message to the backend as a string (instead of an image), the message will
  // be squashed as much as it needs to be in order to fit on the card. The below limits are
  // just an estimate as to how much text there can be and will still look good.
  const maxCharactersPerLine = 18;
  const maxLines = 14;

  // Emoji-regex to filter out all emojis (stays up to date with unicode standard)
  const regex = emojiRegex();
  message = message.replace(regex, "");

  // Remove unrecognized Unicode characters
  message = message.replace(/�/g, "");

  // Max one new line in a row
  message = message.replace(/(\r\n|\r|\n){2,}/g, "$1\n");

  const getTotalLines = (value: string) => {
    const newLineCount = value.match(/\n/g)?.length ?? 0;
    const characterCount = value.replace(/\n/g, "").length;
    const totalLines = characterCount / maxCharactersPerLine + newLineCount;
    return totalLines;
  };
  while (getTotalLines(message) > maxLines) {
    message = message.slice(0, message.length - 1);
  }

  return message;
};
