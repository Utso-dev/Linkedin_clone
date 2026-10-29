"use client";

import SmartEmojiPicker from "@/components/reusable/SmartEmojiPicker";
import { AttatchIcon, SendIcon, VoiceIcon } from "@/public/svgIcons/Icons";
import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { IoClose } from "react-icons/io5";
import { getMessagePreview } from "./MessageBubble";
import { useVoiceRecorder } from "./useVoiceRecorder";

interface MessageInputBarProps {
  isConnected: any;
  sending: boolean;
  isFetchingMore: boolean;
  replyTo: any;
  onTyping: () => void;
  onCancelReply: () => void;
  onSendText: (content: string, file: File | null) => void;
  onSendVoice: (blob: Blob) => void;
}

export default function MessageInputBar({
  isConnected,
  sending,
  replyTo,
  onTyping,
  onCancelReply,
  isFetchingMore,
  onSendText,
  onSendVoice,
}: MessageInputBarProps) {
  const [inputValue, setInputValue] = useState("");
  const [attachments, setAttachments] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const {
    isRecording,
    recordingSeconds,
    recordingBlob,
    toggleRecording,
    sendRecording,
    discardRecording,
    formatRecordingTime,
  } = useVoiceRecorder(onSendVoice);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    onTyping();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAttachments(file);
    e.target.value = "";
  };

  const handleSend = async () => {
    if (recordingBlob) {
      await sendRecording();
      return;
    }

    const content = inputValue.trim();
    if (!content && !attachments) return;

    onSendText(content, attachments);
    setInputValue("");
    setAttachments(null);
  };

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart ?? inputValue.length;
    const end = textarea.selectionEnd ?? inputValue.length;
    setInputValue(inputValue.slice(0, start) + emoji + inputValue.slice(end));

    const cursorPos = start + emoji.length;
    requestAnimationFrame(() => {
      textarea.focus({ preventScroll: true });
      textarea.setSelectionRange(cursorPos, cursorPos);
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  const isConnectedUser = isConnected?.is_connected ;

  return (
    <div className="p-3 border-t flex flex-col mt-auto">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      {replyTo && (
        <div className="flex items-center gap-2 bg-[#F3F4F6] border-l-4 border-primaryColor rounded-r-lg px-3 py-2 text-xs mb-2">
          <div className="min-w-0">
            <span className="block font-medium text-headerColor">
              Replying to {replyTo.is_mine ? "your own message" : "message"}
            </span>
            <span className="block truncate text-descriptionColor">
              {getMessagePreview(replyTo)}
            </span>
          </div>
          <button
            onClick={onCancelReply}
            className="ml-auto text-red-500 cursor-pointer shrink-0"
          >
            <IoClose className="text-base" />
          </button>
        </div>
      )}

      {attachments  && (
        <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-lg px-3 py-2 text-xs max-w-45 mb-2">
          <AttatchIcon className="w-4 h-4 shrink-0" />
          <span className="truncate">{attachments.name}</span>
          <button
            onClick={() => setAttachments(null)}
            className="text-red-500 cursor-pointer"
          >
            <IoClose className="text-sm" />
          </button>
        </div>
      )}

      {isConnectedUser || isFetchingMore ? (
        <div className="flex items-start gap-1 md:gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer p-1"
          >
            <AttatchIcon className="w-4.5 h-4.5" />
          </button>

          {recordingBlob ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={discardRecording}
                className="p-1 text-red-500 hover:bg-red-50 rounded-full cursor-pointer"
              >
                <IoClose className="text-base" />
              </button>
              <span className="px-2 py-1 bg-[#F3F4F6] rounded-lg text-xs tabular-nums text-headerColor">
                {formatRecordingTime(recordingSeconds)}
              </span>
            </div>
          ) : (
            <button
              onClick={toggleRecording}
              className={`p-1 flex items-center gap-1.5 rounded-md transition-colors ${
                isRecording
                  ? "bg-red-50 text-red-500 px-2"
                  : "text-descriptionColor"
              }`}
            >
              {isRecording ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                  <span className="text-xs font-medium tabular-nums">
                    {formatRecordingTime(recordingSeconds)}
                  </span>
                </>
              ) : (
                <VoiceIcon className="w-4.5 h-4.5" />
              )}
            </button>
          )}

          <SmartEmojiPicker
            onEmojiSelect={handleEmojiSelect}
            iconClassName="w-5 h-5 text-descriptionColor cursor-pointer hover:opacity-80"
            height={250}
          />

          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Write message here..."
            className="w-full resize-none bg-transparent text-[16px] leading-6 text-headerColor placeholder:text-grayColor1 focus:outline-none transition-all"
          />

          <button
            onClick={handleSend}
            disabled={sending}
            className="bg-primaryColor text-white px-3 py-3 rounded-sm cursor-pointer disabled:opacity-50"
          >
            <SendIcon />
          </button>
        </div>
      ) : (
        <div className="text-center text-sm text-gray-500 py-3">
          You can only send messages to connected users. Please connect with
          this user to start a conversation.
        </div>
      )}
    </div>
  );
}
