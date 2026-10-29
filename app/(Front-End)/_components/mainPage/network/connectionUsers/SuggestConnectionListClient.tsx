"use client";

import UserConnectionCardSkleton from "@/components/reusable/All Skleton/UserConnectionCardSkleton";
import { ConnectionRequestType } from "@/lib/type";
import { fetchWrapper } from "@/src/utils/fetchWrapper";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import ConnectionUserCard from "./ConnectionUserCard";

interface SuggestConnectionListClientProps {
  initialData: ConnectionRequestType[];
  limit: number;
  searchQuery?: string;
}

export default function SuggestConnectionListClient({
  initialData,
  limit,
  searchQuery,
}: SuggestConnectionListClientProps) {
  const [combinedData, setCombinedData] =
    useState<ConnectionRequestType[]>(initialData);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(initialData.length >= limit);

  useEffect(() => {
    setCombinedData(initialData);
    setPage(1);
    setHasMore(initialData.length >= limit);
  }, [initialData, limit]);

  const fetchNextPage = async (nextPage: number) => {
    setIsFetching(true);
    try {
      const query = searchQuery || "";
      const response = await fetchWrapper(
        `/connections/suggestions?page=${nextPage}&per_page=${limit}&search=${encodeURIComponent(query)}`,
      );

      const newItems = response.data || [];

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setCombinedData((prev) => {
          return [...prev, ...newItems];
        });

        if (newItems.length < limit) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error loading more suggestions:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleLoadMore = () => {
    if (!isFetching && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNextPage(nextPage);
    }
  };


  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {combinedData && combinedData.length > 0 ? (
          combinedData.map((profile: ConnectionRequestType, index: number) => (
            <ConnectionUserCard
              profile={profile}
              key={profile?.id || `profile-${index}`}
            />
          ))
        ) : (
          <p className="col-span-full py-8 text-center text-gray-500">
            No suggestions found
          </p>
        )}
      </div>
      <div className="grid mt-4 grid-cols-2 gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {isFetching &&
          Array.from({ length: 5 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="mb-4">
              <UserConnectionCardSkleton />
            </div>
          ))}
      </div>
      {/* Load More Button */}
      {hasMore && combinedData.length > 0 && (
        <div className="flex justify-center w-full cursor-pointer mt-4">
          <button
            className="px-4 py-2 cursor-pointer disabled:bg-bgColor disabled:text-grayColor1 disabled:cursor-not-allowed bg-primaryColor text-white rounded"
            onClick={handleLoadMore}
            disabled={isFetching}
          >
            {isFetching ? <Loader className="animate-spin" /> : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
