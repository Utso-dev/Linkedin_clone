"use client";

import React from "react";
import Image from "next/image";
import { FiBookmark } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";

interface TopJobItem {
  id: string | number;
  company: string;
  role: string;
  logo: string;
  workplaceType: "Remote" | "On-site" | "Hybrid";
  appliedCount: number;
  description: string;
  location: string;
  postedTime: string;
  easyApply: boolean;
}

const TOP_JOBS_DATA: TopJobItem[] = [
  {
    id: 1,
    company: "Financial Fire",
    role: "Entry Level Financial Advisor",
    logo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop&q=60",
    workplaceType: "Remote",
    appliedCount: 455,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem I...",
    location: "United States (Remote)",
    postedTime: "1 Week ago",
    easyApply: true,
  },
  {
    id: 2,
    company: "Financial Fire",
    role: "Entry Level Financial Advisor",
    logo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop&q=60",
    workplaceType: "Remote",
    appliedCount: 455,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem I...",
    location: "United States (Remote)",
    postedTime: "1 Week ago",
    easyApply: true,
  },
];

export default function TopJobsRightbar() {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-[#1D1F2C]">
          Top job picks for you
        </h2>
        <p className="mt-1 text-xs text-[#777986] leading-relaxed">
          Based on your profile, preferences, and activity like applies, searches, and saves
        </p>
      </div>

      {/* Jobs List */}
      <div className="divide-y divide-gray-100">
        {TOP_JOBS_DATA.map((job) => (
          <div key={job.id} className="py-5 first:pt-4 last:pb-0 space-y-3">
            {/* Header: Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-gray-100">
                <Image
                  src={job.logo}
                  alt={job.company}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold text-[#1D1F2C]">
                  {job.company}
                </h3>
                <p className="truncate text-xs text-[#777986]">
                  {job.role}
                </p>
              </div>
            </div>

            {/* Tags & Applied Info */}
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-full bg-[#E6F7F5] px-2.5 py-0.5 font-medium text-primaryColor">
                {job.workplaceType}
              </span>
              <span className="text-[#777986] font-medium">
                {job.appliedCount} applied
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-[#4A4C56] line-clamp-2 leading-relaxed">
              {job.description}
            </p>

            {/* Location & Time meta */}
            <div className="flex items-start gap-1 text-[11px] text-[#777986]">
              <HiOutlineLocationMarker className="mt-0.5 shrink-0 text-sm" />
              <div className="flex flex-wrap items-center gap-1">
                <span>{job.location}</span>
                <span>•</span>
                <span>{job.postedTime}</span>
                {job.easyApply && (
                  <>
                    <span>•</span>
                    <span className="font-medium">Easy Apply</span>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button className="flex-1 rounded-full bg-primaryColor py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-[#008f80]">
                Apply
              </button>
              <button
                type="button"
                aria-label={`Save ${job.role} at ${job.company}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-primaryColor transition-colors hover:bg-gray-50"
              >
                <FiBookmark className="text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}