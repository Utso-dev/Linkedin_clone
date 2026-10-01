"use client";
import { AlertCircle, RefreshCw } from "lucide-react";

function ApplicantError({ refetch }: { refetch: () => void }) {
  return (
    <div>
      <div className="rounded-xl border border-red-100 bg-white p-8 text-center max-w-md mx-auto my-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-headerColor">
          Failed to load applicant details
        </h3>
        <p className="text-sm text-descriptionColor mt-1 mb-4">
          An error occurred while fetching the applicant profile.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="px-4 py-2 rounded-lg bg-primaryColor text-white text-sm font-medium hover:bg-[#008999] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      </div>
    </div>
  );
}

export default ApplicantError;
