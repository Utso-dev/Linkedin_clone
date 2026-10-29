"use client";
import ConnectionRequestSkleton from "@/components/reusable/All Skleton/ConnectionRequestSkleton";
import Error from "@/components/reusable/Error";
import LoadMorePagination from "@/components/reusable/LoadMorePagination";
import { useGetMyConnectionsQuery } from "@/feature/slice/connect/connectSlice";
import { useLoadMore } from "@/hooks/useLoadMore";
import { ConnectionRequestType } from "@/lib/type";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ConnectionNotFound from "../connectionRequests/ConnectionNotFound";
import ConnectionRequestCard from "../connectionRequests/ConnectionRequestCard";
import ConnectionListHeader from "./ConnectionListHeader";

function AllConnectionFriendList() {
  const params = useSearchParams();

  const searchQuery = (params.get("search") ?? "").trim().toLowerCase();
  const sortQuery = params.get("sort") ?? "";
  const limit = 5;
  const [tempPage, setTempPage] = useState(1);

  const { data, isFetching, isError } = useGetMyConnectionsQuery({
    query: `?search=${searchQuery}&page=${tempPage}&limit=${limit}${sortQuery ? `&sort=${sortQuery}` : ""}`,
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
      <ConnectionListHeader data={data} />
      <div className=" max-w-full">
        {showInitialSkeleton ? (
          Array.from({ length: 8 }).map((_, index) => (
            <ConnectionRequestSkleton key={`request-skeleton-${index}`} />
          ))
        ) : combinedData?.length > 0 ? (
          combinedData?.map((item: ConnectionRequestType) => (
            <ConnectionRequestCard key={item.id} item={item} />
          ))
        ) : (
          <ConnectionNotFound
            title="No Connections Found"
            description="You have no connections right now. If you want to connect with someone, please check out the connection requests to get started."
          />
        )}
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

export default AllConnectionFriendList;
