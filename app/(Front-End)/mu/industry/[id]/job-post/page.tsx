"use client";
import { useGetIndustryJobPostQuery } from "@/feature/slice/jobs/industrySlice";
import { useCursorQuery } from "@/hooks/useCursorPagination";
import { scrollToTop } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import SaveJobcard from "../../../(jobs)/jobs/_component/SaveJobcard";
import { SaveJobcardSkeleton } from "../../../(jobs)/jobs/_component/SaveJobcardSkeleton";
import SaveJobsNotFound from "../../../(jobs)/jobs/_component/SaveJobsNotFound";

function page() {
  const params = useParams();
  const industryId =  params.id;
  const queryParams = useMemo(() => ({ industryId }), [industryId]);
  const {
    items: savedJobs,
    isInitialLoading: isLoading,
    isFetchingMore,
    isError,
    hasMore,
    observerRef,
  } = useCursorQuery(useGetIndustryJobPostQuery, queryParams, {
    limit: 10,
  });

  useEffect(() => {
    scrollToTop();
  }, [industryId]);

  return (
    <div className="mt-4">
      <div>
        {isLoading ? (
          <SaveJobcardSkeleton />
        ) : isError ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
            Failed to load saved jobs. Please try again later.
          </div>
        ) : savedJobs.length === 0 ? (
          <SaveJobsNotFound />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedJobs.map((item: any, index: number) => (
              <SaveJobcard key={item?.id || index} job={item} isApply={true} />
            ))}
          </div>
        )}
        {isFetchingMore && (
          <div className="mt-4">
            <SaveJobcardSkeleton />
          </div>
        )}
        {hasMore && !isFetchingMore && (
          <div ref={observerRef} className="h-2 w-full" />
        )}
      </div>
    </div>
  );
}

export default page;
