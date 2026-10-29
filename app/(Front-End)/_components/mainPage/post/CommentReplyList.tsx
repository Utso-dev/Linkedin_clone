import CommentRowSkeleton from "@/components/reusable/All Skleton/PostCommentSkleton";
import { useGetReplyListByCommentIdQuery } from "@/feature/slice/post/commentSlice";
import { useEffect, useRef } from "react";
import CommentRow from "./CommentCard";

export function CommentReplyList({
  commentId,
  onLastReplyTopChange,
}: {
  commentId: number;
  onLastReplyTopChange?: (lastTopInViewport: number | null) => void;
}) {
  const { data: replyData, isLoading } =
    useGetReplyListByCommentIdQuery(commentId);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!replyData?.data?.length) {
      onLastReplyTopChange?.(null);
      return;
    }

    const measureLastReplyTop = () => {
      const lastReplyRow = listRef.current?.querySelector(
        "[data-reply-row]:last-child",
      ) as HTMLDivElement | null;

      if (!lastReplyRow) {
        onLastReplyTopChange?.(null);
        return;
      }

      onLastReplyTopChange?.(lastReplyRow.getBoundingClientRect().top);
    };

    const frameId = requestAnimationFrame(measureLastReplyTop);
    window.addEventListener("resize", measureLastReplyTop);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", measureLastReplyTop);
    };
  }, [isLoading, replyData, onLastReplyTopChange]);

  const replies = replyData?.data || [];

  if (!replies.length) {
    return null;
  }

  return (
    <div ref={listRef} className="relative mt-6 space-y-5">
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <CommentRowSkeleton key={i} />
          ))}
        </div>
      ) : (
        replies.map((reply: any) => (
          <div key={reply.id} data-reply-row>
            <CommentRow item={reply} depth={1} />
          </div>
        ))
      )}
    </div>
  );
}
