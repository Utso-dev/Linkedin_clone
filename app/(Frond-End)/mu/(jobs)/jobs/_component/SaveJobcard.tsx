"use client";

import { useSaveUserJobMutation } from "@/feature/slice/jobs/userJobSlice";
import { getApplicationStatusConfig } from "@/lib/utils";
import { Bookmark, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";

export interface SaveJobcardProps {
  job: any;
  onUnsave?: (jobId: string | number) => void;
  showSaveButton?: boolean;
  status?: string;
}

function SaveJobcard({
  job,
  onUnsave,
  showSaveButton = true,
  status,
}: SaveJobcardProps) {
  const [saveUserJob, { isLoading: isUnsaving }] = useSaveUserJobMutation();
  const jobData = job?.job ?? job;
  const company = jobData?.company || jobData?.industry;
  const companyName = company?.name || "Company";
  const jobTitle = jobData?.job_title || jobData?.title || "UI/UX Designer";
  const jobId = jobData?.id || job?.id;

  const workMode = jobData?.work_mode || "Remote";
  const employmentType = jobData?.employment_type || "Full-time";
  const networkType =
    jobData?.network_type || jobData?.category || jobData?.position || "Design";

  const rawDescription =
    jobData?.job_description ||
    jobData?.description ||
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.";
  const cleanDescription = rawDescription
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  const location =
    jobData?.location ||
    [jobData?.city?.name, jobData?.state?.name].filter(Boolean).join(", ") ||
    "California, United States";

  const salaryDisplay =
    jobData?.salary_min && jobData?.salary_max
      ? `$${Number(jobData.salary_min).toLocaleString()} - $${Number(jobData.salary_max).toLocaleString()}`
      : jobData?.salary_min
        ? `$${Number(jobData.salary_min).toLocaleString()}`
        : "$6,200.00";

  const statusConfig = getApplicationStatusConfig(status);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!jobId || isUnsaving) return;

    try {
      const response = await saveUserJob(jobId).unwrap();
      toast.success(response?.message || "Job removed from saved jobs!");
      onUnsave?.(jobId);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update saved job");
    }
  };


  

  return (
    <div className="bg-white rounded-2xl border border-borderColor/80 p-4  hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo */}
            <div className="w-12 h-12 rounded-full bg-bgColor border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
              {company?.logo ? (
                <Image
                  src={company.logo}
                  alt={companyName}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-bold text-lg">
                  {companyName.charAt(0)}
                </div>
              )}
            </div>

            {/* Title & Company */}
            <div className="min-w-0">
              <Link
                href={`/mu/jobs-details/${jobId}`}
                className="text-base sm:text-lg font-bold text-headerColor hover:text-primaryColor transition-colors truncate block leading-snug"
              >
                {jobTitle}
              </Link>
              <p className="text-sm text-grayColor1 truncate mt-0.5">
                {companyName}
              </p>
            </div>
          </div>

          {/* Bookmark Button */}
          {showSaveButton && (
            <button
              type="button"
              onClick={handleToggleSave}
              disabled={isUnsaving}
              className="flex flex-col items-center justify-center text-primaryColor hover:opacity-80 transition cursor-pointer shrink-0 disabled:opacity-50"
              title="Saved job"
            >
              <Bookmark className="w-5 h-5 fill-primaryColor text-primaryColor" />
              <span className="text-[11px] text-grayColor1 font-medium mt-0.5">
                Saved
              </span>
            </button>
          )}
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-2 mt-3.5">
          {employmentType && (
            <span className="bg-bgColor text-grayColor1 text-xs font-medium px-2.5 py-1 rounded-full capitalize">
              {employmentType}
            </span>
          )}
          {workMode && (
            <span className="bg-bgColor text-grayColor1 text-xs font-medium px-2.5 py-1 rounded-full capitalize">
              {workMode}
            </span>
          )}
          {networkType && (
            <span className="bg-bgColor text-grayColor1 text-xs font-medium px-2.5 py-1 rounded-full capitalize">
              {networkType}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-grayColor1 leading-relaxed line-clamp-2 mt-3.5">
          {cleanDescription}
        </p>
      </div>

      {/* Bottom Row: Status Banner or Location/Salary */}
      {status !== undefined ? (
        <div className="mt-4 pt-2">
          <div
            className={`w-full py-2.5 px-4 rounded-lg text-center text-sm font-medium transition-colors select-none ${statusConfig.className}`}
          >
            {statusConfig.label}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 mt-4 pt-2 border-t border-gray-50 text-sm">
          <div title={location} className="flex items-center gap-1.5 text-xs sm:text-sm text-grayColor1 min-w-0 truncate">
            <MapPin className="w-4 h-4 text-grayColor1 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="shrink-0 text-right">
            <span className="text-sm sm:text-base font-bold text-headerColor">
              {salaryDisplay}
            </span>
            <span className="text-xs sm:text-sm text-grayColor1 font-normal">
               /{jobData?.salary_type}
             
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default SaveJobcard;
