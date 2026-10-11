"use client";

import { useSaveUserJobMutation } from "@/feature/slice/jobs/userJobSlice";
import { userJobType } from "@/lib/type";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import toast from "react-hot-toast";
import { FiBookmark } from "react-icons/fi";
import { HiOutlineCheckBadge } from "react-icons/hi2";
import JobApplyAaction from "./JobApplyAaction";
import { Bookmark } from "lucide-react";

export const JobCard = memo(({ job }: { job: userJobType }) => {
  const [saveUserJob, { isLoading, isSuccess, isError }] =
    useSaveUserJobMutation();
  const handleSaveJob = async (id) => {
    try {
      const response = await saveUserJob(id).unwrap();
      console.log(response, "response");
      toast.success(response?.message || "Job saved successfully!");
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };
  return (
    <div className="py-5! first:pt-0 w-full  flex gap-3 last:pb-0 ">
      <div className="relative hidden md:block w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100">
        <Image
          src={job?.company?.logo}
          alt={job?.company?.name}
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>
      <div className=" flex-1">
        <div className="flex items-start w-full justify-between gap-3.5">
          <div className="relative md:hidden w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100">
            <Image
              src={job?.company?.logo}
              alt={job?.company?.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link
              href={`/mu/jobs-details/${job?.id}`}
              className="font-semibold text-headerColor text-sm sm:text-base leading-snug hover:text-primaryColor cursor-pointer"
            >
              {job?.job_title} - Job ID: {job?.job_id}
            </Link>

            <HiOutlineCheckBadge className="text-primaryColor text-base shrink-0" />
          </div>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-primaryColor/20 text-primaryColor">
            {job?.work_mode}
          </span>
        </div>
        <div className="">
          <div className="space-y-1">
            <p className="text-xs text-grayColor1">{job?.company?.name}</p>

            <p className="text-sm text-grayColor1 flex items-center gap-1 flex-wrap pt-1">
              <span>{job?.location}</span>
              <span>•</span>
              <span>{job?.created_at_human}</span>
              {job?.is_applied && (
                <>
                  <span>•</span>
                  <span>Easy Apply</span>
                </>
              )}
            </p>

            {/* <p className="text-base text-primaryColor font-medium pt-1">
              Your profile matches this job
            </p> */}
          </div>

          <div className="gap-3 flex justify-between items-center mt-3 h-full ">
            <JobApplyAaction
              jobData={{
                company_name: job?.company?.name,
                company_id: job?.company?.id,
                jobTitle: job?.job_title,
                jobId: job?.id,
                job_apply: job?.is_applied,
                status: job?.status,
              }}
            />
            <div className="flex items-end gap-3 text-sm  ">
              <p className="text-headerColor">
                {job?.applications_count} applied
              </p>
              <button
                type="button"
                onClick={() => handleSaveJob(job?.id)}
                disabled={isLoading}
                aria-busy={isLoading}
                aria-label={`Save ${job.job_title}`}
                className="flex-col text-grayColor1 justify-center disabled:cursor-not-allowed items-center cursor-pointer gap-1 hover:text-primaryColor transition-colors"
              >
                 {job?.is_saved ? (
                <Bookmark className="w-6 h-6 fill-primaryColor ml-0.75 text-primaryColor" />
                ) : (
                <FiBookmark className="w-6 h-6 ml-0.75" />
                )}
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

JobCard.displayName = "JobCard";
