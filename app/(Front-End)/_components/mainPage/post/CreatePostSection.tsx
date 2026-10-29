"use client";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import emptyImage from "@/public/empty_user.jpg";
import {
  EmojiIcon,
  ImageUploadIcon,
  PlayIcon,
  SendIcon,
} from "@/public/svgIcons/Icons";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CreatePostDialog from "../profile/CreatePostDialog";

function CreatePostSection() {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useGetUserProfileQuery("user");
  const pathName = usePathname();

  const imagesrc = pathName.includes("industry-profile")
    ? data?.industry?.company?.logo
    : data?.user?.profile_image_url;
  const [postText, setPostText] = useState("");

  return (
    <div className="rounded-md border border-borderColor bg-[#f6f7f8] p-4">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full">
          <Image
            src={imagesrc || emptyImage}
            alt="User avatar"
            width={62}
            height={62}
            unoptimized
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <textarea
          placeholder="Type your post..."
          rows={2}
          onClick={() => setIsOpen(true)}
          className="w-full resize-none bg-transparent text-sm text-headerColor  focus:outline-none"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        />
      </div>

      <div className="mt-3 border-t border-borderColor pt-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-descriptionColor">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="cursor-pointer transition-opacity hover:opacity-75"
              aria-label="Add image"
            >
              <ImageUploadIcon className="text-base" />
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="cursor-pointer transition-opacity hover:opacity-75"
              aria-label="Add video"
            >
              <PlayIcon className="text-base" />
            </button>
            <button
              onClick={() => setIsOpen(true)}
              type="button"
              className="cursor-pointer transition-opacity hover:opacity-75"
              aria-label="Add emoji"
            >
              <EmojiIcon className="text-base" />
            </button>
          </div>

          <button
            type="button"
            className="cursor-pointer text-descriptionColor transition-opacity hover:opacity-75"
            aria-label="Post"
          >
            <SendIcon className="text-base" />
          </button>
        </div>
      </div>
      {isOpen && <CreatePostDialog isOpen={isOpen} setIsOpen={setIsOpen} />}
    </div>
  );
}

export default CreatePostSection;
