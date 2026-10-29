"use client";

import { Play, Pause, Maximize2 } from "lucide-react";
import { useRef, useState } from "react";

interface SmartVideoPlayerProps {
  src: string;
  poster?: string;
  onViewFile?: (url: string) => void;
}

export default function SmartVideoPlayer({
  src,
  poster,
  onViewFile,
}: SmartVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState("0:00");
  const [currentTime, setCurrentTime] = useState("0:00");
  const [progress, setProgress] = useState(0);

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return "0:00";
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Video play error:", err));
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(formatTime(video.currentTime));
    if (video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(formatTime(video.duration));
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime("0:00");
  };

  return (
    <div
      onClick={togglePlay}
      className="group relative w-64 md:w-72 max-w-full aspect-video rounded-xl overflow-hidden bg-black shadow-md cursor-pointer select-none"
    >
      {/* HTML5 Native Lightweight Video */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="metadata"
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        className="w-full h-full object-cover"
      />

      {/* Center Play / Pause Floating Button */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black/25 transition-opacity duration-200 ${
          isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
        }`}
      >
        <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 active:scale-95">
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </div>
      </div>

      {/* Top Floating Badge (Duration / Fullscreen) */}
      <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {onViewFile && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewFile(src);
            }}
            title="Open Fullscreen"
            className="p-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/80 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Bottom Minimal Progress Bar & Time */}
      <div className="absolute bottom-0 inset-x-0 bg-leaner-to-t from-black/80 via-black/40 to-transparent p-2 pt-4 flex flex-col gap-1">
        <div className="flex items-center justify-between text-[10px] font-medium text-white/90 px-0.5">
          <span>{isPlaying ? currentTime : duration}</span>
          <span className="text-white/60">MP4</span>
        </div>

        {/* Custom Slim Progress Track */}
        <div className="h-1 w-full bg-white/30 rounded-full overflow-hidden">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-primaryColor transition-all duration-100"
          />
        </div>
      </div>
    </div>
  );
}