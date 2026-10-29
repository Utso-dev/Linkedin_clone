"use client";

import LoadMorePagination from "@/components/reusable/LoadMorePagination";
import { useGetGroupTimelineQuery } from "@/feature/slice/post/postSlice";
import { useLoadMore } from "@/hooks/useLoadMore";
import { skipToken } from "@reduxjs/toolkit/query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PostCard from "../post/PostCard";
import PostCardSkleton from "../post/PostCardSkleton";

function GroupPostList({ groupId }: { groupId?: string }) {
  const limit = 5;
  const [tempPage, setTempPage] = useState(1);

  const params = useParams();
  const resolvedGroupId = groupId ?? (params?.groupId as string | undefined);

  const groupTimelineArg = resolvedGroupId
    ? { query: `${resolvedGroupId}?page=${tempPage}&per_page=${limit}` }
    : skipToken;

  const { data, isLoading, isFetching } =
    useGetGroupTimelineQuery(groupTimelineArg);
  const { page, setPage, combinedData, hasMore } = useLoadMore(
    data,
    isFetching,
    limit,
  );


  useEffect(() => {
    setTempPage(page);
  }, [page]);

  return (
    <section className=" grid-cols-1  grid gap-4">
      {isFetching ? (
        Array.from({ length: 2 }).map((_, index) => (
          <PostCardSkleton key={index} />
        ))
      ) : combinedData.length > 0 ? (
        combinedData.map((post, index) => (
          <div key={post.id}>
            <PostCard post={post} meta={data?.meta} />
          </div>
        ))
      ) : (
        <p className="text-center text-muted-foreground">No posts available.</p>
      )}
      <div>
        {isFetching && combinedData.length > 0 && (
          <div className="mt-4">
            <PostCardSkleton />
          </div>
        )}
        {!isFetching && hasMore && (
          <LoadMorePagination setPage={setPage} isFetching={isFetching} />
        )}
      </div>
    </section>
  );
}

export default GroupPostList;
