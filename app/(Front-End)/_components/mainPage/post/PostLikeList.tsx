import RootDialog from "@/components/reusable/RootDialog";
import { useGetLikeListQuery } from "@/feature/slice/post/likeSlice";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

import LikeListSkleton from "@/components/reusable/All Skleton/LikeListSkleton";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useState } from "react";
import PostLikeListCard from "./PostLikeListCard";
function PostLikeList({
  open,
  setOpen,
  postId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  postId: string | number;
}) {
  const limit = 10;
  const [tempPage, setTempPage] = useState(1);
  const groupTimelineArg = postId
    ? { query: `${postId}?page=${tempPage}&per_page=${limit}` }
    : skipToken;
  const { data, isLoading } = useGetLikeListQuery(groupTimelineArg);
  const { combinedData, page, lastElementRef } = useInfiniteScroll(
    data,
    isLoading,
    false,
  );
  useEffect(() => {
    setTempPage(page);
  }, [page]);

  return (
    <RootDialog open={open} setOpen={setOpen}>
      <div className="p-4 flex flex-col max-h-[90vh] ">
        <div>
          <h2 className="text-lg font-semibold ">Post Likes</h2>
          <p className="text-grayColor1 text-sm">
            This is a placeholder for the list of users who liked the post.
          </p>
        </div>
        <div className="mt-4 flex-1 h-full overflow-y-auto">
          {isLoading ? (
            <div>
              {Array.from({ length: 5 }).map((_, index) => (
                <LikeListSkleton key={index} />
              ))}
            </div>
          ) : combinedData.length > 0 ? (
            combinedData.map((like) => (
              <div
                key={like.id}
                ref={combinedData.length === like.id ? lastElementRef : null}
              >
                <PostLikeListCard like={like} />
              </div>
            ))
          ) : (
            <p>No likes yet.</p>
          )}
        </div>
      </div>
    </RootDialog>
  );
}

export default PostLikeList;
