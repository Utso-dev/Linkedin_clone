import { PostFeedType } from "@/lib/type";
import { formatContentForDisplay, formatPostDate } from "@/lib/utils";
import Image from "next/image";

import emptyImage from "@/public/empty_user.jpg";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import PostAction from "../post/PostAction";
import ProfileImagRender from "./ProfileImagRender";

type PostCardProps = {
  post?: PostFeedType;
  userId?: string | number;
  meta?: any;
};

function PostCard({ post, userId, meta }: PostCardProps) {
  const { user, media, is_connected } = post || {};
  const mediaItems = media ?? [];

  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const rawDescription = post?.description || (post as any)?.content || "";
  const formattedHtml = formatContentForDisplay(rawDescription);

  useEffect(() => {
    setIsExpanded(false);
  }, [post?.id, rawDescription]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const checkOverflow = () => {
      if (!isExpanded) {
        if (el.scrollHeight > el.clientHeight + 2) {
          setShouldShowButton(true);
        } else {
          setShouldShowButton(false);
        }
      }
    };

    checkOverflow();
    const timer = setTimeout(checkOverflow, 60);
    window.addEventListener("resize", checkOverflow);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkOverflow);
    };
  }, [rawDescription, isExpanded]);

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };
  return (
    <article className="rounded-xl  h-full flex flex-col justify-between border border-borderColor  p-2.5 md:p-3">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2.5">
            <div className="h-10  w-10 rounded-full">
              <Image
                src={user?.profile_image_url || emptyImage}
                alt="Profile"
                width={80}
                height={80}
                unoptimized
                className="rounded-full w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="line-clamp-1 text-base font-semibold leading-7 text-headerColor">
                {user?.first_name + " " + user?.last_name || "Vin Intini"}
              </h4>
              <p className="line-clamp-1 text-sm leading-5 text-descriptionColor">
                {user?.title || "CEO & Founder, MindUnite"}
              </p>
              <p className="text-[14px] leading-5 text-grayColor1">
                {formatPostDate(post?.created_at || new Date().toISOString())}
              </p>
            </div>
          </div>

          <PostAction post={post} meta={meta} />
        </div>

        {rawDescription && (
          <div className="mt-4 space-y-1">
            <div
              ref={contentRef}
              className={` text-[16px] leading-7 text-headerColor/85 [&_p]:min-h-6 wrap-break-word overflow-hidden ${
                !isExpanded ? "line-clamp-4" : ""
              }`}
              dangerouslySetInnerHTML={{
                __html: formattedHtml,
              }}
            />
            {shouldShowButton && (
              <button
                type="button"
                onClick={toggleExpanded}
                className="text-sm font-semibold text-primaryColor hover:underline cursor-pointer"
              >
                {isExpanded ? "See less" : "See more"}
              </button>
            )}
          </div>
        )}
        <div className="mt-3">
          <ProfileImagRender mediaItems={mediaItems} />
        </div>
      </div>
      <div>
        <div className="flex justify-between py-1 text-sm font-semibold text-headerColor">
          <p>{`${post?.total_like} likes`}</p>
          <p>{`${post?.total_comment} comments`}</p>
        </div>
        <div className="mt-2  border-t text-center text-primaryColor underline text-base font-semibold border-borderColor pt-2">
          <Link href={`/mu/profile/${userId}/posts`}>View Details</Link>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
