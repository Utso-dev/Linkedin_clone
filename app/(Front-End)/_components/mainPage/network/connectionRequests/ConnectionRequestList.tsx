"use client";
import ConnectionRequestSkleton from "@/components/reusable/All Skleton/ConnectionRequestSkleton";
import Error from "@/components/reusable/Error";
import LoadMorePagination from "@/components/reusable/LoadMorePagination";
import { useGetConnectionsQuery } from "@/feature/slice/connect/connectSlice";
import { useLoadMore } from "@/hooks/useLoadMore";
import { ConnectionRequestType } from "@/lib/type";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ConnectionNotFound from "./ConnectionNotFound";
import ConnectionRequestCard from "./ConnectionRequestCard";

function ConnectionRequestList({ isNetwork }: { isNetwork?: boolean }) {
  const params = useSearchParams();
  const limit = 10;
  const [tempPage, setTempPage] = useState(1);
  const searchQuery = (params.get("search") ?? "").trim().toLowerCase();
  const { data, isFetching, isLoading, isError } = useGetConnectionsQuery({
    query: `?search=${searchQuery}&page=${tempPage}&limit=${limit}`,
  });

  const { page, setPage, combinedData, hasMore } = useLoadMore(
    data,
    isFetching,
    limit,
    searchQuery,
  );

  useEffect(() => {
    setTempPage(page);
  }, [page]);

  const showInitialSkeleton = isFetching && combinedData.length === 0;
  const showMoreLoader = isFetching && combinedData.length > 0;

  if (isError) {
    return <Error />;
  }

  return (
    <div>
      <div className="w-full">
        {showInitialSkeleton
          ? Array.from({ length: 8 }).map((_, index) => (
              <ConnectionRequestSkleton key={`request-skeleton-${index}`} />
            ))
          : combinedData?.length > 0
            ? combinedData?.map((item: ConnectionRequestType) => (
                <div key={item.id}>
                  <ConnectionRequestCard key={item.id} item={item} />
                </div>
              ))
            : isNetwork && <ConnectionNotFound />}
      </div>

      {showMoreLoader && (
        <div className="mt-4">
          <ConnectionRequestSkleton />
        </div>
      )}
      {!showMoreLoader && hasMore && (
        <LoadMorePagination setPage={setPage} isFetching={isFetching} />
      )}
    </div>
  );
}

export default ConnectionRequestList;
