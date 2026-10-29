import { usePostToggleLikeMutation } from "@/feature/slice/post/likeSlice";
import { PostFeedType } from "@/lib/type";
import { formatContentForDisplay, formatPostDate } from "@/lib/utils";
import emptyImage from "@/public/empty_user.jpg";
import { CommentIcon, LikeIcon } from "@/public/svgIcons/Icons";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import PostAction from "./PostAction";
import PostComment from "./PostComment";
import PostImageRender from "./PostImageRender";
import PostLikeList from "./PostLikeList";

type PostCardProps = {
  post?: PostFeedType;
  meta?: any; // Adjust the type as needed
};

function PostCard({ post, meta }: PostCardProps) {
  const { user, media, group, industry } = post || {};

  const mediaItems = media ?? [];
  const [isLiked, setIsLiked] = useState(Boolean(post?.liked_by_me));
  const [isCommented, setIsCommented] = useState(false);
  const [likeList, setLikeList] = useState(false);

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

  const [postToggleLike] = usePostToggleLikeMutation();
  const likedByMe = Boolean(post?.liked_by_me);
  const likesCount = Math.max(
    0,
    (post?.total_like || 0) + (isLiked === likedByMe ? 0 : isLiked ? 1 : -1),
  );

  const handleLikeClick = async () => {
    const newLikedStatus = !isLiked;
    setIsLiked(newLikedStatus);
    try {
      await postToggleLike({
        postId: post?.id ?? "",
      }).unwrap();
    } catch (error) {
      setIsLiked(!newLikedStatus);
      console.error("Failed to toggle like:", error);
    }
  };

  return (
    <article className="rounded-xl border border-borderColor p-2.5 md:p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          {industry ? (
            <>
              <div className="relative md:h-14 h-10 w-10 md:w-14  rounded-md border border-borderColor bg-whiteColor shadow-sm">
                <Image
                  src={industry?.logo || emptyImage}
                  alt="Profile"
                  width={128}
                  height={128}
                  sizes="80px"
                  className="h-full w-full object-cover rounded-md"
                />
                <HiOutlineBuildingOffice2 className="absolute -bottom-1 bg-white rounded-xs -right-1 md:h-7 w-5 h-5 md:w-7 md:rounded-sm border-2 border-whiteColor object-contain shadow-sm" />
              </div>
              <div>
                <Link
                  href={`/mu/industry/${industry?.id}`}
                  className="line-clamp-1 text-base font-semibold leading-5 text-headerColor"
                >
                  {industry?.name || "CEO & Founder, MindUnite"}{" "}
                  {/* <span className="text-primaryColor">{group ? group?.name : ""}</span> */}
                </Link>
                <p className="line-clamp-1 text-sm leading-5 text-descriptionColor">
                  {industry?.tagline || "CEO & Founder, MindUnite"}
                </p>
                <p className="text-[14px] leading-5 text-grayColor1">
                  {formatPostDate(post?.created_at || new Date().toISOString())}
                </p>
              </div>
            </>
          ) : group ? (
            <>
              <div className="relative md:h-14 h-10 w-10 md:w-14  rounded-md border border-borderColor bg-whiteColor shadow-sm">
                <Image
                  src={group?.logo_url || emptyImage}
                  alt="Profile"
                  width={128}
                  height={128}
                  sizes="80px"
                  className="h-full w-full object-cover rounded-md"
                />
                <Image
                  src={user?.profile_image_url || emptyImage}
                  alt="Profile"
                  width={56}
                  height={56}
                  sizes="28px"
                  className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full border-2 border-whiteColor object-cover shadow-sm"
                />
              </div>
              <div>
                <Link
                  href={`/mu/my-network/group/${group?.id}`}
                  className="line-clamp-1 text-base font-semibold leading-5 text-headerColor"
                >
                  {group?.name || "CEO & Founder, MindUnite"}{" "}
                  {/* <span className="text-primaryColor">{group ? group?.name : ""}</span> */}
                </Link>
                <Link
                  href={`/mu/profile/${user?.username}`}
                  className="line-clamp-1 text-sm leading-5 text-descriptionColor"
                >
                  {user?.first_name + " " + user?.last_name ||
                    "CEO & Founder, MindUnite"}
                </Link>
                <p className="text-[14px] leading-5 text-grayColor1">
                  {formatPostDate(post?.created_at || new Date().toISOString())}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="md:h-14 h-10 w-10 md:w-14 overflow-hidden rounded-full border border-borderColor bg-whiteColor shadow-sm">
                <Image
                  src={user?.profile_image_url || emptyImage}
                  alt="Profile"
                  width={128}
                  height={128}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <Link
                  href={`/mu/profile/${user?.username}`}
                  className="line-clamp-1 text-base font-semibold leading-5 text-headerColor"
                >
                  {user?.first_name + " " + user?.last_name || "Vin Intini"}{" "}
                  {/* <span className="text-primaryColor">{group ? group?.name : ""}</span> */}
                </Link>
                <p className="line-clamp-1 text-sm leading-5 text-descriptionColor">
                  {user?.title || "CEO & Founder, MindUnite"}
                </p>
                <p className="text-[14px] leading-5 text-grayColor1">
                  {formatPostDate(post?.created_at || new Date().toISOString())}
                </p>
              </div>
            </>
          )}
        </div>

        <PostAction post={post} meta={meta} />
      </div>

      {rawDescription && (
        <div className="mt-4 space-y-1">
          <div
            ref={contentRef}
            className={`wrap-break-word text-[16px] leading-7 text-headerColor/85 [&_p]:min-h-6  overflow-hidden ${
              !isExpanded ? "line-clamp-3" : ""
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
      <div>
        <PostImageRender mediaItems={mediaItems} />
      </div>

      <div className="flex justify-between py-1 text-sm font-semibold text-headerColor">
        <button onClick={() => setLikeList(true)} className="cursor-pointer">
          {`${likesCount} likes`}
        </button>
        <button
          className=" cursor-pointer"
          onClick={() => setIsCommented((previous) => !previous)}
        >{`${post?.total_comment} comments`}</button>
      </div>

      <div className="mt-2 grid grid-cols-2 border-t border-borderColor pt-2">
        <button
          type="button"
          onClick={handleLikeClick}
          className={`${isLiked ? " text-primaryColor" : ""} flex items-center justify-center gap-2 py-1.5 text-[16px] font-semibold text-headerColor/90 cursor-pointer hover:opacity-80`}
        >
          <LikeIcon
            className={` ${isLiked ? " stroke-primaryColor" : ""} h-4.5 w-4.5`}
          />
          <span>Like</span>
        </button>
        <button
          type="button"
          onClick={() => setIsCommented((previous) => !previous)}
          className="flex items-center justify-center gap-2 py-1.5 text-[16px] font-semibold text-headerColor/90 cursor-pointer hover:opacity-80"
        >
          <CommentIcon className="h-4.5 w-4.5" />
          <span>Comments</span>
        </button>
      </div>
      {isCommented && (
        <div className="mt-2">
          {" "}
          <PostComment post={post} />
        </div>
      )}
      {likeList && (
        <PostLikeList postId={post?.id} open={likeList} setOpen={setLikeList} />
      )}
    </article>
  );
}

export default PostCard;
