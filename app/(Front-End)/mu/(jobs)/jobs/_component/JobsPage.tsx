"use client";

import { useGetUserAllJobsQuery } from "@/feature/slice/jobs/userJobSlice";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import { useCursorQuery } from "@/hooks/useCursorPagination";
import { useUrlQueryParams } from "@/hooks/useUrlQueryParams";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { JobCard } from "./JobCard";
import { JobCardSection } from "./JobCardSection";
import { JobCardSkeleton } from "./JobCardSkeleton";
import { JobSearchBar } from "./JobSearchBar";

export default function JobsPage() {
  const limit = 10;
  const { params, updateParam } = useUrlQueryParams();
  const activeFilter = params?.employment_type || "all";
  const searchParam = params?.search || "";
  const { data: userData } = useGetUserProfileQuery("userProfile");
  const queryLimit = params?.limit ? Number(params.limit) : limit;

  const {
    data: jobsResponse,
    combinedData: jobs,
    isInitialLoading,
    isFetchingMore,
    hasMore,
    lastElementRef,
    observerRef,
  } = useCursorQuery(useGetUserAllJobsQuery, params, {
    limit: queryLimit,
  });

  const jobsType =
    activeFilter === "all"
      ? "All Jobs"
      : activeFilter === "full_time"
        ? "Full-Time Jobs"
        : activeFilter === "part_time"
          ? "Part-Time Jobs"
          : activeFilter === "short_term"
            ? "Short-Term Jobs"
            : activeFilter === "internship"
              ? "Internships"
              : "Contract Jobs";

  return (
    <main className="w-full">
      <header className="mb-6 flex items-start md:items-center justify-between">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl  font-bold text-headerColor">
            {jobsResponse?.state?.name
              ? `${jobsResponse.state.name} - ${jobsType}`
              : `${jobsType}`}
          </h1>
          <p className="text-sm text-descriptionColor mt-1">
            {jobsType} jobs that will perfectly match your profile.
          </p>
        </div>
        {userData?.subscription?.plan_type == "industry" && (
          <div className="">
            <Link
              className="flex items-center gap-1 text-whiteColor bg-primaryColor px-2  md:px-4 py-2 rounded-lg hover:shadow-lg"
              href={`/mu/post-job-position`}
            >
              <PlusIcon size={16} /> Post A New Job
            </Link>
          </div>
        )}
      </header>

      <JobSearchBar
        activeFilter={activeFilter}
        searchParam={searchParam}
        onFilterChange={(val) => updateParam("employment_type", val, "all")}
        onSearchChange={(val) => updateParam("search", val)}
      />

      {isInitialLoading ? (
        <div className="divide-y space-y-4 divide-gray-100">
          {Array.from({ length: 5 }).map((_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      ) : jobs?.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
          No jobs found matching your criteria.
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 p-3 sm:p-4 space-y-6">
          <JobCardSection
            title={`${jobsType} Time Jobs`}
            subtitle="Because you expressed interest in remote work"
          />

          <div className="divide-y space-y-4 divide-gray-100">
            {jobs?.map((job, index) => (
              <div
                key={job.id}
                ref={index === jobs.length - 1 ? lastElementRef : null}
              >
                <JobCard job={job} />
              </div>
            ))}
          </div>

          {/* Bottom loader while fetching more pages */}
          {isFetchingMore && (
            <div className="divide-y space-y-4 divide-gray-100 pt-2">
              <JobCardSkeleton />
            </div>
          )}

          {/* Sentinel observer element */}
          <div ref={observerRef} className="h-2 w-full pointer-events-none" />
        </div>
      )}
    </main>
  );
}
