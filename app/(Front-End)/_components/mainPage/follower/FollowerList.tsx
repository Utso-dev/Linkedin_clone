"use client";
import ConnectionRequestSkleton from "@/components/reusable/All Skleton/ConnectionRequestSkleton";
import Error from "@/components/reusable/Error";

import LoadMorePagination from "@/components/reusable/LoadMorePagination";
import { useGetMyFollowingsQuery } from "@/feature/slice/connect/followSlice";
import { useLoadMore } from "@/hooks/useLoadMore";
import { ConnectionRequestType } from "@/lib/type";
import { useEffect, useState } from "react";
import ConnectionNotFound from "../network/connectionRequests/ConnectionNotFound";
import ConnectionRequestCard from "../network/connectionRequests/ConnectionRequestCard";

function FollowerList({ isNetwork }: { isNetwork?: boolean }) {
  const limit = 10;
  const [tempPage, setTempPage] = useState(1);
  const { data, isLoading, isFetching, isError } = useGetMyFollowingsQuery({
    query: `?page=${tempPage}&limit=${limit}`,
  });

  const { page, setPage, combinedData, hasMore } = useLoadMore(
    data,
    isFetching,
    limit,
  );

  useEffect(() => {
    setTempPage(page);
  }, [page]);

  const showInitialSkeleton =
    (isLoading || isFetching) && combinedData.length === 0;
  const showMoreLoader = isFetching && combinedData.length > 0;
  if (isError) {
    return <Error />;
  }

  return (
    <div>
      <p className="text-sm  text-grayColor1 mt-1">
        You are following {data?.total || 0} people out of your network
      </p>
      <div className="mt-6">
        {showInitialSkeleton
          ? Array.from({ length: 8 }).map((_, index) => (
              <ConnectionRequestSkleton key={`request-skeleton-${index}`} />
            ))
          : combinedData?.length > 0
            ? combinedData?.map((item: ConnectionRequestType) => (
                <ConnectionRequestCard key={item.id} item={item} />
              ))
            : isNetwork && <ConnectionNotFound />}
      </div>
      <div>
        {showMoreLoader && (
          <div className="mt-4">
            <ConnectionRequestSkleton />
          </div>
        )}
        {!showMoreLoader && hasMore && (
          <LoadMorePagination setPage={setPage} isFetching={isFetching} />
        )}
      </div>
    </div>
  );
}

export default FollowerList;
