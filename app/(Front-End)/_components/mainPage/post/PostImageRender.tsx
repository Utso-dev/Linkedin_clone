"use client";
import { PostFeedType } from "@/lib/type";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import PostImageShowDialog from "./PostImageShowDialog";

type PostMediaItem = NonNullable<PostFeedType["media"]>[number];

interface PostImageRenderProps {
  mediaItems: PostMediaItem[];
}

// Optimized Inline Video Component with auto-pause on scroll-out
function FeedVideoPlayer({
  src,
  isSingle = false,
}: {
  src: string;
  isSingle?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-pause video when it completely scrolls out of the viewport
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && !video.paused) {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      onClick={(e) => {
        // Prevent click from bubbling up to any modal triggers
        e.stopPropagation();
      }}
      className={`relative w-full overflow-hidden bg-black flex items-center justify-center ${
        isSingle ? "min-h-auto max-h-125 h-auto" : "h-full min-h-35"
      }`}
    >
      <video
        ref={videoRef}
        src={src}
        controls
        playsInline
        preload="metadata"
        className={`w-full ${
          isSingle ? "max-h-125 object-contain" : "h-full object-cover"
        }`}
      />
    </div>
  );
}

function PostImageRender({ mediaItems = [] }: PostImageRenderProps) {
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Global listener: ensure only 1 video plays at a time across the page
  useEffect(() => {
    const handleGlobalPlay = (e: Event) => {
      const currentVideo = e.target as HTMLVideoElement;
      if (!currentVideo || currentVideo.tagName !== "VIDEO") return;

      const allVideos = document.querySelectorAll("video");
      allVideos.forEach((video) => {
        if (video !== currentVideo && !video.paused) {
          video.pause();
        }
      });
    };

    document.addEventListener("play", handleGlobalPlay, true);
    return () => {
      document.removeEventListener("play", handleGlobalPlay, true);
    };
  }, []);

  const isVideo = (item: PostMediaItem): boolean => {
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

  const renderImage = (item: PostMediaItem, isSingle: boolean = false) => {
    const mediaUrl = item.url || item.file_path || "/post_placeholder.png";

    return (
      <div
        className={`relative w-full overflow-hidden bg-[#eff1f4] flex items-center justify-center ${
          isSingle ? "min-h-auto max-h-150 h-auto" : "h-full min-h-35"
        }`}
      >
        <Image
          src={mediaUrl}
          alt="Post media"
          width={1200}
          height={800}
          unoptimized
          sizes="(max-width: 768px) 100vw, 600px"
          className={`w-full ${
            isSingle
              ? "max-h-150 object-cover bg-black/5"
              : "h-full object-cover"
          }`}
        />
      </div>
    );
  };

  const renderMediaTile = (
    item: PostMediaItem,
    index: number,
    totalCount: number,
    className = ""
  ) => {
    const hiddenCount = totalCount - 4;
    const showOverlay = index === 3 && hiddenCount > 0;
    const isVid = isVideo(item);
    const mediaUrl = item.url || item.file_path || "";

    // If overlay with "+N more" is shown, clicking it opens the viewer
    if (showOverlay) {
      return (
        <button
          key={item.id ?? `${item.url}-${index}`}
          type="button"
          onClick={() => openMediaViewer(index)}
          className={`relative cursor-pointer overflow-hidden flex-1 w-full ${className}`}
        >
          {isVid ? (
            <FeedVideoPlayer src={mediaUrl} isSingle={false} />
          ) : (
            renderImage(item, false)
          )}

          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-lg font-semibold text-white">
            +{hiddenCount} more
          </div>
        </button>
      );
    }

    // Single video tile: play inline, no dialog popup
    if (isVid) {
      return (
        <div
          key={item.id ?? `${item.url}-${index}`}
          className={`relative overflow-hidden flex-1 w-full bg-black ${className}`}
        >
          <FeedVideoPlayer src={mediaUrl} isSingle={false} />
        </div>
      );
    }

    // Image tile: clicking opens dialog viewer
    return (
      <button
        key={item.id ?? `${item.url}-${index}`}
        type="button"
        onClick={() => openMediaViewer(index)}
        className={`relative cursor-pointer overflow-hidden flex-1 w-full ${className}`}
      >
        {renderImage(item, false)}
      </button>
    );
  };

  if (!mediaItems || mediaItems.length === 0) return null;

  return (
    <div className="w-full">
      <div
        className={`mt-3 overflow-hidden border border-gray-100 ${
          mediaItems.length === 1 ? "rounded-lg" : "rounded-xl"
        }`}
      >
        {/* 1 Media (Single Image / Video) */}
        {mediaItems.length === 1 ? (
          isVideo(mediaItems[0]) ? (
            <div className="relative w-full overflow-hidden block bg-black rounded-lg">
              <FeedVideoPlayer
                src={mediaItems[0].url || mediaItems[0].file_path || ""}
                isSingle={true}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openMediaViewer(0)}
              className="relative w-full overflow-hidden block bg-black/5 cursor-pointer rounded-lg"
            >
              {renderImage(mediaItems[0], true)}
            </button>
          )
        ) : /* 2 Media Items */
        mediaItems.length === 2 ? (
          <div className="grid grid-cols-2 gap-1 bg-white p-0.5 h-80">
            {mediaItems.slice(0, 2).map((item, index) =>
              isVideo(item) ? (
                <div
                  key={item.id ?? index}
                  className="relative h-full w-full overflow-hidden rounded-md bg-black"
                >
                  <FeedVideoPlayer
                    src={item.url || item.file_path || ""}
                    isSingle={false}
                  />
                </div>
              ) : (
                <button
                  key={item.id ?? index}
                  type="button"
                  onClick={() => openMediaViewer(index)}
                  className="relative h-full w-full overflow-hidden rounded-md bg-[#eff1f4] cursor-pointer"
                >
                  {renderImage(item, false)}
                </button>
              )
            )}
          </div>
        ) : (
          /* 3 or More Media Items */
          <div className="grid grid-cols-[1.3fr_0.7fr] gap-1 bg-white p-0.5 h-90">
            {isVideo(mediaItems[0]) ? (
              <div className="relative h-full w-full overflow-hidden rounded-md bg-black">
                <FeedVideoPlayer
                  src={mediaItems[0].url || mediaItems[0].file_path || ""}
                  isSingle={false}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openMediaViewer(0)}
                className="relative h-full w-full overflow-hidden rounded-md bg-[#eff1f4] cursor-pointer"
              >
                {renderImage(mediaItems[0], false)}
              </button>
            )}

            <div className="flex h-full flex-col gap-1">
              {mediaItems
                .slice(1, 4)
                .map((item, index) =>
                  renderMediaTile(
                    item,
                    index + 1,
                    mediaItems.length,
                    "rounded-md"
                  )
                )}
            </div>
          </div>
        )}
      </div>

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

export default PostImageRender;