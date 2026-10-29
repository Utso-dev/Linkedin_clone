"use client";

import { useGetJobDetailsQuery } from "@/feature/slice/jobs/jobSlice";
import { JobDetails } from "@/lib/type";
import {
  DotIcon,
  EditeIcon,
  JobsIcon,
  LocationIcon,
} from "@/public/svgIcons/Icons";
import { Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import JobApplyAaction from "../../../(jobs)/jobs/_component/JobApplyAaction";
import DetailsSkeleton from "./JobsSIngleSkleton";
import JobStatusChange from "./JobStatusChange";
function JobDetailsHeader() {
  const params = useParams();
  const id = params.id as string | number;

  const pathName = usePathname();
  const { data, isLoading, isError } = useGetJobDetailsQuery(id, { skip: !id });

  if (isLoading) return <DetailsSkeleton />;
  const job = (data?.data ?? data) as JobDetails | undefined;
  const location = [job.city?.name, job.state?.name].filter(Boolean).join(", ");
  const salary = `$${Number(job.salary_min).toLocaleString()} - $${Number(job.salary_max).toLocaleString()}`;
  return (
    <div>
      <section className="rounded-xl border border-grayColor2 bg-white p-4  md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start md:items-center gap-2">
            <div className="relative  w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100">
              <Image
                src={job?.industry?.logo}
                alt={job?.industry?.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="xl:max-w-145 md:max-w-90 lg:max-w-85">
              <h1 className="text-base font-semibold text-headerColor md:text-lg xl:text-xl ">
                {job.job_title}
              </h1>
              <p className="mt-1 text-sm md:text-base text-descriptionColor">
                Position -{" "}
                <span className="font-semibold text-descriptionColor">
                  {job.position}
                </span>
              </p>
            </div>
          </div>

          <div className="flex justify-end w-full md:w-auto items-center gap-2">
            <p className="text-descriptionColor  flex justify-center items-center capitalize bg-bgLightColor text-sm px-5 py-1.5 rounded-full">
              {job.network_type}
            </p>
            {pathName.includes("mu/jobs-details") ? (
              <div>
                <button>
                  <DotIcon />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <JobStatusChange value={job.status} row={{ id: id }} />
                <Link
                  href={`/mu/job-listing/${id}/edite`}
                  className="cursor-pointer px-4 rounded-full gap-2 bg-primaryColor text-white flex justify-center items-center"
                >
                  <EditeIcon className="w-4 h-4" /> Edit
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-descriptionColor">
          <span className="flex items-center gap-1.5">
            <LocationIcon className="h-3.5 w-3.5" />
            {location || "Location unavailable"}
          </span>
          <span className="flex items-center gap-1.5">
            <JobsIcon className="h-3.5 w-3.5" />
            <span className=" capitalize  ">
              {job.work_mode.split("_").join(" ")}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" />

            <span className="capitalize  ">
              {job.employment_type.split("_").join(" ")}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            {salary}/{job?.salary_type}
          </span>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3  border-grayColor2 ">
          {pathName.includes("mu/jobs-details") ? (
            <div>
              <JobApplyAaction
                jobData={{
                  industry_name: job?.industry?.name,
                  industry_id: job?.industry?.id,
                  jobTitle: job?.job_title,
                  jobId: id,
                  job_apply: job?.is_applied,
                  status: job?.status,
                }}
              />
            </div>
          ) : pathName.includes("applicants") ? (
            <Link
              href={`/mu/job-listing/${id}/job-details`}
              className="rounded-full bg-primaryColor px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#008999]"
            >
              View Details
            </Link>
          ) : (
            <Link
              href={`/mu/job-listing/${id}/applicants`}
              className="rounded-full bg-primaryColor px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#008999]"
            >
              View Applicants ({job.applications_count ?? 0})
            </Link>
          )}

          <span className="text-sm md:text-base text-descriptionColor">
            JOB ID #{job.job_id}
          </span>
        </div>
      </section>
    </div>
  );
}

export default JobDetailsHeader;
