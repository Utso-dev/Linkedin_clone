"use client";

import DynamicTable from "@/components/reusable/DynamicTable";
import { getBadgeConfig } from "@/public/demoData/RealData";
import { OpenEyeIcon } from "@/public/svgIcons/Icons";
import Image from "next/image";
import Link from "next/link";

interface ApplicantOverviewProps {
  recentApplicants?: any[];
}

export default function ApplicantOverview({
  recentApplicants = [],
}: ApplicantOverviewProps) {
  const applicantColumns = [
    {
      label: "Job ID",
      accessor: "job_id",
      sortable: false,
      formatter: (val: any) => (
        <span className="text-sm font-semibold text-headerColor px-3">
          {val ? (val.startsWith("#") ? val : `#${val}`) : "—"}
        </span>
      ),
    },
    {
      label: "Applicant Name",
      accessor: "applicant_name",
      formatter: (_: any, row: any) => (
        <div className="flex items-center gap-3 py-2 px-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 overflow-hidden">
            {row.applicant_avatar ? (
              <Image
                src={row.applicant_avatar}
                alt={row.applicant_name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-emerald-600">
                {row.applicant_name?.charAt(0) || "A"}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-headerColor truncate">
              {row.applicant_name}
            </p>
            <p className="text-xs text-descriptionColor truncate mt-0.5">
              {row.applicant_email}
            </p>
          </div>
        </div>
      ),
    },
    {
      label: "Position",
      accessor: "position",
      with: "250px",
      formatter: (val: any, row: any) => (
        <span className="text-sm text-headerColor wrap-break-word max-w-50 font-medium px-3">
          {val || row.job_title}
        </span>
      ),
    },
    {
      label: "Applied On",
      accessor: "applied_on",
      formatter: (val: any) => (
        <span className="text-sm text-descriptionColor px-3">{val}</span>
      ),
    },
    {
      label: "Network",
      accessor: "network",
      formatter: (val: any) => (
        <span className="text-sm text-descriptionColor capitalize px-3">
          {val}
        </span>
      ),
    },
    {
      label: "Status",
      accessor: "status",
      position: "justify-center",
      formatter: (value: any, row: any) => (
        <p
          className={`px-3 py-1 capitalize text-sm rounded-sm text-center border leading-[140%] ${getBadgeConfig(row.status)?.colorClass}`}
        >
          {value}
        </p>
      ),
    },
    {
      label: "Action",
      accessor: "action",
      position: "justify-center",
      formatter: (_, row: any) => (
        <div className="flex items-center justify-center gap-3 px-3">
          <Link
            href={`/mu/job-listing/${row?.job_post_id}/applicants`}
            className="text-gray-400 hover:text-primaryColor transition-colors cursor-pointer"
            title="View Applicant"
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
            Applicant Overview
          </h2>
          <p className="text-xs text-descriptionColor mt-0.5">
            Review and manage latest candidate applications across all jobs
          </p>
        </div>
        {/* <Link
          href="/mu/job-listing"
          className="text-sm font-medium text-headerColor border border-borderColor px-4 py-1.5 rounded-sm hover:bg-bgColor transition-colors"
        >
          View All
        </Link> */}
      </div>

      <div className="overflow-hidden ">
        <DynamicTable
          columns={applicantColumns}
          tableMinWidth="960px"
          data={recentApplicants}
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
          noDataMessage="No recent applicants found."
        />
      </div>
    </div>
  );
}
