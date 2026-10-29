"use client";

import RootDialog from "@/components/reusable/RootDialog";
import { PostFeedType } from "@/lib/type";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

type PostImageShowDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  mediaItems: NonNullable<PostFeedType["media"]>;
  activeMediaIndex: number;
  setActiveMediaIndex: (index: number) => void;
};

function PostImageShowDialog({
  open,
  setOpen,
  mediaItems,
  activeMediaIndex,
  setActiveMediaIndex,
}: PostImageShowDialogProps) {
  const isVideo = (item: any): boolean => {
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];
    const url = item.url || item.file_path || "";
    const type = item.type?.toLowerCase() || "";
    return (
      type === "video" ||
      videoExtensions.some((ext) => url.toLowerCase().includes(ext))
    );
  };

  const goToPreviousMedia = () => {
    setActiveMediaIndex(
      activeMediaIndex === 0 ? mediaItems.length - 1 : activeMediaIndex - 1,
    );
  };

  const goToNextMedia = () => {
    setActiveMediaIndex(
      activeMediaIndex === mediaItems.length - 1 ? 0 : activeMediaIndex + 1,
    );
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && mediaItems.length > 1) {
        goToPreviousMedia();
      }

      if (event.key === "ArrowRight" && mediaItems.length > 1) {
        goToNextMedia();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, activeMediaIndex, mediaItems.length]);

  if (!mediaItems.length) {
    return null;
  }

  return (
    <RootDialog
      open={open}
      setOpen={setOpen}
      className="max-w-6xl border-0 image-post p-0"
      ariaLabel="Post image preview"
      ariaDescription="Preview post images with slider controls"
    >
      <div className="relative w-full  bg-black  p-2 sm:p-4">
        {mediaItems.length > 1 && (
          <button
            type="button"
            onClick={goToPreviousMedia}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        <div className="relative w-full overflow-hidden rounded-xl ">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${activeMediaIndex * 100}%)` }}
          >
            {mediaItems.map((item) => (
              <div key={item.id} className="relative min-w-full ">
                <div className="relative h-[70vh] w-full">
                  {isVideo(item) ? (
                    <video
                      src={item.url || item.file_path}
                      controls
                      className="w-full h-full object-contain bg-black/5"
                      preload="metadata"
                    />
                  ) : (
                    <Image
                      src={item.url || "/post_placeholder.png"}
                      alt="Post image preview"
                      width={1000}
                      height={1000}
                      sizes="100vw"
                      className="w-full h-full object-contain bg-black/5"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {mediaItems.length > 1 && (
          <button
            type="button"
            onClick={goToNextMedia}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-black/40 px-3 py-2">
          {mediaItems.map((item, index) => (
            <button
              key={`${item.id}-dot`}
              type="button"
              onClick={() => setActiveMediaIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                activeMediaIndex === index
                  ? "w-6 bg-white"
                  : "w-2.5 bg-white/50"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </RootDialog>
  );
}

export default PostImageShowDialog;
