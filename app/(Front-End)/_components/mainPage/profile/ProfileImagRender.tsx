"use client";
import Image from "next/image";
import { useState } from "react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import PostImageShowDialog from "../post/PostImageShowDialog";

function ProfileImagRender({ mediaItems }: { mediaItems: any[] }) {
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const total = mediaItems?.length || 0;

  const isVideo = (item: any): boolean => {
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];
    const url = item.url || item.file_path || "";
    const type = item.type?.toLowerCase() || "";
    return (
      type === "video" ||
      videoExtensions.some((ext) => url.toLowerCase().includes(ext))
    );
  };

  const openMediaViewer = (index: number) => {
    setActiveMediaIndex(index);
    setIsMediaViewerOpen(true);
  };

  if (!total) return null;

  return (
    <div className="relative w-full">
      <div className="absolute top-2 right-2 z-20 rounded-md bg-black/40 px-2 py-0.5 text-xs text-white">
        {`${activeIndex + 1}/${total}`}
      </div>

      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        slidesPerView={1}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="w-full"
      >
        {mediaItems.map((m, idx) => (
          <SwiperSlide key={m.id || idx}>
            <button
              onClick={() => openMediaViewer(idx)}
              className="w-full h-90 md:h-130 lg:h-90 overflow-hidden rounded-md bg-gray-100"
            >
              {isVideo(m) ? (
                <video
                  src={m.url || m.file_path}
                  className="w-full h-full object-cover"
                  style={{ maxHeight: "520px" }}
                  preload="metadata"
                />
              ) : (
                <Image
                  src={m.url || m.file_path}
                  alt={m.type || `media-${idx}`}
                  width={500}
                  height={500}
                  unoptimized
                  className="w-full h-full object-cover"
                  style={{ maxHeight: "520px" }}
                />
              )}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      <PostImageShowDialog
        open={isMediaViewerOpen}
        setOpen={setIsMediaViewerOpen}
        mediaItems={mediaItems}
        activeMediaIndex={activeMediaIndex}
        setActiveMediaIndex={setActiveMediaIndex}
      />
    </div>
  );
}

export default ProfileImagRender;
