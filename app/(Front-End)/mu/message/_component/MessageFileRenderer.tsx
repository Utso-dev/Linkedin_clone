"use client";

import { FileText, Film, ImageIcon } from "lucide-react";
import Image from "next/image";
import SmartVideoPlayer from "./SmartVideoPlayer";
import VoiceMessagePlayer from "./VoiceMessagePlayer";

function MessageFileRenderer({
  msg,
  variant,
  onViewFile,
}: {
  msg: any;
  variant: "sender" | "receiver";
  onViewFile?: (url: string) => void;
}) {
  const fileName = msg?.file_name || "";
  const fileUrl = msg?.file_url || "";
  const category = (msg?.file_category || "").toLowerCase();
  const msgType = (msg?.type || "").toLowerCase();

  const isVoiceOrAudio =
    msgType === "voice" ||
    category === "audio" ||
    /\.(mp3|wav|ogg|m4a|aac|weba)$/i.test(fileName || fileUrl);

  const isImage =
    category === "image" ||
    /\.(png|jpe?g|gif|webp|svg)$/i.test(fileName || fileUrl);

  const isVideo =
    !isVoiceOrAudio &&
    (category === "video" ||
      /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(fileName || fileUrl));

  const isPdf = category === "pdf" || /\.pdf$/i.test(fileName || fileUrl);

  const chipClass =
    variant === "sender"
      ? "flex items-center gap-2 bg-white text-headerColor rounded-lg px-3 py-2 text-xs cursor-pointer"
      : "flex items-center gap-2 bg-white rounded-lg px-3 py-2 text-xs cursor-pointer";

  // Voice / Audio Player
  if (isVoiceOrAudio) {
    return (
      <VoiceMessagePlayer
        audioUrl={fileUrl}
        duration={msg?.duration}
        variant={variant}
      />
    );
  }

  // Image
  if (isImage) {
    return (
      <div className="w-50 h-auto md:w-75 ">
        <Image
          src={fileUrl}
          alt={fileName || "image"}
          width={600}
          height={600}
          loading="lazy"
          onClick={() => onViewFile?.(fileUrl)}
          className="max-h-60 w-full h-full rounded-lg object-cover cursor-pointer"
        />
      </div>
    );
  }

  // Video
  if (isVideo) {
    return <SmartVideoPlayer src={fileUrl} onViewFile={onViewFile} />;
  }

  // Fallback / Other Files
  return (
    <div className={chipClass} onClick={() => onViewFile?.(fileUrl)}>
      {isPdf ? (
        <FileText className="w-4 h-4 text-red-500" />
      ) : (
        <ImageIcon className="w-4 h-4 text-blue-500" />
      )}
      <span className="truncate max-w-40 font-medium">
        {fileName || (isPdf ? "PDF Document" : "File")}
      </span>
      {isPdf && <Film className="w-3.5 h-3.5 opacity-60 ml-auto" />}
    </div>
  );
}

export default MessageFileRenderer;
