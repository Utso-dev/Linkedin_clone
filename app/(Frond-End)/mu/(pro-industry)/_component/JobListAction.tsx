import { Eye, FileText, Pencil } from "lucide-react";
import Link from "next/link";
import { JobItem } from "./JobListCard";

function JobListAction({ row }: { row: JobItem }) {
  return (
    <div>
      <div className="flex items-center justify-center gap-1.5 px-4 py-3.5">
        {/* View icon */}
        <Link
          href={`/mu/job-listing/job-details/${row.id}`}
          title="View Details"
          className="w-8 h-8 rounded-lg border border-gray-200 text-[#009dae] hover:bg-[#009dae]/10 hover:border-[#009dae]/30 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
        >
          <Eye className="w-4 h-4" />
        </Link>

        {/* Applicants icon */}
        <button
          type="button"
          title="View Applicants"
          className="w-8 h-8 rounded-lg border border-gray-200 text-[#009dae] hover:bg-[#009dae]/10 hover:border-[#009dae]/30 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
        >
          <FileText className="w-4 h-4" />
        </button>

        {/* Edit icon */}
        <button
          type="button"
          title="Edit Job"
          className="w-8 h-8 rounded-lg border border-gray-200 text-descriptionColor hover:text-headerColor hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default JobListAction;
