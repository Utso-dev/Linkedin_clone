"use client";

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useEffect, useState } from "react";

import { fetchWrapper } from "@/src/utils/fetchWrapper";
import PostCard from "./PostCard";
import PostCardSkleton from "./PostCardSkleton";

type Props = {
  initialData: any;
  initialUrl?: string;
  limit?: number;
};

function getPageUrl(url: string, page: number, limit: number) {
  const [pathname, query = ""] = url.split("?");
  const params = new URLSearchParams(query);

  params.set("page", String(page));
  params.set("per_page", String(limit));

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

  const { page, combinedData, lastElementRef } = useInfiniteScroll(
    dataResponse,
    isFetching,
    false,
    {},
    initialUrl,
  );

  useEffect(() => {
    if (page === 1) return;
    let cancelled = false;

    const fetchPage = async () => {
      setIsFetching(true);
      try {
        const res = await fetchWrapper(getPageUrl(initialUrl, page, limit));
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
  }, [initialUrl, page, limit]);

  return (
    <section className="space-y-4">
      {combinedData.map((post: any, index: number) => (
        <div
          key={post.id}
          ref={combinedData.length === index + 1 ? lastElementRef : null}
        >
          <PostCard post={post} />
        </div>
      ))}

      {isFetching && (
        <div className="space-y-4">
          <PostCardSkleton />
          <PostCardSkleton />
        </div>
      )}

      {!isFetching && combinedData.length === 0 && (
        <p className="text-center  text-primaryColor font-semibold w-full mt-6 py-10 border border-dashed border-borderColor rounded-md">
          No posts to display.
        </p>
      )}
    </section>
  );
}
