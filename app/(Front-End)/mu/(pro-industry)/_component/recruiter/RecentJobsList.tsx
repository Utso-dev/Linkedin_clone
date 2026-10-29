"use client";

import DynamicTable from "@/components/reusable/DynamicTable";
import { OpenEyeIcon } from "@/public/svgIcons/Icons";
import { Eye, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface RecentJobsListProps {
  recentJobs?: any[];
}

export default function RecentJobsList({
  recentJobs = [],
}: RecentJobsListProps) {
  const recentJobsColumns = [
    {
      label: "Job Title",
      accessor: "job_title",
      width: "330px",
      formatter: (_: any, row: any) => (
        <div className="flex items-center gap-3 py-2 px-3">
          <div className="w-10 h-10 rounded-full bg-bgColor border border-borderColor/60 overflow-hidden shrink-0 flex items-center justify-center">
            {row.industry_logo ? (
              <Image
                src={row.industry_logo}
                alt={row.industry_name || "Company"}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-primaryColor">
                {(row.industry_name || row.job_title || "J").charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <Link
              href={`/mu/recruiter-dashboard/${row.id}`}
              className="block w-full max-w-82.5 text-sm font-semibold text-headerColor hover:text-primaryColor truncate transition-colors"
              
            >
              {row.job_title}
            </Link>

            <p className="text-sm text-descriptionColor truncate mt-0.5">
              {row.industry_name}
            </p>
            <div className="flex items-center gap-1 text-sm text-descriptionColor mt-0.5 ">
              
              <span className="truncate max-w-40">
                {row?.location }
              </span>
            </div>
          </div>
        </div>
      ),
    },

    {
      label: "Type & Badges",
      accessor: "badges",
      formatter: (badges: string[]) => (
        <div className="flex flex-wrap items-center gap-1.5 px-3">
          {(badges || []).map((badge, idx) => (
            <span
              key={idx}
              className="text-sm font-medium leading-[120%] px-2.5 py-0.5 rounded-full bg-bgColor text-descriptionColor capitalize"
            >
              {badge.replace(/_/g, " ")}
            </span>
          ))}
        </div>
      ),
    },
    // {
    //   label: "Location",
    //   accessor: "location",
    //   formatter: (val: any) => (
    //     <div className="flex items-center gap-1 text-xs text-descriptionColor px-3">
    //       <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
    //       <span className="truncate max-w-40">{val || "Remote"}</span>
    //     </div>
    //   ),
    // },
    {
      label: "Status",
      accessor: "status",
      formatter: (val: any) => (
        <div className="px-3">
          <span className="px-2.5 py-1 rounded-full text-sm font-medium capitalize bg-lightGreenColor2/10 text-lightGreenColor2 border border-lightGreenColor2/50">
            {val === "published" ? "Active" : val}
          </span>
        </div>
      ),
    },
    {
      label: "Metrics",
      accessor: "applications_count",
      formatter: (_: any, row: any) => (
        <div className="text-sm text-descriptionColor space-y-0.5 px-3">
          <p className="flex items-center gap-1 font-medium text-headerColor">
            <Users className="w-3.5 h-3.5 text-primaryColor" />
            <span>{row.applications_count || 0} Applicants</span>
          </p>
          <p className="flex items-center gap-1 text-gray-400">
            <Eye className="w-3.5 h-3.5" />
            <span>{row.views_count || 0} Views</span>
          </p>
        </div>
      ),
    },
    {
      label: "Action",
      accessor: "actions",
      position: "justify-end",
      formatter: (_: any, row: any) => (
        <div className="flex items-center justify-end gap-2 pr-3">
          <Link
            href={`/mu/recruiter-dashboard/${row.id}`}
            className="p-1.5 rounded-lg border border-borderColor hover:bg-primaryColor text-grayColor1 hover:text-whiteColor transition-colors"
            title="View Job"
          >
            <OpenEyeIcon className="w-4 h-4" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-headerColor">
            Recent Job Listings
          </h2>
          <p className="text-xs text-descriptionColor mt-0.5">
            Overview of your most recently published positions
          </p>
        </div>
        <Link
          href="/mu/job-listing"
          className="text-sm font-medium text-headerColor border border-borderColor px-4 py-1.5 rounded-sm hover:bg-bgColor transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="overflow-hidden">
        <DynamicTable
          columns={recentJobsColumns}
          data={recentJobs}
          tableMinWidth="960px"
          header={{
            bg: "#F9FAFB",
            padding: "12px 14px",
            text: "#4B5563",
            fontWeight: "600",
            fontSize: "13px",
          }}
          rowStyle={{
            hover: true,
            hoverbg: "hover:bg-gray-50/70",
            border: "border-b border-x-0 border-borderColor/60",
          }}
          noDataMessage="No recent job listings found."
        />
      </div>
    </div>
  );
}
