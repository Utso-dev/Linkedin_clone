import { truncateText } from "@/lib/utils";
import dayjs from "dayjs";
import type { MouseEvent } from "react";
import MessageFileRenderer from "./MessageFileRenderer";
import MessageReactEmojiAction from "./MessageReactEmojiAction";
import MessageReactions from "./MessageReactions";

interface MessageBubbleProps {
  msg: any;
  highlighted?: boolean;
  otherUserName?: string;
  onReact: (messageId: number, emoji: string) => void;
  onViewFile: (url: string) => void;
  onContextMenu?: (e: MouseEvent<HTMLDivElement>) => void;
  onJumpToReply?: (replyId: any) => void;
  getReplyText?: (replyId: any) => string;
}

export function getMessagePreview(msg: any) {
  if (!msg) return "";
  if (msg.message) return msg.message;
  if (msg.type === "voice") return "Voice message";
  if (msg.file_name) return msg.file_name;
  return "Attachment";
}

const TIME_FORMAT = "hh:mm A";
const HOVER_ACTIONS_CLASS =
  "opacity-100 md:opacity-0 md:group-hover/message:opacity-100 transition-opacity duration-200";

function ReplyReference({
  msg,
  variant,
  otherUserName,
  onJumpToReply,
  getReplyText,
}: {
  msg: any;
  variant: "sender" | "receiver";
  otherUserName?: string;
  onJumpToReply?: (replyId: any) => void;
  getReplyText?: (replyId: any) => string;
}) {
  const reply = msg?.reply_to;
  const replyId = reply?.id ?? msg?.reply_to_id;
  if (!reply && !replyId) return null;

  const text =
    (reply ? getMessagePreview(reply) : "") ||
    getReplyText?.(replyId) ||
    "Original message";
  const authorLabel = reply?.is_mine ? "You" : otherUserName || "Message";

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onJumpToReply?.(reply?.id ?? replyId);
      }}
      className="mb-1.5 flex items-stretch gap-1.5 rounded-md overflow-hidden cursor-pointer"
    >
      <span
        className={`w-0.75 shrink-0 rounded-full ${
          variant === "sender" ? "bg-white" : "bg-primaryColor"
        }`}
      />
      <div className=" bg-bgColor w-full px-2 py-1">
        <h5 className="block text-[11px] font-semibold text-headerColor leading-tight">
          {authorLabel}
        </h5>
        <p className="block text-[11px] line-clamp-1 text-descriptionColor leading-tight">
          {truncateText(text, 41)}
        </p>
      </div>
    </div>
  );
}

function BubbleContent({
  msg,
  variant,
  otherUserName,
  onViewFile,
  onJumpToReply,
  getReplyText,
}: {
  msg: any;
  variant: "sender" | "receiver";
  otherUserName?: string;
  onViewFile: (url: string) => void;
  onJumpToReply?: (replyId: any) => void;
  getReplyText?: (replyId: any) => string;
}) {
  return (
    <div className=" relative">
      <div>
        <ReplyReference
          msg={msg}
          variant={variant}
          otherUserName={otherUserName}
          onJumpToReply={onJumpToReply}
          getReplyText={getReplyText}
        />
      </div>
      {msg?.message}
      {(msg?.type === "file" ||
        msg?.type === "image" ||
        msg?.type === "video" ||
        msg?.type === "voice") &&
        msg?.file_url && (
          <MessageFileRenderer
            msg={msg}
            variant={variant}
            onViewFile={onViewFile}
          />
        )}
      <MessageReactions reactions={msg?.reactions} variant={variant} />
    </div>
  );
}

export default function MessageBubble({
  msg,
  highlighted,
  otherUserName,
  onReact,
  onViewFile,
  onContextMenu,
  onJumpToReply,
  getReplyText,
}: MessageBubbleProps) {
  if (!msg.is_mine) {
    return (
      <div
        id={`message-${msg.id}`}
        onContextMenu={onContextMenu}
        className={`flex group/message items-center gap-2 rounded-lg transition-colors ${
          highlighted ? "bg-amber-50" : ""
        }`}
      >
        <div className="max-w-xs bg-[#F3F4F6] border border-[#F3F4F6]! p-2 rounded-t-xl rounded-r-xl text-sm">
          <BubbleContent
            msg={msg}
            variant="receiver"
            otherUserName={otherUserName}
            onViewFile={onViewFile}
            onJumpToReply={onJumpToReply}
            getReplyText={getReplyText}
          />
          <span className="block text-[11px] text-right text-gray-400 mt-0.5 leading-none">
            {dayjs(msg?.created_at).format(TIME_FORMAT)}
          </span>
        </div>
        <div>
          
          <div className={HOVER_ACTIONS_CLASS}>
            <MessageReactEmojiAction
              onReact={onReact}
              type="receiver"
              id={msg.id}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`message-${msg.id}`}
      onContextMenu={onContextMenu}
      className={`max-w-xs group/message ml-auto rounded-lg transition-colors ${
        highlighted ? "bg-amber-50" : ""
      }`}
    >
      <div className="flex items-center justify-end w-full gap-2">
        <div className="flex flex-col items-end">
         
          <div className={HOVER_ACTIONS_CLASS}>
            <MessageReactEmojiAction
              onReact={onReact}
              type="sender"
              id={msg.id}
            />
          </div>
        </div>

        <div className="border border-primaryColor bg-primaryColor text-whiteColor p-2 rounded-t-xl rounded-l-xl text-sm">
          <BubbleContent
            msg={msg}
            variant="sender"
            otherUserName={otherUserName}
            onViewFile={onViewFile}
            onJumpToReply={onJumpToReply}
            getReplyText={getReplyText}
          />
          <span className="block text-[11px] text-right text-gray-200 mt-0.5 leading-none">
            {dayjs(msg?.created_at).format(TIME_FORMAT)}
          </span>
        </div>
      </div>
    </div>
  );
}
