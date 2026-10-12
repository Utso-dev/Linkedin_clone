"use client";

import { useCursorPagination } from "@/hooks/useCursorPagination";
import { useEffect, useState } from "react";

import { fetchWrapper } from "@/src/utils/fetchWrapper";
import PostCard from "./PostCard";
import PostCardSkleton from "./PostCardSkleton";

type Props = {
  initialData: any;
  initialUrl?: string;
  limit?: number;
};

function getCursorUrl(url: string, cursor: string, limit: number) {
  const [pathname, query = ""] = url.split("?");
  const params = new URLSearchParams(query);

  params.delete("page");
  params.set("per_page", String(limit));
  params.set("cursor", cursor);

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
        const res = await fetchWrapper(getCursorUrl(initialUrl, cursor, limit));
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

  return (
    <section className="space-y-4">
      {combinedData.map((post: any) => (
        <div key={post.id}>
          <PostCard post={post} />
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
