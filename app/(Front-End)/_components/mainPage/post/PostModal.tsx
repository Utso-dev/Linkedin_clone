"use client";

import SmartEmojiPicker from "@/components/reusable/SmartEmojiPicker";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
} from "@/feature/slice/post/postSlice";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import {
  GlobalIcon,
  ImageUploadIcon,
  MenueArrowDownIcon,
  PlayIcon,
  SendIcon,
} from "@/public/svgIcons/Icons";
import { useDispatch, useSelector } from "react-redux";

import {
  useCreateIndustryPostMutation,
  useUpdateIndustryPostMutation,
} from "@/feature/slice/jobs/industrySlice";
import {
  resetPostComposeState,
  setPostText,
} from "@/feature/slice/postCompose/postComposeSlice";
import { htmlToPlainText, textToHtml } from "@/lib/utils";
import { Loader, MessageSquare, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type PreviewMedia = {
  source: string;
  type: "image" | "video";
  file?: File;
  isObjectUrl?: boolean;
  id?: number;
};

function PostModal({
  setOpen,
  setPostType,
  postData,
}: {
  setOpen: (open: boolean) => void;
  setPostType?: (type: string) => void;
  postData?: any;
}) {
  const {
    postText = "",
    postVisibility = "public",
    commentControl = "anyone",
    selectedGroupIds = [],
  } = useSelector((state: any) => state.postCompose);

  const [previewMedia, setPreviewMedia] = useState<PreviewMedia[]>([]);
  const [removedMediaIds, setRemovedMediaIds] = useState<number[]>([]);
  const { data } = useGetUserProfileQuery("user");
  const mediaInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const selectionRangeRef = useRef<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const pathName = usePathname();
  const idustry = pathName.includes("industry");

  const [createPost, { isLoading, isError }] = idustry
    ? useCreateIndustryPostMutation()
    : useCreatePostMutation();
  const [updatePost, { isLoading: isUpdating, isError: isUpdateError }] =
    idustry ? useUpdateIndustryPostMutation() : useUpdatePostMutation();

  // Populate initial text & media when editing
  useEffect(() => {
    if (postData) {
      const rawText = postData?.description || postData?.content || "";
      if (rawText) {
        dispatch(setPostText(htmlToPlainText(rawText)));
      }
    }

    if (postData?.media) {
      setPreviewMedia(
        postData.media.map(
          (media: { id: number; url: string; type: "image" | "video" }) => ({
            id: media.id,
            source: media.url,
            type: media.type,
          }),
        ),
      );
    }
  }, [postData, dispatch]);

  const previewMediaRef = useRef<PreviewMedia[]>([]);
  useEffect(() => {
    previewMediaRef.current = previewMedia;
  }, [previewMedia]);

  // Clean up object URLs ONLY when component unmounts
  useEffect(() => {
    return () => {
      previewMediaRef.current.forEach((item) => {
        if (item.isObjectUrl) {
          URL.revokeObjectURL(item.source);
        }
      });
    };
  }, []);

  // Track cursor position and selection range in the textarea
  const updateSelection = () => {
    if (textareaRef.current) {
      selectionRangeRef.current = {
        start: textareaRef.current.selectionStart ?? 0,
        end: textareaRef.current.selectionEnd ?? 0,
      };
    }
  };

  // Auto-resize textarea height smoothly
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const nextH = Math.max(120, Math.min(el.scrollHeight, 280));
    el.style.height = `${nextH}px`;
  }, [postText]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setPostText(e.target.value));
    updateSelection();
  };

  // Insert emoji at the exact cursor position
  const handleEmojiSelect = (emoji: string) => {
    const currentText = postText || "";
    const start = selectionRangeRef.current.start ?? currentText.length;
    const end = selectionRangeRef.current.end ?? currentText.length;

    const safeStart = Math.max(0, Math.min(start, currentText.length));
    const safeEnd = Math.max(safeStart, Math.min(end, currentText.length));

    const newText =
      currentText.slice(0, safeStart) + emoji + currentText.slice(safeEnd);
    dispatch(setPostText(newText));

    const nextPos = safeStart + emoji.length;
    selectionRangeRef.current = { start: nextPos, end: nextPos };

    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(nextPos, nextPos);
      }
    });
  };

  const handleMediaButtonClick = () => {
    mediaInputRef.current?.click();
  };

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).filter(
      (file) =>
        file.type.startsWith("image/") || file.type.startsWith("video/"),
    );

    if (files.length === 0) return;

    const nextMedia = files.map((file) => ({
      source: URL.createObjectURL(file),
      type: (file.type.startsWith("video/") ? "video" : "image") as
        | "image"
        | "video",
      file,
      isObjectUrl: true,
    }));

    setPreviewMedia((previous) => [...previous, ...nextMedia]);
    event.target.value = "";
  };

  const handleRemoveMedia = (indexToRemove: number) => {
    setPreviewMedia((previous) => {
      const next = previous.filter((_, index) => index !== indexToRemove);
      const removed = previous[indexToRemove];

      if (removed?.id) {
        setRemovedMediaIds((prev) => {
          if (prev.includes(removed.id!)) return prev;
          return [...prev, removed.id!];
        });
      }

      if (removed?.isObjectUrl) {
        URL.revokeObjectURL(removed.source);
      }
      return next;
    });
  };

  const handleCloseModal = () => {
    dispatch(resetPostComposeState());
    setOpen(false);
  };

  const handleSubmit = async () => {
    const trimmedText = postText.trim();
    if (!trimmedText && previewMedia.length === 0) {
      return;
    }

    const formattedHtml = textToHtml(postText);
    const formData = new FormData();

    if (idustry) {
      formData.append("content", formattedHtml);
    } else {
      formData.append("description", formattedHtml);
    }

    formData.append(
      "visibility",
      postVisibility === "group" ? "groups" : postVisibility,
    );
    formData.append("who_can_comment", commentControl);

    if (selectedGroupIds.length > 0) {
      selectedGroupIds.forEach((groupId: number) => {
        formData.append("group_ids[]", String(groupId));
      });
    }

    previewMedia.forEach((media) => {
      if (media.file) {
        formData.append("media[]", media.file);
      }
    });

    if (postData?.id && removedMediaIds.length > 0) {
      removedMediaIds.forEach((id) => {
        formData.append("remove_media_ids[]", String(id));
      });
    }

    try {
      const response = postData?.id
        ? await updatePost({ id: postData.id, body: formData }).unwrap()
        : await createPost(formData).unwrap();

      toast.success(
        response.message ||
          (postData?.id
            ? "Post updated successfully"
            : "Post created successfully"),
      );
      router.refresh();

      dispatch(resetPostComposeState());
      previewMedia.forEach((item) => {
        if (item.isObjectUrl) {
          URL.revokeObjectURL(item.source);
        }
      });
      dispatch(setPostText(""));
      setPreviewMedia([]);
      setOpen(false);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          (postData?.id ? "Failed to update post" : "Failed to create post"),
      );
    }
  };

  const userDisplayName =
    data?.user?.first_name || data?.user?.last_name
      ? `${data?.user?.first_name || ""} ${data?.user?.last_name || ""}`.trim()
      : "Vin Intini";

  const visibilityLabel =
    postVisibility === "connections"
      ? "Connections only"
      : postVisibility === "group"
        ? "Group"
        : "Post to Anyone";

  const commentLabel =
    commentControl === "connections"
      ? "Comments: Connections"
      : commentControl === "no_one"
        ? "Comments: No one"
        : "Comments: Anyone";

  return (
    <section className="relative flex max-h-[85vh] flex-col overflow-hidden px-4 pb-4 pt-4 md:px-6 md:pb-5 md:pt-5 bg-white rounded-xl">
      <input
        ref={mediaInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={handleMediaChange}
      />

      {/* LinkedIn Style Header */}
      <header className="mb-4 flex shrink-0 items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 border border-borderColor shrink-0 overflow-hidden rounded-full">
            <Image
              src={data?.user?.profile_image_url || "/empty_user.jpg"}
              alt={userDisplayName}
              width={64}
              height={64}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <div>
            <h3 className="text-base font-semibold leading-6 text-headerColor">
              {userDisplayName}
            </h3>

            {/* LinkedIn-style Access & Setting Badges */}
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setPostType?.("post_access")}
                className="inline-flex items-center gap-1.5 rounded-full border border-borderColor bg-gray-50/70 px-2.5 py-0.5 text-xs font-medium text-descriptionColor hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <GlobalIcon className="h-3 w-3 text-gray-500" />
                <span>{visibilityLabel}</span>
                <MenueArrowDownIcon className="h-2.5 w-2.5 text-gray-500" />
              </button>

              <button
                type="button"
                onClick={() => setPostType?.("post_access")}
                className="inline-flex items-center gap-1.5 rounded-full border border-borderColor bg-gray-50/70 px-2.5 py-0.5 text-xs font-medium text-descriptionColor hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <MessageSquare className="h-3 w-3 text-gray-500" />
                <span>{commentLabel}</span>
                <MenueArrowDownIcon className="h-2.5 w-2.5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Editor Body: Native Multi-Line Textarea */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <textarea
          ref={textareaRef}
          value={postText}
          onChange={handleTextChange}
          onSelect={updateSelection}
          onClick={updateSelection}
          onKeyUp={updateSelection}
          onBlur={updateSelection}
          placeholder="What do you want to talk about?"
          className="w-full resize-none border-none bg-transparent p-0 text-[16px] leading-7 text-headerColor  focus:outline-none focus:ring-0"
          style={{ minHeight: "120px", maxHeight: "280px" }}
        />

        {/* Media Preview Section */}
        {previewMedia.length > 0 && (
          <div
            className={`mb-3 mt-3 grid ${
              previewMedia.length === 1
                ? "grid-cols-1"
                : previewMedia.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
            } gap-2`}
          >
            {previewMedia.slice(0, 3).map((media, index) => {
              const hiddenCount = previewMedia.length - 3;
              const showOverlay = index === 2 && hiddenCount > 0;
              return media.type === "video" ? (
                <div
                  key={media.source || `media-${index}`}
                  className={`relative overflow-hidden rounded-xl border border-borderColor bg-black ${
                    isError || isUpdateError ? "border-redColor" : ""
                  }`}
                >
                  <video
                    src={media.source}
                    controls
                    className="h-auto w-full object-cover"
                  />
                  {showOverlay && (
                    <div className="absolute inset-0 flex w-full items-center justify-center bg-black/60 text-center text-sm font-semibold text-white">
                      +{hiddenCount} more
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(index)}
                    className="absolute right-2 top-2 cursor-pointer rounded-full bg-black/70 hover:bg-black/90 p-1.5 text-xs text-white transition-colors"
                    aria-label={`Remove media ${index + 1}`}
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <div
                  key={media.source || `media-${index}`}
                  className={`relative h-auto overflow-hidden rounded-xl border border-borderColor bg-gray-50 ${
                    isError || isUpdateError ? "border-redColor" : ""
                  }`}
                >
                  <Image
                    src={media.source}
                    alt={`Selected media ${index + 1}`}
                    width={1200}
                    height={400}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                  {showOverlay && (
                    <div className="absolute inset-0 flex w-full items-center justify-center bg-black/60 text-center text-sm font-semibold text-white">
                      +{hiddenCount} more
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(index)}
                    className="absolute right-2 top-2 cursor-pointer rounded-full bg-black/70 hover:bg-black/90 p-1.5 text-xs text-white transition-colors"
                    aria-label={`Remove media ${index + 1}`}
                  >
                    <X size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer / Toolbar */}
      <footer className="shrink-0 border-t border-borderColor pt-3 mt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            <SmartEmojiPicker
              onEmojiSelect={handleEmojiSelect}
              iconClassName="w-5 h-5 text-descriptionColor cursor-pointer hover:opacity-80"
              height={260}
            />

            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-gray-100 cursor-pointer text-descriptionColor hover:opacity-80 transition"
              aria-label="Add image"
              onClick={handleMediaButtonClick}
            >
              <ImageUploadIcon className="w-5 h-5 text-descriptionColor" />
            </button>

            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-gray-100 cursor-pointer text-descriptionColor hover:opacity-80 transition"
              aria-label="Add video"
              onClick={handleMediaButtonClick}
            >
              <PlayIcon className="h-5 w-5 text-descriptionColor" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                (!postText.trim() && previewMedia.length === 0) ||
                isLoading ||
                isUpdating
              }
              className="flex h-9 cursor-pointer items-center gap-2 rounded-full bg-buttonColor px-5 text-[14px] font-semibold text-white hover:bg-buttonColor/90 hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 transition"
            >
              {isLoading || isUpdating ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <SendIcon className="h-4 w-4" />
              )}
              {postData?.id ? "Update" : "Post"}
            </button>
          </div>
        </div>
      </footer>
    </section>
  );
}

export default PostModal;
