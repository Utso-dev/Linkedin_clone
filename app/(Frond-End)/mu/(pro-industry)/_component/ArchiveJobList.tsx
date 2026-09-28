"use client";

import DynamicTable from "@/components/reusable/DynamicTable";
import SelecteInputField from "@/components/reusable/InputFiled/SelecteInputField";
import RootDialog from "@/components/reusable/RootDialog";
import Search from "@/components/reusable/Search";
import {
  useGetJobsArchiveQuery,
  useStatusUpdateForJobsMutation,
} from "@/feature/slice/jobs/jobSlice";
import {
  AlertCircle,
  Archive,
  ArrowLeft,
  Briefcase,
  Building2,
  Eye,
  FileText,
  Pencil,
  Plus,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import CreateJobsFrom from "./CreateJobsFrom";
import { JobItem } from "./JobListCard";
import JoblistSkleton from "./JoblistSkleton";

export default function ArchiveJobList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useStatusUpdateForJobsMutation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedJobForView, setSelectedJobForView] = useState<JobItem | null>(
    null,
  );

  // Status param from URL (defaults to "all")
  const currentStatusParam = searchParams.get("status") || "all";

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

  // Helper to update any URL search parameter
  const updateUrlParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== "current_page" && params.has("current_page")) {
      params.set("current_page", "1");
    }
    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  };

  // Helper to clear all active filters
  const clearAllFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  // Handle single job row status update
  const handleStatusChange = async (
    jobId: number | string,
    newStatus: string,
  ) => {
    const payload: { status: string; rejection_reason?: string } = {
      status: newStatus,
    };

    if (newStatus === "rejected") {
      payload.rejection_reason =
        "The salary range does not meet the industry standard and company details are incomplete.";
    }

    try {
      const res = await updateStatus({
        id: jobId,
        data: payload,
      }).unwrap();
      toast.success(res?.message || `Job status updated to ${newStatus}`);
    } catch (error: any) {
      console.error("Status update error:", error);
      toast.error(error?.data?.message || "Failed to update job status");
    }
  };

  // Construct query parameters for the API from URL searchParams
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

  // Fetch archived jobs from API
  const {
    data: responseData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetJobsArchiveQuery(queryParams);

  // Extract jobs array
  const rawJobs: JobItem[] = useMemo(() => {
    return (responseData?.data || []) as JobItem[];
  }, [responseData]);

  // Client-side search and status filtering (fallback & instant response)
  const filteredJobs = useMemo(() => {
    const searchVal = (searchParams.get("search") || "").toLowerCase().trim();
    const statusVal = searchParams.get("status") || "all";

    return rawJobs.filter((job) => {
      // Search match
      const matchesSearch =
        !searchVal ||
        job.job_title?.toLowerCase().includes(searchVal) ||
        job.job_id?.toLowerCase().includes(searchVal) ||
        job.industry_name?.toLowerCase().includes(searchVal) ||
        job.location?.toLowerCase().includes(searchVal) ||
        job.short_description?.toLowerCase().includes(searchVal);

      // Status match
      let matchesStatus = true;
      const jobStatus = job.status?.toLowerCase() || "";
      if (statusVal === "active" || statusVal === "published") {
        matchesStatus = jobStatus === "published" || jobStatus === "active";
      } else if (statusVal === "archive" || statusVal === "archived") {
        matchesStatus = jobStatus === "archive" || jobStatus === "archived";
      } else if (statusVal === "expired") {
        matchesStatus = jobStatus === "expired";
      } else if (statusVal === "rejected") {
        matchesStatus = jobStatus === "rejected";
      }

      return matchesSearch && matchesStatus;
    });
  }, [rawJobs, searchParams]);

  // Status Filter button style helper
  const getFilterStyle = (status: string) => {
    switch (status) {
      case "active":
      case "published":
        return "bg-[#dcf4f2] text-[#009dae] border-[#b2e7e2] [&_svg]:text-[#009dae]";
      case "archive":
      case "archived":
        return "bg-[#fef4d8] text-[#d97706] border-[#fde68a] [&_svg]:text-[#d97706]";
      case "expired":
        return "bg-[#f3f4f6] text-[#6b7280] border-[#e5e7eb] [&_svg]:text-[#6b7280]";
      case "rejected":
        return "bg-[#fee2e2] text-[#ef4444] border-[#fecaca] [&_svg]:text-[#ef4444]";
      default:
        return "bg-[#dcf4f2] text-[#009dae] border-transparent [&_svg]:text-[#009dae]";
    }
  };

  // DynamicTable Columns Configuration
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
          {/* Title & Company */}
          <div className="min-w-0">
            <h4
              className="text-sm font-semibold text-headerColor truncate hover:text-[#009dae] transition-colors cursor-pointer max-w-[200px]"
              title={row.job_title}
              onClick={() => setSelectedJobForView(row)}
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
              <span className=" max-w-[140px]" title={row.location || "N/A"}>
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
      formatter: (value: string, row: JobItem) => {
        const currentVal =
          value?.toLowerCase() === "active"
            ? "published"
            : value?.toLowerCase() || "published";

        const getBadgeStyle = (status: string) => {
          switch (status) {
            case "published":
            case "active":
              return "bg-[#dcf4f2] text-[#009dae] border-[#b2e7e2] [&_svg]:text-[#009dae]";
            case "archive":
            case "archived":
              return "bg-[#fef4d8] text-[#d97706] border-[#fde68a] [&_svg]:text-[#d97706]";
            case "rejected":
              return "bg-[#fee2e2] text-[#ef4444] border-[#fecaca] [&_svg]:text-[#ef4444]";
            case "expired":
              return "bg-[#f3f4f6] text-[#6b7280] border-[#e5e7eb] [&_svg]:text-[#6b7280]";
            default:
              return "bg-gray-100 text-gray-700 border-gray-200";
          }
        };

        return (
          <div className="flex justify-center px-2 py-2">
            <div className="w-[120px]">
              <SelecteInputField
                value={currentVal}
                onChange={(val) => handleStatusChange(row.id, val)}
                disabled={isUpdatingStatus}
                options={[
                  { value: "published", label: "Active" },
                  { value: "archive", label: "Archive" },
                  { value: "expired", label: "Expired" },
                  { value: "rejected", label: "Rejected" },
                ]}
                className={`h-9 text-xs md:text-sm font-medium rounded-lg shadow-none border ${getBadgeStyle(currentVal)}`}
              />
            </div>
          </div>
        );
      },
    },
    {
      label: "Action",
      accessor: "action",
      width: "130px",
      position: "justify-center",
      formatter: (_: any, row: JobItem) => (
        <div className="flex items-center justify-center gap-1.5 px-4 py-3.5">
          {/* View icon */}
          <button
            type="button"
            onClick={() => setSelectedJobForView(row)}
            title="View Details"
            className="w-8 h-8 rounded-lg border border-gray-200 text-[#009dae] hover:bg-[#009dae]/10 hover:border-[#009dae]/30 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Applicants icon */}
          <button
            type="button"
            onClick={() =>
              router.push(`/mu/recruiter-dashboard?job_id=${row.id}`)
            }
            title="View Applicants"
            className="w-8 h-8 rounded-lg border border-gray-200 text-[#009dae] hover:bg-[#009dae]/10 hover:border-[#009dae]/30 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* Edit icon */}
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            title="Edit Job"
            className="w-8 h-8 rounded-lg border border-gray-200 text-descriptionColor hover:text-headerColor hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full pb-10">
      {/* Top Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 md:mb-8">
        {/* Title & Subtitle */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-headerColor">
            Archived Job Listings
          </h1>
          <p className="text-sm text-descriptionColor mt-1">
            Manage your archived job postings and track previous positions.
          </p>
        </div>

        {/* Right Header Actions & Filters */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Search Input */}
          <div>
            <Search />
          </div>

          {/* Back to Active Job Listings Button */}
          <Link
            href="/mu/job-listing"
            className="h-10 px-3.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm md:text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer active:scale-98"
          >
            <ArrowLeft className="w-4 h-4 text-gray-500" />
            <span>Active Jobs</span>
          </Link>

          {/* + Post a job position Button */}
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="h-10 px-4 rounded-lg bg-[#009dae] hover:bg-[#008999] text-white text-sm md:text-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Create Job</span>
          </button>

          {/* Status Dropdown Filter using SelecteInputField */}
          <div className="w-[140px]">
            <SelecteInputField
              value={currentStatusParam}
              onChange={(val) => updateUrlParam("status", val)}
              options={[
                { value: "all", label: "All Status" },
                { value: "archive", label: "Archive" },
                { value: "active", label: "Active" },
                { value: "expired", label: "Expired" },
                { value: "rejected", label: "Rejected" },
              ]}
              className={`h-10 text-sm font-medium rounded-lg shadow-none border ${getFilterStyle(currentStatusParam)}`}
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      {isLoading ? (
        /* Loading Skeleton */
        <JoblistSkleton />
      ) : isError ? (
        /* Error State */
        <div className="bg-white rounded-xl border border-red-100 p-8 text-center max-w-md mx-auto my-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-headerColor">
            Failed to load archived jobs
          </h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            An error occurred while fetching your archived job listings. Please
            check your connection and try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 rounded-lg bg-[#009dae] text-white text-sm font-medium hover:bg-[#008999] transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      ) : filteredJobs.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-xl border border-gray-200/80 p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-14 h-14 rounded-full bg-[#fef4d8] text-[#d97706] flex items-center justify-center mx-auto mb-3">
            <Archive className="w-7 h-7" />
          </div>
          <h3 className="text-base md:text-lg font-bold text-headerColor">
            {hasActiveFilters
              ? "No matching archived jobs found"
              : "No archived job postings yet"}
          </h3>
          <p className="text-sm md:text-sm text-gray-500 mt-1 mb-5">
            {hasActiveFilters
              ? "Try adjusting your search query or status filter to see other jobs."
              : "When you archive job postings, they will appear here for your records."}
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
              href="/mu/job-listing"
              className="px-4 py-2 rounded-lg bg-[#009dae] hover:bg-[#008999] text-white text-sm font-medium transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Go to Active Jobs
            </Link>
          </div>
        </div>
      ) : (
        /* Dynamic Table */
        <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden">
          <DynamicTable
            columns={columns}
            data={filteredJobs}
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

      {/* View Job Details Dialog */}
      <RootDialog
        open={!!selectedJobForView}
        setOpen={(open) => !open && setSelectedJobForView(null)}
        ariaLabel="Job Details"
      >
        {selectedJobForView && (
          <div className="p-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#dcf4f2] text-[#009dae] flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
                  {selectedJobForView.industry_logo ? (
                    <img
                      src={selectedJobForView.industry_logo}
                      alt={
                        selectedJobForView.industry_name ||
                        selectedJobForView.job_title
                      }
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-6 h-6 text-[#009dae]" />
                  )}
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-headerColor">
                    {selectedJobForView.job_title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {selectedJobForView.industry_name || "Company"} • Job ID:{" "}
                    {selectedJobForView.job_id}
                  </p>
                </div>
              </div>
            </div>

            <div className="py-4 space-y-4">
              {/* Badges */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Tags & Category
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedJobForView.badges || []).map((badge, idx) => (
                    <span
                      key={idx}
                      className="bg-[#f3f4f6] text-gray-700 text-sm px-3 py-1 rounded-full capitalize font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Location & Stats */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-[11px] text-grayColor1">Location</p>
                  <p className="text-sm font-semibold text-gray-700 mt-0.5 truncate">
                    {selectedJobForView.location || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-grayColor1">Total Views</p>
                  <p className="text-sm font-semibold text-gray-700 mt-0.5">
                    {(selectedJobForView.views_count ?? 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-grayColor1">Applicants</p>
                  <p className="text-sm font-semibold text-gray-700 mt-0.5">
                    {(
                      selectedJobForView.applications_count ?? 0
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Description
                </h4>
                <p className="text-sm text-descriptionColor leading-relaxed max-h-48 overflow-y-auto">
                  {selectedJobForView.short_description ||
                    "No description provided."}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedJobForView(null)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const jobId = selectedJobForView.id;
                  setSelectedJobForView(null);
                  router.push(`/mu/recruiter-dashboard?job_id=${jobId}`);
                }}
                className="px-4 py-2 rounded-lg bg-[#009dae] hover:bg-[#008999] text-white text-sm font-medium transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Applicants</span>
              </button>
            </div>
          </div>
        )}
      </RootDialog>

      {/* Post/Edit a Job Position Modal */}
      <RootDialog
        open={showCreateModal}
        setOpen={setShowCreateModal}
        ariaLabel="Post a Job Position"
      >
        <div className="p-4 md:p-6 h-[85vh] max-h-[85vh] overflow-y-auto">
          <CreateJobsFrom
            onSuccess={() => {
              setShowCreateModal(false);
              refetch();
            }}
          />
        </div>
      </RootDialog>
    </div>
  );
}
