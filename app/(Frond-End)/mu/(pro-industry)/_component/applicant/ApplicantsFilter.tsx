"use client";

import Search from "@/components/reusable/Search";
import { StatusCountsType } from "@/lib/type";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function ApplicantsFilter({
  status_count,
}: {
  status_count: StatusCountsType;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedStatus = searchParams.get("status") || "all";

  const handleStatusChange = (statusKey: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (statusKey && statusKey !== "all") {
      params.set("status", statusKey);
    } else {
      params.delete("status");
    }

    // Reset pagination when status changes
    params.delete("page");
    params.delete("current_page");

    const nextQuery = params.toString();
    router.replace(`${pathname}${nextQuery ? `?${nextQuery}` : ""}`, {
      scroll: false,
    });
  };

  const STATUS_TABS = [
    { key: "all", label: "All", count: status_count?.all ?? 0 },
    { key: "pending", label: "Pending", count: status_count?.pending ?? 0 },
    {
      key: "reviewing",
      label: "Reviewed",
      count: status_count?.reviewing ?? 0,
    },
    {
      key: "shortlisted",
      label: "Shortlisted",
      count: status_count?.shortlisted ?? 0,
    },
    {
      key: "interviewed",
      label: "Interviewed",
      count: status_count?.interviewed ?? 0,
    },
    { key: "offered", label: "Offered", count: status_count?.offered ?? 0 },
    { key: "hired", label: "Hired", count: status_count?.hired ?? 0 },
    { key: "rejected", label: "Rejected", count: status_count?.rejected ?? 0 },
  ];

  return (
    <div >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <h4 className="text-lg font-semibold text-descriptionColor">Applicants List</h4>
            <div className="w-full sm:w-72">
          <Search placeHolder="Search by Name or ID" className="rounded-md!" />
        </div>
        </div>
      <div className=" mb-4">
       
        {/* Status Count Pills */}
        <div className="flex items-center justify-end gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {STATUS_TABS.map((tab) => {
            const isSelected = selectedStatus === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleStatusChange(tab.key)}
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
