import { AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

function JobsListError() {
  return (
    <div>
      <div className="bg-white rounded-xl border border-red-100 p-8 text-center max-w-md mx-auto my-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-headerColor">
          Failed to load archived jobs
        </h3>
        <p className="text-sm text-gray-500 mt-1 mb-4">
          An error occurred while fetching your archived job listings. Please
          check your connection and try again.
        </p>
        <Link
          href="/mu/job-listing"
          className="px-4 py-2 rounded-lg bg-[#009dae] text-white text-sm font-medium hover:bg-[#008999] transition-colors inline-flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </Link>
      </div>
    </div>
  );
}

export default JobsListError;
