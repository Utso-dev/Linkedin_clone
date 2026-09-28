"use client";

import Search from "@/components/reusable/Search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetJobsQuery } from "@/feature/slice/jobs/jobSlice";
import {
  AlertCircle,
  Archive,
  Briefcase,
  ChevronDown,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import JobListCard, { JobItem } from "./JobListCard";
import JoblistSkleton from "./JoblistSkleton";

export default function AllJobList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedJobForView, setSelectedJobForView] = useState<JobItem | null>(
    null,
  );

  // Debounce search query so API is not spammed
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Construct query parameters for the API
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {};
    if (debouncedSearch) {
      params.search = debouncedSearch;
    }
    if (statusFilter && statusFilter !== "all") {
      params.status = statusFilter === "active" ? "published" : statusFilter;
    }
    return params;
  }, [debouncedSearch, statusFilter]);

  // Fetch jobs from API with queryParams
  const {
    data: responseData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetJobsQuery(queryParams);

  // Extract jobs array
  const rawJobs: JobItem[] = useMemo(() => {
    return (responseData?.data || []) as JobItem[];
  }, [responseData]);

  // Client-side search and status filtering (fallback & instant response)
  const filteredJobs = useMemo(() => {
    return rawJobs.filter((job) => {
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        job.job_title?.toLowerCase().includes(query) ||
        job.job_id?.toLowerCase().includes(query) ||
        job.industry_name?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query) ||
        job.short_description?.toLowerCase().includes(query);

      // Status match
      let matchesStatus = true;
      const jobStatus = job.status?.toLowerCase() || "";
      if (statusFilter === "active") {
        matchesStatus = jobStatus === "published" || jobStatus === "active";
      } else if (statusFilter === "archive") {
        matchesStatus = jobStatus === "archive" || jobStatus === "archived";
      } else if (statusFilter === "expired") {
        matchesStatus = jobStatus === "expired";
      } else if (statusFilter === "rejected") {
        matchesStatus = jobStatus === "rejected";
      }

      return matchesSearch && matchesStatus;
    });
  }, [rawJobs, searchQuery, statusFilter]);

  // Status Filter label
  const getFilterLabel = () => {
    switch (statusFilter) {
      case "active":
        return "Active";
      case "archive":
        return "Archive";
      case "expired":
        return "Expired";
      case "rejected":
        return "Rejected";
      default:
        return "All Status";
    }
  };

  return (
    <div className="w-full pb-10">
      {/* Top Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 md:mb-8">
        {/* Title & Subtitle */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-headerColor">
            Job Listings
          </h1>
          <p className="text-sm text-descriptionColor mt-1">
            Manage your job postings and track performance.
          </p>
        </div>

        {/* Right Header Actions & Filters */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Search Input */}
          <div>
            <Search />
          </div>
          {/* + Post a job position Button */}
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="h-10 px-4 rounded-lg bg-[#009dae] hover:bg-[#008999] text-white text-xs md:text-sm font-medium flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Post a job position</span>
          </button>

          {/* Archive Filter Toggle Button */}
          <button
            type="button"
            onClick={() =>
              setStatusFilter((prev) =>
                prev === "archive" ? "all" : "archive",
              )
            }
            className={`h-10 px-3.5 rounded-lg border text-xs md:text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer active:scale-98 ${
              statusFilter === "archive"
                ? "bg-[#fef4d8] border-[#fde68a] text-[#d97706]"
                : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
            }`}
          >
            <Archive className="w-4 h-4 text-gray-500" />
            <span>Archive</span>
          </button>

          {/* Status Dropdown Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="h-10 px-3.5 rounded-lg bg-[#dcf4f2] text-[#009dae] hover:bg-[#cbf0ec] text-xs md:text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer outline-none"
              >
                <span>{getFilterLabel()}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-36 bg-white shadow-lg"
            >
              <DropdownMenuItem
                onClick={() => setStatusFilter("all")}
                className="text-xs cursor-pointer py-1.5"
              >
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("active")}
                className="text-xs cursor-pointer py-1.5 text-[#009dae]"
              >
                Active
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("archive")}
                className="text-xs cursor-pointer py-1.5 text-[#d97706]"
              >
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("expired")}
                className="text-xs cursor-pointer py-1.5 text-[#6b7280]"
              >
                Expired
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("rejected")}
                className="text-xs cursor-pointer py-1.5 text-[#ef4444]"
              >
                Rejected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content Section */}
      {isLoading ? (
        /* Loading Skeleton Grid */
        <JoblistSkleton />
      ) : isError ? (
        /* Error State */
        <div className="bg-white rounded-xl border border-red-100 p-8 text-center max-w-md mx-auto my-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-headerColor">
            Failed to load jobs
          </h3>
          <p className="text-xs text-gray-500 mt-1 mb-4">
            An error occurred while fetching your job listings. Please check
            your connection and try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 rounded-lg bg-[#009dae] text-white text-xs font-medium hover:bg-[#008999] transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      ) : filteredJobs.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-xl border border-gray-200/80 p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-14 h-14 rounded-full bg-[#dcf4f2] text-[#009dae] flex items-center justify-center mx-auto mb-3">
            <Briefcase className="w-7 h-7" />
          </div>
          <h3 className="text-base md:text-lg font-bold text-headerColor">
            {searchQuery || statusFilter !== "all"
              ? "No matching jobs found"
              : "No job postings yet"}
          </h3>
          <p className="text-xs md:text-sm text-gray-500 mt-1 mb-5">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search query or status filter to see other jobs."
              : "Create your first professional job listing to connect with qualified candidates."}
          </p>
          <div className="flex items-center justify-center gap-3">
            {(searchQuery || statusFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-lg bg-[#009dae] hover:bg-[#008999] text-white text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Post a job position
            </button>
          </div>
        </div>
      ) : (
        /* 3-Column Job Card Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {filteredJobs.map((job) => (
            <JobListCard
              key={job.id}
              job={job}
              onEdit={() => {
                setShowCreateModal(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Modal 1: Post a Job Position Modal */}
      {/* <RootDialog open={showCreateModal} setOpen={setShowCreateModal}>
        <div className="p-4 md:p-6 h-[85vh] max-h-[85vh] overflow-y-auto"> 
          <CreateJobsFrom
            onSuccess={() => {
              setShowCreateModal(false);
              refetch();
            }}
          />
        </div>
      </RootDialog> */}
    </div>
  );
}
