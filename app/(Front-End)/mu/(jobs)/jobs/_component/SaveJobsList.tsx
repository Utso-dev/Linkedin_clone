"use client";
import { useGetAllSavedJobsQuery } from "@/feature/slice/jobs/userJobSlice";
import SaveJobcard from "./SaveJobcard";
import { SaveJobcardSkeleton } from "./SaveJobcardSkeleton";
import SaveJobsNotFound from "./SaveJobsNotFound";
import { useUrlQueryParams } from "@/hooks/useUrlQueryParams";

function SaveJobsList() {
  const { params } = useUrlQueryParams();
  const search = params.search?.trim();
  
  const { data, isLoading, isError } = useGetAllSavedJobsQuery(
    search ? { search } : {},
  );
  const savedJobs = data?.data || data || [];
  return (
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
            <SaveJobcard key={item?.id || index} job={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SaveJobsList;
