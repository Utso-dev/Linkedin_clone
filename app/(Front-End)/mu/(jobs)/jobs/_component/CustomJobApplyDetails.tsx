"use client";

import { MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CustomJobApplyDetailsProps {
  job: any;
}

function CustomJobApplyDetails({ job }: CustomJobApplyDetailsProps) {
  const companyName = job?.industry?.name || "Betopia Group Limited";
  const jobLocation =
    [job?.city?.name, job?.state?.name].filter(Boolean).join(", ") ||
    "Dhaka, Bangladesh";
  const jobTitle = job?.job_title || "UI/UX Designer";
  const salaryText =
    job?.salary_min && job?.salary_max
      ? `$${Number(job.salary_min).toLocaleString()} - $${Number(job.salary_max).toLocaleString()}`
      : "$7,800.00 /month";

  return (
    <div className="space-y-4">
      {/* Top Banner Card */}
      <div className="bg-linear-to-r from-[#211a17] to-[#3a2c26] text-white p-4 md:p-5 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-black/40 border border-white/20 shrink-0 flex items-center justify-center">
            {job?.industry?.logo ? (
              <Image
                src={job.industry.logo}
                alt={companyName}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-xl font-bold text-white uppercase">
                {companyName.charAt(0) || "B"}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-white/70 truncate">
              {companyName} • {jobLocation}
            </p>
            <h3 className="text-base sm:text-lg font-bold text-white truncate">
              {jobTitle}
            </h3>
            <p className="text-xs text-white/80">
              {job?.employment_type || "Full-Time"} •{" "}
              {job?.work_mode || "On-Site"}
            </p>
          </div>
        </div>

        <Link
          href={`/mu/message?industry=${job?.industry?.id || ""}`}
          className="bg-white hover:bg-gray-100 text-headerColor px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0 transition shadow-xs"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Message
        </Link>
      </div>

      {/* Metric Cards Row 1: Level & Salary Range */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-bgLightColor border border-borderColor rounded-xl p-3 text-center">
          <p className="text-xs text-grayColor1">Level</p>
          <p className="text-sm sm:text-base font-bold text-headerColor mt-0.5">
            {job?.level || "Mid-Senior"}
          </p>
        </div>
        <div className="bg-bgLightColor border border-borderColor rounded-xl p-3 text-center">
          <p className="text-xs text-grayColor1">Salary Range</p>
          <p className="text-sm sm:text-base font-bold text-headerColor mt-0.5">
            {salaryText}
          </p>
        </div>
      </div>

      {/* Metric Cards Row 2: Experience, Job Type & Work Type */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-bgLightColor border border-borderColor rounded-xl p-3 text-center">
          <p className="text-xs text-grayColor1">Experience</p>
          <p className="text-sm sm:text-base font-bold text-headerColor mt-0.5">
            {job?.experience || "2 Years"}
          </p>
        </div>
        <div className="bg-bgLightColor border border-borderColor rounded-xl p-3 text-center">
          <p className="text-xs text-grayColor1">Job Type</p>
          <p className="text-sm sm:text-base font-bold text-headerColor mt-0.5">
            {job?.employment_type || "Full-Time"}
          </p>
        </div>
        <div className="bg-bgLightColor border border-borderColor rounded-xl p-3 text-center">
          <p className="text-xs text-grayColor1">Work Type</p>
          <p className="text-sm sm:text-base font-bold text-headerColor mt-0.5">
            {job?.work_mode || "On-Site"}
          </p>
        </div>
      </div>

      {/* Job Description & Details */}
      <div className="space-y-5 text-sm text-descriptionColor pt-2">
        <div>
          <h4 className="text-base font-bold text-headerColor mb-2">
            Job Description
          </h4>
          {job?.job_description ? (
            <div
              dangerouslySetInnerHTML={{ __html: job.job_description }}
              className="text-xs sm:text-sm leading-relaxed text-descriptionColor whitespace-pre-line"
            />
          ) : (
            <p className="text-xs sm:text-sm leading-relaxed text-descriptionColor">
              We are seeking a dedicated and passionate Assistant Professor of
              Psychology to join our expanding academic and clinical department.
              In this position, you will be responsible for teaching
              undergraduate and graduate students, contributing to
              interdisciplinary psychological research, and conducting
              supervised clinical training.
            </p>
          )}
        </div>

        <div>
          <h4 className="text-xs sm:text-sm font-bold text-headerColor mb-2.5">
            Position Tags & Skills:
          </h4>
          <div className="flex flex-wrap gap-2">
            {(job?.tags && job.tags.length > 0
              ? job.tags
              : [
                  "Clinical Psychologist",
                  "Research Assistant",
                  "Professor of Psychology",
                  "Higher Education",
                ]
            ).map((tag: string, index: number) => (
              <span
                key={index}
                className="rounded-full border border-grayColor2 bg-white px-3 py-1 text-xs text-descriptionColor"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomJobApplyDetails;
