import Search from "@/components/reusable/Search";
import { StatusCountsType } from "@/lib/type";
import { useState } from "react";

function ApplicantsFilter({
  status_count,
}: {
  status_count: StatusCountsType;
}) {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const STATUS_TABS = [
    { key: "all", label: "All", count: status_count?.all },
    { key: "pending", label: "Pending", count: status_count?.pending },
    { key: "reviewing", label: "Reviewing", count: status_count?.reviewing },
    {
      key: "shortlisted",
      label: "Shortlisted",
      count: status_count?.shortlisted,
    },
    {
      key: "interviewed",
      label: "Interviewed",
      count: status_count?.interviewed,
    },
    { key: "offered", label: "Offered", count: status_count?.offered },
    { key: "hired", label: "Hired", count: status_count?.hired },
    { key: "rejected", label: "Rejected", count: status_count?.rejected },
  ];
  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        {/* Search Input */}
        <div className="w-full sm:w-72">
          <Search placeHolder="Search by Name or ID" className="rounded-md!" />
        </div>

        {/* Status Count Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {STATUS_TABS.map((tab) => {
            const isSelected = selectedStatus === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setSelectedStatus(tab.key);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-primaryColor text-white border border-primaryColor shadow-xs"
                    : " text-descriptionColor border border-buttonColor bg-buttonColor/10"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ApplicantsFilter;
