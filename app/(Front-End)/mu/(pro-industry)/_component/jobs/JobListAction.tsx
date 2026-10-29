import { Eye, FileText, Pencil } from "lucide-react";
import Link from "next/link";
import { JobItem } from "./JobListCard";
import { PencileIcon } from "@/public/svgIcons/Icons";

function JobListAction({ row }: { row: JobItem }) {
  return (
    <div>
      <div className="flex items-center justify-center gap-1.5 px-4 py-3.5">
        {/* View icon */}
        <Link
          href={`/mu/job-listing/${row.id}/job-details`}
          title="View Details"
          className="w-8 h-8 rounded-lg border border-gray-200 text-[#009dae] hover:bg-[#009dae]/10 hover:border-[#009dae]/30 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
        >
          <Eye className="w-4 h-4" />
        </Link>

        {/* Applicants icon */}
        <Link
          href={`/mu/job-listing/${row.id}/applicants`}
          title="View Applicants"
          className="w-8 h-8 rounded-lg border border-gray-200 text-[#009dae] hover:bg-[#009dae]/10 hover:border-[#009dae]/30 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
        >
          <FileText className="w-4 h-4" />
        </Link>

        {/* Edit icon */}
        <Link
          href={`/mu/job-listing/${row.id}/edite`}
          title="Edit Job"
          className="w-8 h-8 rounded-lg border border-gray-200 text-descriptionColor hover:text-headerColor hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
        >
          <PencileIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default JobListAction;
