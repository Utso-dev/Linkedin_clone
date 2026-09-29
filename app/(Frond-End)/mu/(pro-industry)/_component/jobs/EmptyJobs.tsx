import { Briefcase, Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function EmptyJobs({ clearAllFilters }: { clearAllFilters: () => void }) {
  const searchParams = useSearchParams();

  // Check if any filter is active in URL
  const hasActiveFilters = Boolean(
    searchParams.get("search") ||
    (searchParams.get("status") && searchParams.get("status") !== "all") ||
    searchParams.get("job_id") ||
    searchParams.get("network_type") ||
    searchParams.get("work_mode") ||
    searchParams.get("employment_offering") ||
    searchParams.get("employment_type") ||
    searchParams.get("state_id") ||
    searchParams.get("city_id"),
  );
  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-200/80 p-12 text-center max-w-lg mx-auto my-8">
        <div className="w-14 h-14 rounded-full bg-[#dcf4f2] text-[#009dae] flex items-center justify-center mx-auto mb-3">
          <Briefcase className="w-7 h-7" />
        </div>
        <h3 className="text-base md:text-lg font-bold text-headerColor">
          {hasActiveFilters ? "No matching jobs found" : "No job postings yet"}
        </h3>
        <p className="text-sm md:text-sm text-gray-500 mt-1 mb-5">
          {hasActiveFilters
            ? "Try adjusting your search query or status filter to see other jobs."
            : "Create your first professional job listing to connect with qualified candidates."}
        </p>
        <div className="flex items-center justify-center gap-3">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          )}
          <Link
            href={"/mu/post-job-position"}
            className="px-4 py-2 rounded-lg bg-[#009dae] hover:bg-[#008999] text-white text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Post a job position
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EmptyJobs;
