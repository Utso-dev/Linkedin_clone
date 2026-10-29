"use client";

import { useCursorPagination } from "@/hooks/useCursorPagination";
import { useEffect, useState } from "react";

import { fetchWrapper } from "@/src/utils/fetchWrapper";
import PostCard from "./PostCard";
import PostCardSkleton from "./PostCardSkleton";
import PostAddedCard from "./PostAddedCard";

type Props = {
  initialData: any;
  initialUrl?: string;
  limit?: number;
};

function getCursorUrl(
  url: string,
  cursor: string,
  limit: number,
  seenCampaignIds: number[],
) {
  const [pathname, query = ""] = url.split("?");
  const params = new URLSearchParams(query);

  params.delete("page");
  params.set("per_page", String(limit));
  params.set("cursor", cursor);
  if (seenCampaignIds.length > 0) {
    params.set("seen_campaign_ids", seenCampaignIds.join(","));
  }

  return `${pathname}?${params.toString()}`;
}

export default function PostListClient({
  initialData,
  initialUrl = "/newsfeed",
  limit = 10,
}: Props) {
  const [dataResponse, setDataResponse] = useState<any>(
    initialData ?? { data: [] },
  );

  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setDataResponse(initialData ?? { data: [] });
  }, [initialData]);

  const [cursor, setCursor] = useState<string | null>(null);
  const { combinedData, hasMore, nextCursor, observerRef } =
    useCursorPagination({
      data: dataResponse,
      isFetching,
      cursor,
      setCursor,
      resetKey: initialUrl,
    });

  useEffect(() => {
    if (!cursor) return;

    let cancelled = false;

    const fetchPage = async () => {
      setIsFetching(true);
      try {
        const seenCampaignIds = combinedData
          .filter((item: any) => item.is_sponsored && item.ad_campaign_id)
          .map((item: any) => item.ad_campaign_id);
        const res = await fetchWrapper(
          getCursorUrl(initialUrl, cursor, limit, seenCampaignIds),
        );
        if (!cancelled && res) setDataResponse(res);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setIsFetching(false);
      }
    };

    fetchPage();

    return () => {
      cancelled = true;
    };
  }, [initialUrl, cursor, limit]);

  // Ensure only one video plays at a time across the entire feed
  useEffect(() => {
    const handleGlobalPlay = (e: Event) => {
      const currentVideo = e.target as HTMLVideoElement;
      if (!currentVideo || currentVideo.tagName !== "VIDEO") return;

      const allVideos = document.querySelectorAll("video");
      allVideos.forEach((video) => {
        if (video !== currentVideo && !video.paused) {
          video.pause();
        }
      });
    };

    document.addEventListener("play", handleGlobalPlay, true);
    return () => {
      document.removeEventListener("play", handleGlobalPlay, true);
    };
  }, []);

  return (
    <section className="space-y-4">
      {combinedData.map((post: any) => (
        <div key={post.id || `ad-${post.ad_campaign_id}`}>
          {post.is_sponsored === true ? (
            <PostAddedCard ad={post} />
          ) : (
            <PostCard post={post} />
          )}
        </div>
      ))}

      {isFetching && (
        <div className="space-y-4">
          <PostCardSkleton />
          <PostCardSkleton />
        </div>
      )}

      {hasMore && nextCursor && !isFetching && (
        <div ref={observerRef} className="h-2 w-full" />
      )}

      {!isFetching && combinedData.length === 0 && (
        <p className="text-center  text-primaryColor font-semibold w-full mt-6 py-10 border border-dashed border-borderColor rounded-md">
          No posts to display.
        </p>
      )}
    </section>
  );
}
