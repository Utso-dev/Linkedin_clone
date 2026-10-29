"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface VoiceMessagePlayerProps {
  audioUrl: string;
  duration?: number;
  variant?: "sender" | "receiver";
}

export default function VoiceMessagePlayer({
  audioUrl,
  duration = 0,
  variant = "sender",
}: VoiceMessagePlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration || 0);

  // Time Formatter (mm:ss)
  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
        setTotalDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Audio playback error:", err);
        });
    }
  };
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio || !totalDuration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickPos = (e.clientX - rect.left) / rect.width;
    const seekTime = clickPos * totalDuration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const progressPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  const waveBars = [
    30, 60, 45, 90, 75, 40, 85, 100, 60, 45, 70, 95, 80, 50, 65, 85, 40, 60, 90, 70,
    50, 80, 65, 45, 30
  ];

  return (
    <div className="flex items-center gap-3 w-60 md:w-64 max-w-full py-1 select-none">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Play / Pause Toggle Button */}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause voice message" : "Play voice message"}
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-90 cursor-pointer ${
          variant === "sender"
            ? "bg-white text-primaryColor hover:bg-gray-100"
            : "bg-primaryColor text-white hover:opacity-90"
        }`}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </button>

      {/* Waveform Visualization & Time */}
      <div className="flex-1 flex flex-col w-full justify-center min-w-0">
        {/* Wave Bar Container */}
        <div
          onClick={handleSeek}
          className="h-7 flex items-center gap-[2.5px] cursor-pointer relative py-1"
        >
          {waveBars.map((height, idx) => {
            const barPercent = (idx / waveBars.length) * 100;
            const isPlayed = barPercent <= progressPercent;

            return (
              <span
                key={idx}
                style={{ height: `${height}%` }}
                className={`w-75 rounded-full transition-colors duration-150 ${
                  variant === "sender"
                    ? isPlayed
                      ? "bg-white"
                      : "bg-white/40"
                    : isPlayed
                    ? "bg-primaryColor"
                    : "bg-gray-300"
                }`}
              />
            );
          })}
        </div>

        {/* Duration / Current Time */}
        <div
          className={`flex justify-between text-[11px] font-medium mt-0.5 tabular-nums ${
            variant === "sender" ? "text-white/80" : "text-gray-500"
          }`}
        >
          <span>{isPlaying ? formatTime(currentTime) : formatTime(totalDuration)}</span>
        </div>
      </div>
    </div>
  );
}