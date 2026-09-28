"use client";

import React, { useState } from "react";
import {
  MapPin,
  Eye,
  FileText,
  Pencil,
  ChevronDown,
  Building2,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStatusUpdateForJobsMutation } from "@/feature/slice/jobs/jobSlice";
import toast from "react-hot-toast";

export interface JobItem {
  id: number;
  job_id: string;
  slug: string;
  job_title: string;
  industry_name: string;
  industry_logo: string | null;
  status: string;
  badges: string[];
  short_description: string;
  location: string;
  views_count: number;
  applications_count: number;
}

interface JobListCardProps {
  job: JobItem;
  onView?: (job: JobItem) => void;
  onEdit?: (job: JobItem) => void;
  onStatusChange?: (id: number, newStatus: string) => void;
}

export default function JobListCard({
  job,
  onView,
  onEdit,
  onStatusChange,
}: JobListCardProps) {
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useStatusUpdateForJobsMutation();
  const [currentStatus, setCurrentStatus] = useState(
    job.status?.toLowerCase() || "published",
  );

  // Status visual configurations
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "published":
        return {
          label: "Active",
          key: "published",
          className: "bg-[#dcf4f2] text-[#009dae] hover:bg-[#cbf0ec]",
        };
      case "archive":
      case "archived":
        return {
          label: "Archive",
          key: "archive",
          className: "bg-[#fef4d8] text-[#d97706] hover:bg-[#feeec0]",
        };
      case "rejected":
        return {
          label: "Rejected",
          key: "rejected",
          className: "bg-[#fee2e2] text-[#ef4444] hover:bg-[#fecaca]",
        };
      case "expired":
        return {
          label: "Expired",
          key: "expired",
          className: "bg-[#f3f4f6] text-[#6b7280] hover:bg-[#e5e7eb]",
        };
      default:
        return {
          label: status.charAt(0).toUpperCase() + status.slice(1),
          key: status,
          className: "bg-[#f3f4f6] text-[#4b5563] hover:bg-[#e5e7eb]",
        };
    }
  };

  const statusBadge = getStatusBadge(currentStatus);

  const handleStatusSelect = async (newStatus: string) => {
    if (newStatus === currentStatus) return;
    setCurrentStatus(newStatus);
    try {
      if (onStatusChange) {
        onStatusChange(job.id, newStatus);
      } else {
        await updateStatus({
          id: job.id,
          data: { status: newStatus },
        }).unwrap();
        toast.success(`Job marked as ${newStatus}`);
      }
    } catch (error: any) {
      console.error("Status update error:", error);
      setCurrentStatus(job.status?.toLowerCase() || "published");
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-4 md:p-5 flex flex-col justify-between hover:shadow-md transition-all duration-200">
      <div>
        {/* Top Header: Logo + Title/Company + Status Dropdown */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo */}
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#dcf4f2] text-[#009dae] flex items-center justify-center shrink-0 overflow-hidden border border-gray-100/50">
              {job.industry_logo ? (
                <img
                  src={job.industry_logo}
                  alt={job.industry_name || job.job_title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-[#009dae]"
                >
                  <path d="m7.5 4.27 9 5.15" />
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="m3.3 7 8.7 5 8.7-5" />
                  <path d="M12 22V12" />
                </svg>
              )}
            </div>

            {/* Title & Company */}
            <div className="min-w-0">
              <h3
                className="text-sm  font-bold text-headerColor truncate cursor-pointer hover:text-[#009dae] transition-colors"
                title={job.job_title}
                onClick={() => onView?.(job)}
              >
                {job.job_title}
              </h3>
              <p
                className="text-xs text-gray-500 font-normal mt-0.5 truncate"
                title={job.industry_name}
              >
                {job.industry_name || "xyz Hospital"}
              </p>
            </div>
          </div>

          {/* Status Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                disabled={isUpdatingStatus}
                className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 shrink-0 transition-colors cursor-pointer outline-none ${statusBadge.className}`}
              >
                <span>{statusBadge.label}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 bg-white">
              <DropdownMenuItem
                onClick={() => handleStatusSelect("published")}
                className="flex items-center justify-between text-xs cursor-pointer py-1.5"
              >
                <span>Active</span>
                {["published", "active"].includes(currentStatus) && (
                  <Check className="w-3.5 h-3.5 text-[#009dae]" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusSelect("archive")}
                className="flex items-center justify-between text-xs cursor-pointer py-1.5"
              >
                <span>Archive</span>
                {["archive", "archived"].includes(currentStatus) && (
                  <Check className="w-3.5 h-3.5 text-[#d97706]" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusSelect("expired")}
                className="flex items-center justify-between text-xs cursor-pointer py-1.5"
              >
                <span>Expired</span>
                {currentStatus === "expired" && (
                  <Check className="w-3.5 h-3.5 text-[#6b7280]" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusSelect("rejected")}
                className="flex items-center justify-between text-xs cursor-pointer py-1.5 text-red-600 focus:text-red-600"
              >
                <span>Rejected</span>
                {currentStatus === "rejected" && (
                  <Check className="w-3.5 h-3.5 text-red-600" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Badges / Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          {(job.badges || ["Full-time", "Remote", "Psychologist"]).map(
            (badge, idx) => (
              <span
                key={idx}
                className="bg-[#f3f4f6] text-gray-600 text-[11px] md:text-xs px-2.5 py-0.5 rounded-full capitalize font-normal"
              >
                {badge}
              </span>
            ),
          )}
        </div>

        {/* Short Description */}
        <p className="text-xs md:text-[13px] text-gray-500 line-clamp-2 mt-3 leading-relaxed min-h-[36px]">
          {job.short_description ||
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the indust..."}
        </p>
      </div>

      <div>
        {/* Dashed Divider */}
        <div className="border-b border-dashed border-gray-200 my-3.5" />

        {/* Location & Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 gap-1.5 mb-4">
          <div className="flex items-center gap-1 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{job.location || "California"}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Eye className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>{(job.views_count ?? 0).toLocaleString()} Views</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>
              {(job.applications_count ?? 0).toLocaleString()} Applicants
            </span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 pt-1">
          {/* Applicants Button */}
          <button
            type="button"
            className="flex-1 py-2 px-3 rounded-lg bg-[#009dae] hover:bg-[#008999] text-white text-xs md:text-sm font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-98"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Applicants</span>
          </button>

          {/* View Button */}
          <button
            type="button"
            onClick={() => onView?.(job)}
            className="flex-1 py-2 px-3 rounded-lg border border-[#009dae] text-[#009dae] bg-white hover:bg-[#009dae]/5 text-xs md:text-sm font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-98"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </button>

          {/* Edit Button */}
          <button
            type="button"
            onClick={() => onEdit?.(job)}
            className="w-9 h-9 rounded-lg border border-gray-200 text-gray-600 hover:text-headerColor hover:bg-gray-50 flex items-center justify-center shrink-0 transition-colors cursor-pointer active:scale-98"
            title="Edit Position"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}