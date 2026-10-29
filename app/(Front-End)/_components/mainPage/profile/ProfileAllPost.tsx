"use client";

import { useGetProfileTimelineQuery } from "@/feature/slice/post/postSlice";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { skipToken } from "@reduxjs/toolkit/query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PostCard from "../post/PostCard";
import PostCardSkleton from "../post/PostCardSkleton";

function ProfileAllPost() {
  const paramsId = useParams();
  const limit = 10;

  const [tempPage, setTempPage] = useState(1);
  const userId = paramsId?.id;

  const profileTimelineArgs = userId
    ? {
        userId,
        query: `page=${tempPage}&per_page=${limit}`,
      }
    : skipToken;

  const {
    data: timeline,
    isLoading: isTimelineLoading,
    isFetching,
  } = useGetProfileTimelineQuery(profileTimelineArgs);

  const { page, combinedData, lastElementRef } = useInfiniteScroll(
    timeline,
    isFetching,
    isTimelineLoading,
  );

  // Sync the hook's page state back to our query
  useEffect(() => {
    setTempPage(page);
  }, [page]);

  return (
    <section className="space-y-4">
      {combinedData?.map((post, index) => (
        <div
          key={post.id}
          ref={combinedData.length === index + 1 ? lastElementRef : null}
        >
          <PostCard post={post} meta={timeline?.meta} />
        </div>
      ))}

      {(isTimelineLoading || isFetching) && (
        <div className="space-y-4">
          <PostCardSkleton />
          <PostCardSkleton />
        </div>
      )}
      {!isTimelineLoading && combinedData.length === 0 && (
        <p className="text-center  text-primaryColor font-semibold w-full mt-6 py-10 border border-dashed border-borderColor rounded-md">
          No posts to display.
        </p>
      )}
    </section>
  );
}

export default ProfileAllPost;
