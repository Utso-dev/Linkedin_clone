"use client";

import {
  AdvertisementIcon,
  ApplicantIcon,
  JobsIcon,
} from "@/public/svgIcons/Icons";
import { ArchiveIcon } from "lucide-react";

export interface RecruiterCardsData {
  active_positions?: {
    total?: number;
    growth?: string;
    growth_count?: number;
    is_positive?: boolean;
  };
  total_applicants?: {
    total?: number;
    growth?: string;
    growth_count?: number;
    is_positive?: boolean;
  };
  total_job_posts?: {
    total?: number;
  };
  total_archived_jobs?: {
    total?: number;
  };
  total_rejected_jobs?: {
    total?: number;
  };
}

interface RecruiterStateListProps {
  cards?: RecruiterCardsData;
  isLoading?: boolean;
}

function RecruiterStateList({ cards, isLoading }: RecruiterStateListProps) {
  const cardItems = [
    {
      id: "active_positions",
      title: "Active Positions",
      value: cards?.active_positions?.total ?? 0,
      growth: cards?.active_positions?.growth,
      icon: AdvertisementIcon,
      href: "/mu/job-listing",
    },
    {
      id: "total_applicants",
      title: "Total Applicants",
      value: cards?.total_applicants?.total ?? 0,
      growth: cards?.total_applicants?.growth,
      icon: ApplicantIcon,
      href: "/mu/job-listing",
    },
    {
      id: "total_job_posts",
      title: "Total Job Posts",
      value: cards?.total_job_posts?.total ?? 0,
      growth: "Active listings",
      icon: JobsIcon,
      href: "/mu/job-listing",
    },
    {
      id: "archived_jobs",
      title: "Archived Jobs",
      value: cards?.total_archived_jobs?.total ?? 0,
      growth: "Archived listings",
      icon: ArchiveIcon,
      href: "/mu/job-listing",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-borderColor/80 p-3  hover:shadow-md transition-shadow group flex flex-col justify-between"
          >
            <div className="flex items-center  gap-3">
              <div
                className={`w-11 h-11 rounded-xl bg-primaryColor/10 text-primaryColor  flex items-center justify-center`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm  font-semibold text-descriptionColor">
                {item.title}
              </h3>
            </div>
            <div className="mt-2">
                 <h3 className="text-3xl font-bold text-headerColor">
                  {isLoading ? "0" : item.value}
                </h3>
              <div className="flex items-end justify-between mt-1.5">
               
                <span
                  className={`text-xs leading-[132%] text-lightGreenColor2/80 bg-lightGreenColor/60 px-2 py-0.5 font-semibold rounded-full `}
                >
                  {item.growth}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RecruiterStateList;
