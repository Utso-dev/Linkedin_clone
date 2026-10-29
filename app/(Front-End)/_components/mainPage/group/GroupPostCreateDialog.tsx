"use client";

import SmartEmojiPicker from "@/components/reusable/SmartEmojiPicker";
import {
  useCreatePostMutation,
  useUpdateGroupPostMutation,
} from "@/feature/slice/post/postSlice";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import { PlayIcon, SendIcon } from "@/public/svgIcons/Icons";
import { useDispatch } from "react-redux";

import RootDialog from "@/components/reusable/RootDialog";
import { resetPostComposeState } from "@/feature/slice/postCompose/postComposeSlice";
import { ImageUploadIcon } from "@/public/svgIcons/Icons";
import { Loader, X } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type PreviewMedia = {
  source: string;
  type: "image" | "video";
  file?: File;
  isObjectUrl?: boolean;
  id?: number;
};

function GroupPostCreateDialog({
  setOpen,
  open,
  groupId,
  postData,
}: {
  setOpen: (open: boolean) => void;
  open: boolean;
  groupId?: number;
  postData?: any;
}) {
  const params = useParams();
  const groupsId = Array.isArray(params?.groupId)
    ? params.groupId[0]
    : params?.groupId;
  const [postText, setPostText] = useState("");
  const { data } = useGetUserProfileQuery("user");
  const [previewMedia, setPreviewMedia] = useState<PreviewMedia[]>([]);
  const [removedMediaIds, setRemovedMediaIds] = useState<number[]>([]);
  const mediaInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const dispatch = useDispatch();
  const [createPost, { isLoading }] = useCreatePostMutation();
  const [updateGroupPost, { isLoading: isUpdating }] =
    useUpdateGroupPostMutation();
  useEffect(() => {
    setPostText(postData?.description || "");
    setRemovedMediaIds([]);

    setPreviewMedia((previous) => {
      previous.forEach((item) => {
        if (item.isObjectUrl) {
          URL.revokeObjectURL(item.source);
        }
      });

      return (
        postData?.media?.map(
          (media: { id: number; url: string; type: "image" | "video" }) => ({
            id: media.id,
            source: media.url,
            type: media.type,
          }),
        ) || []
      );
    });
  }, [postData]);

  useEffect(() => {
    return () => {
      previewMedia.forEach((item) => {
        if (item.isObjectUrl) {
          URL.revokeObjectURL(item.source);
        }
      });
    };
  }, [previewMedia]);

  const handleMediaButtonClick = () => {
    mediaInputRef.current?.click();
  };

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).filter(
      (file) =>
        file.type.startsWith("image/") || file.type.startsWith("video/"),
    );

    if (files.length === 0) {
      return;
    }

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
        setRemovedMediaIds((prev) =>
          prev.includes(removed.id!) ? prev : [...prev, removed.id!],
        );
      }

      if (removed?.isObjectUrl) {
        URL.revokeObjectURL(removed.source);
      }

      return next;
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setPostText((prev) => prev + emoji);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText =
      postText.substring(0, start) + emoji + postText.substring(end);
    setPostText(newText);

    // Focus textarea and set cursor after emoji
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  const handleSubmit = async () => {
    const trimmedText = postText.trim();
    const newMediaCount = previewMedia.filter((item) => item.file).length;
    if (
      !trimmedText &&
      newMediaCount === 0 &&
      removedMediaIds.length === 0 &&
      !postData?.id
    ) {
      return;
    }

    const formData = new FormData();
    formData.append("description", trimmedText);
    formData.append("visibility", "groups");
    formData.append("group_ids[]", String(groupId || groupsId));
    previewMedia.forEach((media) => {
      if (media.file) {
        formData.append("media[]", media.file);
      }
    });
    formData.append("who_can_comment", "anyone");

    if (postData?.id && removedMediaIds.length > 0) {
      removedMediaIds.forEach((id) => {
        formData.append("remove_media_ids[]", String(id));
      });
    }

    try {
      const response = postData?.id
        ? await updateGroupPost({
            id: postData.id,
            groupId: groupId || groupsId,
            body: formData,
          }).unwrap()
        : await createPost(formData).unwrap();

      toast.success(
        response.message ||
          (postData?.id
            ? "Post updated successfully"
            : "Post created successfully"),
      );
      dispatch(resetPostComposeState());
      previewMedia.forEach((item) => {
        if (item.isObjectUrl) {
          URL.revokeObjectURL(item.source);
        }
      });
      setPostText("");
      setPreviewMedia([]);
      setRemovedMediaIds([]);
      setOpen(false);
    } catch (error) {
      toast.error(
        error?.data?.message ||
          (postData?.id ? "Failed to update post" : "Failed to create post"),
      );
      console.error(error);
    }
  };

  return (
    <RootDialog open={open} setOpen={setOpen}>
      <section className="relative flex flex-col max-h-[90vh] px-4 pb-4 pt-4 md:px-5 md:pb-5 md:pt-4">
        <input
          ref={mediaInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={handleMediaChange}
        />

        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-13 w-13 border border-borderColor shrink-0 overflow-hidden rounded-full">
              <Image
                src={data?.user?.profile_image_url || "/empty_user.jpg"}
                alt="Vin Intiny"
                width={150}
                height={140}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold leading-6 text-descriptionColor">
                {data?.user?.first_name + " " + data?.user?.last_name ||
                  "Vin Intiny"}
              </h3>

              <button
                type="button"
                className="mt-0.5 inline-flex items-center cursor-pointer leading-[160%] gap-1 text-[14px] text-descriptionColor hover:opacity-80"
              >
                <span>Post for Group.</span>
                {/* <MenueArrowDownIcon className="h-3 w-3" /> */}
              </button>
            </div>
          </div>
        </div>
        <div className=" flex-1 h-full overflow-y-auto">
          <textarea
            ref={textareaRef}
            value={postText}
            onChange={(event) => setPostText(event.target.value)}
            placeholder="What’s on your mind today?"
            rows={3}
            className="min-h-25 w-full resize-none bg-transparent text-[17px] leading-7 text-headerColor placeholder:text-grayColor1 focus:outline-none"
          />
          <div className="h-57.5  ">
            {previewMedia.length > 0 && (
              <div
                className={`mb-3 grid ${previewMedia.length == 1 ? "grid-cols-1" : previewMedia.length == 2 ? "grid-cols-2" : "grid-cols-3"} gap-1 mt-2 space-y-2`}
              >
                {previewMedia.slice(0, 3).map((media, index) => {
                  const hiddenCount = previewMedia.length - 3;
                  const showOverlay = index === 2 && hiddenCount > 0;
                  return media.type === "video" ? (
                    <div
                      key={`media-${index}`}
                      className="relative overflow-hidden rounded-md border border-borderColor"
                    >
                      <video
                        src={media.source}
                        controls
                        className="h-full w-full bg-black object-cover"
                      />
                      {showOverlay && (
                        <div className="absolute inset-0 w-full text-center leading-[100%] flex items-center justify-center bg-black/50 text-sm font-semibold text-whiteColor">
                          +{hiddenCount} more
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(index)}
                        className="absolute right-2 top-2 rounded-full cursor-pointer bg-black/60 px-2 py-1 text-xs font-medium text-white"
                        aria-label={`Remove media ${index + 1}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      key={`media-${index}`}
                      className="relative overflow-hidden h-57.5 rounded-md border border-borderColor"
                    >
                      <Image
                        src={media.source}
                        alt={`Selected media ${index + 1}`}
                        width={1200}
                        height={150}
                        className="h-full w-full object-cover"
                      />
                      {showOverlay && (
                        <div className="absolute inset-0 w-full text-center leading-[100%] flex items-center justify-center bg-black/50 text-sm font-semibold text-whiteColor">
                          +{hiddenCount} more
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(index)}
                        className="absolute  right-1 top-1 rounded-full bg-redColor/60 cursor-pointer p-1 text-xs font-medium text-white"
                        aria-label={`Remove media ${index + 1}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mt-2 flex items-center gap-2">
            <SmartEmojiPicker
              onEmojiSelect={handleEmojiSelect}
              iconClassName="w-5 h-5 text-descriptionColor cursor-pointer hover:opacity-80"
              height={250}
            />
          </div>
          <div className=" flex items-center justify-between border-t border-borderColor pt-3">
            <div className="flex justify-between items-center w-full gap-5">
              <div className="flex items-center w-full gap-2">
                <button
                  type="button"
                  className="cursor-pointer hover:opacity-80"
                  aria-label="Add image"
                  onClick={handleMediaButtonClick}
                >
                  <ImageUploadIcon className="w-4 h-4 text-descriptionColor" />
                </button>

                <button
                  type="button"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center text-descriptionColor transition hover:opacity-80"
                  aria-label="Add video"
                  onClick={handleMediaButtonClick}
                >
                  <PlayIcon className="h-5 w-5 text-descriptionColor" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={
                  (!postText.trim() &&
                    previewMedia.filter((item) => item.file).length === 0 &&
                    removedMediaIds.length === 0 &&
                    !postData?.id) ||
                  isLoading ||
                  isUpdating
                }
                className=" h-8 disabled:cursor-not-allowed gap-2 rounded-full disabled:bg-grayColor1 cursor-pointer leading-[140%] bg-buttonColor px-4 text-[14px] font-semibold text-whiteColor flex items-center hover:bg-buttonColor/90 hover:shadow-xl"
              >
                {isLoading || isUpdating ? (
                  <Loader className=" animate-spin h-4 w-4" />
                ) : (
                  <SendIcon className=" h-4 w-4" />
                )}
                Post
              </button>
            </div>
          </div>
        </div>
      </section>
    </RootDialog>
  );
}

export default GroupPostCreateDialog;
