"use client";

import { EmojiIcon } from "@/public/svgIcons/Icons";
import { EmojiStyle } from "emoji-picker-react";
import dynamic from "next/dynamic";
import { CSSProperties, useState } from "react";
const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
});

function MessageReactEmojiAction({
  setSelectedEmoji,
  onReact,
  id,
  type,
}: {
  setSelectedEmoji?: (data: { emoji: string; id: any }) => void;
  onReact?: (id: number, emoji: string) => void;
  id: number;
  type: "sender" | "receiver";
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [messageId, setMessageId] = useState(null);
  const handleEmojiClick = (emojiData: any) => {
    setSelectedEmoji?.({ emoji: emojiData.emoji, id: id });
    onReact?.(id, emojiData.emoji);
    setShowPicker(false);
  };
  const handleShowPicker = (id) => {
    setMessageId(id);
    setShowPicker((prev) => !prev);
  };

  return (
    <div className=" relative ">
      <button onClick={() => handleShowPicker(id)} className=" cursor-pointer">
        <EmojiIcon className="stroke-bgColor!" />
      </button>
      {showPicker && messageId === id && (
        <div
          className={`rounded-full  z-20 w-full absolute bottom-20px ${type === "receiver" ? "md:-left-2 -left-23" : "md:-left-20 "} shadow-gray-500 shadow-2xl  `}
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            reactionsDefaultOpen
            allowExpandReactions={false}
            emojiStyle={EmojiStyle.FACEBOOK}
            className="h-7.5!"
            style={
              {
                "--epr-emoji-size": "16px",
                "--epr-emoji-padding": "2px",
                "--epr-horizontal-padding": "4px",
                "--epr-bg-color": "transparent",
                "--epr-picker-border-color": " #E5E7EB",
                "--epr-picker-border-radius": "20px",
                "--epr-picker-box-shadow": "none",
              } as CSSProperties
            }
            reactions={["1f60d", "1f603", "2764-fe0f", "1f44d", "1f44f"]}
          />
        </div>
      )}
    </div>
  );
}

export default MessageReactEmojiAction;
