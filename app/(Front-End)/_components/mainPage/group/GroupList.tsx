"use client";
import GroupSkleton from "@/components/reusable/All Skleton/GroupSkleton";
import LoadMorePagination from "@/components/reusable/LoadMorePagination";
import { useGetMyJoinedGroupsQuery } from "@/feature/slice/group/groupSlice";
import { useLoadMore } from "@/hooks/useLoadMore";
import { GroupDetailType } from "@/lib/type";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import GroupCard from "./GroupCard";

function GroupList() {
  const params = useSearchParams();
  const limit = 10;
  const [tempPage, setTempPage] = useState(1);
  const searchQuery = (params.get("search") ?? "").trim().toLowerCase();
  const { data, isLoading, isFetching, isError } = useGetMyJoinedGroupsQuery({
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
  const showInitialSkeleton =
    (isLoading || isFetching) && combinedData.length === 0;
  const showMoreLoader = isFetching && combinedData.length > 0;
  if (isError) {
    return <div>Error loading groups</div>;
  }
  return (
    <div>
      {showInitialSkeleton ? (
        Array.from({ length: 6 }).map((_, index) => (
          <GroupSkleton key={index} />
        ))
      ) : combinedData.length > 0 ? (
        combinedData.map((group: GroupDetailType, index: number) => (
          <div key={group.id}>
            <GroupCard group={group} />
          </div>
        ))
      ) : (
        <div>
          <div className="py-6 text-center text-grayColor1 text-lg font-semibold ">
            {" "}
            You are not a member of any groups.
          </div>
          
        </div>
      )}
      {showMoreLoader && (
        <div className="mt-4">
          <GroupSkleton />
        </div>
      )}
      {!showMoreLoader && hasMore && (
        <LoadMorePagination setPage={setPage} isFetching={isFetching} />
      )}
    </div>
  );
}

export default GroupList;
