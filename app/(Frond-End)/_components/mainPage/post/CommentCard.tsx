import {
  useCommentLikePostMutation,
  useReplyToggleLikeByIdMutation,
} from "@/feature/slice/post/likeSlice";
import { formatPostDate } from "@/lib/utils";
import emptyImage from "@/public/empty_user.jpg";
import { DeleteIcon } from "@/public/svgIcons/Icons";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import CommentDeleteDialog from "./CommentDeleteDialog";
import CommentReplyDeleteDialog from "./CommentReplyDelete";
import CommentReplyLikeList from "./CommentReplyLikeList";
import CommentLikeList from "./ReplyLikeListDialog";
export default function CommentRow({
  depth = 0,
  showReply = false,
  item,
  onReply,
  onToggleReplies,
  isRepliesOpen,
}: {
  depth?: number;
  showReply?: boolean;
  item: any;
  onReply?: (commentId: number, userName: string) => void;
  onToggleReplies?: (commentId: number) => void;
  isRepliesOpen?: boolean;
}) {
  const [commentLikePost] = useCommentLikePostMutation();
  const [likeListOpen, setLikeListOpen] = useState(false);
  const [commentDeleteOpen, setCommentDeleteOpen] = useState(false);
  const [commentReplyDeleteOpen, setCommentReplyDeleteOpen] = useState(false);
  const [replyLikeListOpen, setReplyLikeListOpen] = useState(false);
  const [replyToggleLikeById] = useReplyToggleLikeByIdMutation();
  const [isLiked, setIsLiked] = useState(Boolean(item?.liked_by_me));
  const likedByMe = Boolean(item?.liked_by_me);
  const likesCount = Math.max(
    0,
    (item?.like_count || 0) + (isLiked === likedByMe ? 0 : isLiked ? 1 : -1),
  );
  const handleLikeComment = async () => {
    const newLikedStatus = !isLiked;
    setIsLiked(newLikedStatus);
    try {
      const response = await commentLikePost({ commentId: item?.id });
      toast.success(
        response?.data?.message || "Comment like toggled successfully",
      );
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to like the comment. Please try again.",
      );
    }
  };
  const handleReplyLikeComment = async () => {
    const newLikedStatus = !isLiked;
    setIsLiked(newLikedStatus);
    try {
      const response = await replyToggleLikeById({ commentId: item?.id });
      toast.success(
        response?.data?.message || "Reply like toggled successfully",
      );
    } catch (error) {
      setIsLiked(!newLikedStatus);

      toast.error(
        error?.data?.message || "Failed to like the reply. Please try again.",
      );
    }
  };

  return (
    <div className={`${depth > 0 ? "ml-6  pl-5" : " "} relative`}>
      {depth > 0 && (
        <div className="pointer-events-none absolute -left-2.5 -top-4 h-9 w-7 rounded-bl-2xl border-l border-b border-borderColor" />
      )}
      <div className="flex items-start  gap-2.5">
        <div className="h-8 w-8 border  overflow-hidden rounded-full">
          <Image
            src={item?.user?.profile_image || emptyImage}
            alt="Profile"
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <Link
            href={
              item?.industry_id
                ? `/mu/industry/${item?.industry_id}`
                : `/mu/profile/${item?.user?.id}`
            }
            className="text-sm lg:text-[15px] leading-[140%] font-semibold text-headerColor"
          >
            {item?.user?.name || "Profile Name"}
          </Link>
          <p className=" line-clamp-1 text-[13px] wf font-normal text-descriptionColor">
            {item?.user?.title ||
              "Title (whether its a concise or long title, all the text will be in single line. Truncate the sentence i...)"}
          </p>
        </div>
        <p className="ml-auto shrink-0 font-semibold w-fit text-[14px] leading-5 text-descriptionColor">
          {formatPostDate(
            item?.comment_time || item?.reply_time || new Date().toISOString(),
          )}
        </p>
      </div>
      <div className="mt-4 pl-10">
        <p className=" text-base font-normal leading-[150%] text-descriptionColor">
          {item?.comment || item?.reply}
        </p>
        {item?.image_url && (
          <div className="h-50 w-50 border  overflow-hidden rounded-sm">
            <Image
              src={item?.image_url || emptyImage}
              alt="Profile"
              width={132}
              height={132}
              priority
              unoptimized
              className="h-full w-full object-cover "
            />
          </div>
        )}
      </div>

      {depth == 0 ? (
        <div className="mt-4 pl-10 flex items-center gap-3 text-[14px] font-semibold text-descriptionColor">
          <div className=" text-descriptionColor  gap-1 flex items-center">
            <button
              type="button"
              onClick={handleLikeComment}
              className={`${isLiked ? " text-primaryColor" : ""} cursor-pointer hover:opacity-80`}
            >
              Like •
            </button>
            <button
              onClick={() => setLikeListOpen(true)}
              className="cursor-pointer"
            >
              {likesCount || 0}
            </button>
          </div>

          <>
            <span className="text-headerColor/45">|</span>

            <button
              type="button"
              onClick={() => onReply?.(item?.id, item?.user?.name)}
              aria-expanded={isRepliesOpen}
              className="cursor-pointer text-descriptionColor hover:opacity-80"
            >
              Reply • {item?.replies_count || 0}
            </button>
          </>
          {item?.can_delete && (
            <>
              <span className="text-headerColor/45">|</span>
              <button
                className="cursor-pointer "
                onClick={() => setCommentDeleteOpen(true)}
              >
                <DeleteIcon className="text-redColor w-4 h-4 " />
              </button>
            </>
          )}
        </div>
      ) : (
        <div className=" text-descriptionColor  gap-1 flex items-center mt-4 ">
          <button
            type="button"
            onClick={handleReplyLikeComment}
            className={`${isLiked ? " text-primaryColor" : ""} cursor-pointer text-descriptionColor font-semibold text-sm pl-10 hover:opacity-80`}
          >
            Like •
          </button>
          <button
            onClick={() => setReplyLikeListOpen(true)}
            className="cursor-pointer"
          >
            {likesCount || 0}
          </button>
          {item?.can_delete && (
            <>
              <span className="text-headerColor/45">|</span>
              <button
                className="cursor-pointer "
                onClick={() => setCommentReplyDeleteOpen(true)}
              >
                <DeleteIcon className="text-redColor w-4 h-4 " />
              </button>
            </>
          )}
        </div>
      )}
      {likeListOpen && (
        <CommentLikeList
          open={likeListOpen}
          setOpen={setLikeListOpen}
          commentId={item?.id}
        />
      )}
      {replyLikeListOpen && (
        <CommentReplyLikeList
          open={replyLikeListOpen}
          setOpen={setReplyLikeListOpen}
          commentId={item?.id}
        />
      )}
      {commentDeleteOpen && (
        <CommentDeleteDialog
          open={commentDeleteOpen}
          setOpen={setCommentDeleteOpen}
          commentId={item?.id}
        />
      )}
      {commentReplyDeleteOpen && (
        <CommentReplyDeleteDialog
          open={commentReplyDeleteOpen}
          setOpen={setCommentReplyDeleteOpen}
          commentId={item?.id}
        />
      )}
    </div>
  );
}
