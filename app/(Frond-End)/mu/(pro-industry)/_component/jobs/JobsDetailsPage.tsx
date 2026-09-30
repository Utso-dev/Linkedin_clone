"use client";

import { useGetJobDetailsQuery } from "@/feature/slice/jobs/jobSlice";
import { JobDetails } from "@/lib/type";
import {
  EditeIcon,
  EmailIcon,
  GlobalIcon,
  JobsIcon,
  LocationIcon,
  PhoneIcon,
  ScheduleIcon,
} from "@/public/svgIcons/Icons";
import { Clock3 } from "lucide-react";
import Link from "next/link";
import DetailsSkeleton from "./JobsSIngleSkleton";
import JobStatusChange from "./JobStatusChange";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-descriptionColor text-sm lg:text-base">
      <span className="">{label}</span>
      <span className="text-right font-semibold ">{value}</span>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-sectionColor px-3 py-3">
      <span className="text-descriptionColor">{icon}</span>
      <div className="min-w-0 text-sm md:text-base text-descriptionColor">
        <p className="text-descriptionColor">{label}</p>
        {href ? (
          <Link
            href={href}
            className="break-all font-semibold text-primaryColor hover:underline"
          >
            {value}
          </Link>
        ) : (
          <span
            className={`break-all font-semibold ${href ? "text-primaryColor" : "text-descriptionColor"}`}
          >
            {value}
          </span>
        )}
      </div>
    </div>
  );
}

function JobsDetailsPage({ id }: { id: string }) {
  const { data, isLoading, isError } = useGetJobDetailsQuery(id, { skip: !id });

  if (isLoading) return <DetailsSkeleton />;

  const job = (data?.data ?? data) as JobDetails | undefined;

  if (isError || !job)
    return (
      <div className="container py-12 text-center text-sm text-descriptionColor">
        Unable to load this job details.
      </div>
    );

  ;

  return (
    <div className=" pb-5 md:pb-8">
      

      <div className="mt-3 grid grid-cols-1 items-start gap-3 lg:grid-cols-5">
        <section className="rounded-xl border border-grayColor2 bg-white p-5  md:p-6 lg:col-span-3">
          <h2 className="mb-3 text-base md:text-lg lg:text-xl font-semibold text-headerColor">
            Job Description
          </h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-descriptionColor">
            {job.job_description}
          </p>
          <div className="mt-6 grid grid-cols-1 gap-5 text-sm text-descriptionColor md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold text-headerColor">
                Position Details
              </h3>
              <p>
                Career Level: <strong>{job.level}</strong>
              </p>
              <p>
                Experience: <strong>{job.experience}</strong>
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-headerColor">
                Employment
              </h3>
              <p>
                Network: <strong>{job.network_type}</strong>
              </p>
              <p>
                Offering: <strong>{job.employment_offering}</strong>
              </p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-bold text-headerColor">
              Position Tags &amp; Skills:
            </h3>
            <div className="flex flex-wrap gap-2">
              {(job.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-grayColor2 bg-bgColor px-2.5 py-1 text-xs text-descriptionColor"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
        <div className="space-y-3 lg:col-span-2">
          <section className="rounded-xl border border-grayColor2 bg-white p-5 ">
            <h2 className="mb-2 border-b border-dashed border-grayColor2 pb-3 text-base md:text-lg lg:text-xl font-semibold text-headerColor">
              Position Overview
            </h2>
            <div className="space-y-2.5">
              <InfoRow label="Work Mode" value={job.work_mode} />
              <InfoRow label="Employment Type" value={job.employment_type} />
              <InfoRow label="Career Level" value={job.level} />
              <InfoRow label="Experience Required" value={job.experience} />
              <InfoRow
                label="Employment Offering"
                value={job.employment_offering}
              />
            </div>
          </section>
          <section className="rounded-xl border border-grayColor2 bg-white p-5 ">
            <h2 className="mb-2 border-b border-dashed border-grayColor2 pb-3 text-base md:text-lg lg:text-xl font-semibold text-headerColor">
              Posting Schedule
            </h2>
            <div className="space-y-2">
              <ContactRow
                icon={<ScheduleIcon className="h-5 w-5" />}
                label="Start Date"
                value={job.announcement_start_date}
              />
              <ContactRow
                icon={<ScheduleIcon className="h-5 w-5" />}
                label="End Date"
                value={job.announcement_end_date}
              />
            </div>
          </section>
          <section className="rounded-xl border border-grayColor2 bg-white p-5 ">
            <h2 className="mb-2 border-b border-dashed border-grayColor2 pb-3 text-base md:text-lg lg:text-xl font-semibold text-headerColor">
              Contact Us
            </h2>
            <div className="space-y-2">
              <ContactRow
                icon={<EmailIcon className="h-5 w-5" />}
                label="Email Address"
                value={job.email}
                href={`mailto:${job.email}`}
              />
              <ContactRow
                icon={<PhoneIcon className="h-5 w-5" />}
                label="Phone Number"
                value={job.phone_number}
                href={`tel:${job.phone_number}`}
              />
              <ContactRow
                icon={<GlobalIcon className="h-5 w-5" />}
                label="Website"
                value={job.website}
                href={job.website}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default JobsDetailsPage;
