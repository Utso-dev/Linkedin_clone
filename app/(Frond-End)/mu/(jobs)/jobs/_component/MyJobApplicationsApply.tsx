"use client";

import { useGetMyJobApplicationsQuery } from "@/feature/slice/jobs/userJobSlice";
import { useUrlQueryParams } from "@/hooks/useUrlQueryParams";
import { StatusCountsType } from "@/lib/type";
import { useMemo } from "react";
import SaveJobcard from "./SaveJobcard";
import { SaveJobcardSkeleton } from "./SaveJobcardSkeleton";

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "reviewing", label: "In Review" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "interviewed", label: "Interview" },
  { id: "offered", label: "Offered" },
  { id: "hired", label: "Hired" },
  { id: "rejected", label: "Rejected" },
];

const normalizeStatus = (status?: string): string => {
  if (!status || status === "all") return "all";
  if (status === "interview") return "interviewed";
  if (status === "reject") return "rejected";
  if (status === "offering") return "offered";
  if (status === "acceptance") return "hired";
  return status;
};

function MyJobApplicationsApply() {
  const { params, updateParam } = useUrlQueryParams();

  const activeTab = useMemo(
    () => normalizeStatus(params?.status),
    [params?.status],
  );

  const queryParams = useMemo(() => {
    const q: Record<string, any> = {};
    if (activeTab && activeTab !== "all") {
      q.status = activeTab;
    }
    if (params?.search) q.search = params.search;
    if (params?.page) q.page = params.page;
    return q;
  }, [activeTab, params?.search, params?.page]);

  const { data, isLoading, isError, refetch } = useGetMyJobApplicationsQuery(
    queryParams,
  );

  const statusCounts: StatusCountsType | undefined = data?.status_counts;
  const applications: any[] = data?.data || [];

  const getTabCount = (tabId: string): number => {
    if (!statusCounts) return 0;
    const count = statusCounts[tabId as keyof StatusCountsType];
    return typeof count === "number" ? count : 0;
  };

  const handleTabChange = (tabId: string) => {
    updateParam("status", tabId, "all");
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {FILTER_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = getTabCount(tab.id);

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`px-5 py-2 cursor-pointer rounded-full text-sm font-medium whitespace-nowrap transition-colors select-none ${
                isActive
                  ? "bg-primaryColor text-white shadow-xs"
                  : "bg-white border border-borderColor text-descriptionColor hover:bg-bgColor"
              }`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      {isLoading ? (
        <SaveJobcardSkeleton />
      ) : isError ? (
        <div className="bg-white rounded-2xl border border-borderColor p-12 text-center">
          <p className="text-sm sm:text-base text-red-500 font-medium mb-2">
            Failed to load job applications.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-sm text-primaryColor font-medium hover:underline cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-borderColor/80 p-12 text-center">
          <p className="text-base font-semibold text-headerColor mb-1">
            No Applications Found
          </p>
          <p className="text-sm text-descriptionColor">
            {activeTab === "all"
              ? "You haven't submitted any job applications yet."
              : `No applications found under the "${FILTER_TABS.find((t) => t.id === activeTab)?.label || activeTab}" status.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {applications.map((item: any, idx: number) => (
            <SaveJobcard
              key={item?.id || item?.application_id || idx}
              job={item}
              showSaveButton={false}
              status={item?.status}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyJobApplicationsApply;
