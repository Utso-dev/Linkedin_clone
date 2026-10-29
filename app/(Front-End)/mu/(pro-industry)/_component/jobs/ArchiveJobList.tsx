"use client";

import DynamicTable from "@/components/reusable/DynamicTable";
import { useGetJobsArchiveQuery } from "@/feature/slice/jobs/jobSlice";
import { Eye, FileText } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import EmptyJobs from "./EmptyJobs";
import JobListAction from "./JobListAction";
import { JobItem } from "./JobListCard";
import JoblistSkleton from "./JoblistSkleton";
import JobsListError from "./JobsListError";
import JobStatusChange from "./JobStatusChange";

export default function ArchiveJobList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const clearAllFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  const queryParams = useMemo(() => {
    const params: Record<string, any> = {};

    // Filter keys supported by API:
    const filterKeys = [
      "job_id",
      "search",
      "status",
      "network_type",
      "work_mode",
      "employment_offering",
      "employment_type",
      "state_id",
      "city_id",
      "current_page",
      "limit",
    ];

    filterKeys.forEach((key) => {
      const val = searchParams.get(key);
      if (val !== null && val !== undefined && val !== "") {
        if (key === "status") {
          if (val !== "all") {
            params.status = val === "active" ? "published" : val;
          }
        } else {
          params[key] = val;
        }
      }
    });

    return params;
  }, [searchParams]);

  const {
    data: responseData,
    isLoading,
    isError,
  } = useGetJobsArchiveQuery(queryParams);

  // Extract jobs array
  const rawJobs: JobItem[] = responseData?.data || [];

  const columns = [
    {
      label: "Job ID",
      accessor: "job_id",
      width: "80px",
      position: "justify-start",
      formatter: (id: string, row: JobItem) => (
        <div className="px-4 font-bold text-descriptionColor">#{id}</div>
      ),
    },
    {
      label: "Job Title",
      accessor: "job_title",
      width: "280px",
      position: "justify-start",
      formatter: (_: any, row: JobItem) => (
        <div className=" px-4 py-3.5">
          <div className="min-w-0">
            <h4
              className="text-sm font-semibold text-headerColor truncate hover:text-[#009dae] transition-colors cursor-pointer max-w-50"
              title={row.job_title}
            >
              {row.job_title}
            </h4>

            <div className="flex  items-center gap-1.5  mt-0.5">
              {(row.badges && row.badges.length > 0
                ? row.badges
                : ["Full-Time"]
              ).map((badge, idx) => (
                <span
                  key={idx}
                  className="inline-block  text-descriptionColor text-xs  capitalize whitespace-nowrap font-normal"
                >
                  {badge}
                </span>
              ))}
            </div>
            <div className="text-xs text-descriptionColor">
              <span className=" max-w-35" title={row.location || "N/A"}>
                {row.location || "N/A"}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "View",
      accessor: "view",
      width: "100px",
      position: "justify-center",
      formatter: (_: any, row: JobItem) => (
        <div className="flex items-center justify-center gap-1.5 px-4 py-3.5 text-sm text-descriptionColor font-medium">
          <Eye className="w-3.5 h-3.5 text-grayColor1 shrink-0" />
          <span>{(row.views_count ?? 0).toLocaleString()}</span>
        </div>
      ),
    },
    {
      label: "Applicants",
      accessor: "applicants",
      width: "110px",
      position: "justify-center",
      formatter: (_: any, row: JobItem) => (
        <div className="flex items-center justify-center gap-1.5 px-4 py-3.5 text-sm text-descriptionColor font-medium">
          <FileText className="w-3.5 h-3.5 text-grayColor1 shrink-0" />
          <span>{(row.applications_count ?? 0).toLocaleString()}</span>
        </div>
      ),
    },
    {
      label: "Status",
      accessor: "status",
      width: "135px",
      position: "justify-center",
      formatter: (value: string, row: JobItem) => (
        <JobStatusChange value={value} row={row} />
      ),
    },
    {
      label: "Action",
      accessor: "action",
      width: "130px",
      position: "justify-center",
      formatter: (_: any, row: JobItem) => <JobListAction row={row} />,
    },
  ];

  return (
    <div className="w-full pb-10">
      {isLoading ? (
        <JoblistSkleton />
      ) : isError ? (
        <JobsListError />
      ) : rawJobs.length === 0 ? (
        <EmptyJobs clearAllFilters={clearAllFilters} />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden">
          <DynamicTable
            columns={columns}
            data={rawJobs}
            header={{
              position: "justify-start",
              padding: "12px 16px",
              bg: "#F8FAFC",
              text: "#4B5563",
              fontWeight: "600",
              fontSize: "13px",
              rounded: "0px",
            }}
            rowStyle={{
              hover: true,
              hoverbg: "hover:bg-[#F9FAFB]",
              border: "border-b border-gray-100",
            }}
            noDataMessage="No archived job positions found."
          />
        </div>
      )}
    </div>
  );
}
