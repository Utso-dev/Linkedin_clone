"use client";
import GroupSkleton from "@/components/reusable/All Skleton/GroupSkleton";
import { BUTTON_STYLES } from "@/components/reusable/buttonStyles";
import LoadMorePagination from "@/components/reusable/LoadMorePagination";
import { useGetMyCreatedGroupsQuery } from "@/feature/slice/group/groupSlice";
import { useLoadMore } from "@/hooks/useLoadMore";
import { GroupDetailType } from "@/lib/type";
import { GroupUserIcon } from "@/public/svgIcons/Icons";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import GroupCard from "./GroupCard";
import CreateGroupForm from "./GroupCreateModal";

function CreateMyGroupList() {
  const params = useSearchParams();
  const [isCreating, setIsCreating] = useState(false);
  const limit = 5;
  const [tempPage, setTempPage] = useState(1);
  const searchQuery = (params.get("search") ?? "").trim().toLowerCase();
  const { data, isLoading, isFetching, isError } = useGetMyCreatedGroupsQuery({
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
  if (isError) {
    return <div>Error loading groups</div>;
  }

  const showInitialSkeleton =
    (isLoading || isFetching) && combinedData.length === 0;
  const showMoreLoader = isFetching && combinedData.length > 0;

  return (
    <div>
      {showInitialSkeleton ? (
        Array.from({ length: 6 }).map((_, index) => (
          <GroupSkleton key={index} />
        ))
      ) : combinedData.length > 0 ? (
        combinedData.map((group: GroupDetailType, index: number) => (
          <div key={group?.id}>
            <GroupCard group={group} />
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center gap-4 mt-10 w-full h-full border border-primaryColor border-dashed rounded-md py-10">
          <div className="p-2 bg-primaryColor rounded-sm">
            <GroupUserIcon className="w-7 h-7 text-whiteColor " />
          </div>
          <p className="text-center text-grayColor1 ">
            You haven't created any groups yet.
          </p>

          <button
            className={`${BUTTON_STYLES.primary} flex items-center py-2! gap-1.5`}
            onClick={() => setIsCreating(true)}
          >
            <Plus className="w-4 h-4" /> Create Group
          </button>
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

      {isCreating && (
        <CreateGroupForm open={isCreating} setOpen={setIsCreating} />
      )}
    </div>
  );
}

export default CreateMyGroupList;
