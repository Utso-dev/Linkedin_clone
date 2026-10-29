"use client";
import ConnectionRequestSkleton from "@/components/reusable/All Skleton/ConnectionRequestSkleton";
import LoadMorePagination from "@/components/reusable/LoadMorePagination";
import { useGetAllInviteGroupQuery } from "@/feature/slice/group/groupSlice";
import { useEffect, useState } from "react";
import GroupInvitationCard from "./GroupInvitationCard";

interface GroupInvitetionAllListProps {
  initialData: any;
  limit: number;
}

function GroupInvitetionAllList({ initialData, limit }: GroupInvitetionAllListProps) {
  const [initialsData, setInitialsData] = useState<any[]>(
    initialData?.data || [],
  );
  const [tempPage, setTempPage] = useState(1);

  const { data, isFetching } = useGetAllInviteGroupQuery(
    { query: `page=${tempPage}&limit=${limit}` },
    { skip: tempPage === 1 },
  );

  useEffect(() => {
    if (data?.data) {
      setInitialsData((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const uniqueNewItems = data.data.filter(
          (item: any) => !existingIds.has(item.id),
        );
        return [...prev, ...uniqueNewItems];
      });
    }
  }, [data]);

  const showMoreLoader = isFetching && initialsData.length > 0;
  const hasMore =
    tempPage === 1 ? initialsData.length === limit : data?.data?.length === limit;

  return (
    <div>
      <div className="space-y-4">
        {initialsData?.length > 0 ? (
          initialsData.map((item: any, index: number) => (
            <div key={item?.id || `invite-${index}`}>
              <GroupInvitationCard item={item} />
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No Group Invitation Found
          </div>
        )}
      </div>

      {showMoreLoader && (
        <div className="mt-4">
          <ConnectionRequestSkleton />
        </div>
      )}

      {!showMoreLoader && hasMore && (
        <LoadMorePagination setPage={setTempPage} isFetching={isFetching} />
      )}
    </div>
  );
}

export default GroupInvitetionAllList;