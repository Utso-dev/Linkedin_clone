"use client";

import { useGetJobDetailsQuery } from "@/feature/slice/jobs/jobSlice";
import { JobDetails } from "@/lib/type";
import { EditeIcon, JobsIcon, LocationIcon } from "@/public/svgIcons/Icons";
import { Clock3 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import DetailsSkeleton from "./JobsSIngleSkleton";
import JobStatusChange from "./JobStatusChange";
function JobDetailsHeader() {
  const params = useParams();
  const id = params.id as string | number;

  const { data, isLoading, isError } = useGetJobDetailsQuery(id, { skip: !id });

  if (isLoading) return <DetailsSkeleton />;
  const job = (data?.data ?? data) as JobDetails | undefined;
  const location = [job.city?.name, job.state?.name].filter(Boolean).join(", ");
  const salary = `$${Number(job.salary_min).toLocaleString()} - $${Number(job.salary_max).toLocaleString()}`;
  return (
    <div>
      <section className="rounded-xl border border-grayColor2 bg-white p-4  md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="">
            <h1 className="text-base font-bold text-headerColor md:text-lg lg:text-xl 2xl:text-2xl">
              {job.job_title}
            </h1>
            <p className="mt-1 text-base text-descriptionColor">
              Position -{" "}
              <span className="font-semibold text-descriptionColor">
                {job.position}
              </span>
            </p>
          </div>

          <div className="flex gap-2">
            <p className="text-descriptionColor  flex justify-center items-center capitalize bg-bgLightColor text-sm px-5 py-1.5 rounded-full">
              {job.network_type}
            </p>
            <JobStatusChange value={job.status} row={{ id: id }} />
            <Link
              href={`/mu/job-listing/${id}/edite`}
              className="cursor-pointer px-4 rounded-full gap-2 bg-primaryColor text-white flex justify-center items-center"
            >
              <EditeIcon className="w-4 h-4" /> Edit
            </Link>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-descriptionColor">
          <span className="flex items-center gap-1.5">
            <LocationIcon className="h-3.5 w-3.5" />
            {location || "Location unavailable"}
          </span>
          <span className="flex items-center gap-1.5">
            <JobsIcon className="h-3.5 w-3.5" />
            {job.work_mode}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" />
            {job.employment_type}
          </span>
          <span className="flex items-center gap-1.5">{salary}</span>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3  border-grayColor2 ">
          <Link
            href={`/mu/job-listing/${id}/applicants`}
            className="rounded-full bg-primaryColor px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#008999]"
          >
            View Applicants ({job.applications_count ?? 0})
          </Link>
          <span className="text-sm md:text-base text-descriptionColor">
            JOB ID #{job.job_id}
          </span>
        </div>
      </section>
    </div>
  );
}

export default JobDetailsHeader;
