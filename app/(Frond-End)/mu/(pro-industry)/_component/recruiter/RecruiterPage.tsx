"use client";

import { useGetRecruiterDashboardDataQuery } from "@/feature/slice/jobs/jobSlice";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import DetailsSkeleton from "../jobs/JobsSIngleSkleton";
import ApplicantOverview from "./ApplicantOverview";
import RecentJobsList from "./RecentJobsList";
import RecruiterApplicantOverview from "./RecruiterApplicantOverview";
import RecruiterStateList from "./RecruiterStateList";

export default function RecruiterPage() {
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetRecruiterDashboardDataQuery({});

  const dashboardData = response?.data;
  const cards = dashboardData?.cards;
  const recentJobs = dashboardData?.recent_jobs || [];
  const applicantsChart = dashboardData?.graph;
  const activityFeed = dashboardData?.activity_feed || [];
  const recentApplicants = dashboardData?.recent_applicants || [];

  return (
    <div className="w-full space-y-7 pb-10">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-headerColor">
            Recruiter Dashboard
          </h1>
          <p className="text-sm md:text-base text-descriptionColor mt-1">
            Manage your job postings, review applicants, and track hiring
            performance.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/mu/post-job-position"
            className="flex items-center gap-2 bg-primaryColor hover:bg-primaryColor/90 text-white px-5 py-2.5 rounded-sm text-sm font-medium transition-colors cursor-pointer shadow-xs"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Post a job position</span>
          </Link>
        </div>
      </div>
      <div>
        {isLoading ? (
          <DetailsSkeleton />
        ) : (
          <div className="space-y-7">
            {/* Top 4 Metric Cards */}
            <RecruiterStateList cards={cards} isLoading={isLoading} />

            {/* Section 2: Recent Job Listings */}
            <RecentJobsList recentJobs={recentJobs} />

            {/* Section 3: Middle Row (Chart + Activity Feed) */}
            <RecruiterApplicantOverview
              applicantsChart={applicantsChart}
              activityFeed={activityFeed}
            />

            {/* Section 4: Applicant Overview */}
            <ApplicantOverview recentApplicants={recentApplicants} />
          </div>
        )}
      </div>
    </div>
  );
}
