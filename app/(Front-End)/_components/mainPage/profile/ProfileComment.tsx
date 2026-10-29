"use client";

import CommentSkleton from "@/components/reusable/All Skleton/CommentSkleton";
import { useGetAllCommentListByPostIdQuery, useGetMyCommentListQuery } from "@/feature/slice/post/commentSlice";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import { formatPostDate } from "@/lib/utils";

function ProfileComment() {
  const { data, isLoading } = useGetMyCommentListQuery("my-comments");

  const commentList = data?.data || [];

  return (
    <div className="space-y-2">
      {isLoading
        ? Array.from({ length: 7 }).map((_, index) => (
            <CommentSkleton key={`profile-comment-skeleton-${index}`} />
          ))
        : commentList.map((item) => (
            <article key={item.id} className="border-b border-borderColor py-3">
              <p className="text-sm font-normal leading-[1.35] text-descriptionColor">
                <span>{item?.post?.posted_by?.name}</span>
                <span className="mx-1">•</span>
                <span>{formatPostDate(item?.comment_time)}</span>
              </p>
              <p
                className="mt-1 text-base md:text-lg
               font-normal leading-[1.35] text-headerColor"
              >
                {item?.comment}
              </p>
            </article>
          ))}
    </div>
  );
}

export default ProfileComment;
