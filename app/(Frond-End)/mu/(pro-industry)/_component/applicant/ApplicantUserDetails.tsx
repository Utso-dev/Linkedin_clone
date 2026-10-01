"use client";

import { useGetJobApplicantsQuery } from "@/feature/slice/jobs/jobSlice";
import { JobApplicationDetailsType } from "@/lib/type";
import {
  Download,
  Globe,
  Link as LinkIcon,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";
import Link from "next/link";
import ApplicantDetailsSkeleton from "./ApplicantDetailsSkeleton";
import ApplicantError from "./ApplicantError";
import ApplicantsUserHeader from "./ApplicantsUserHeader";

function ApplicantUserDetails({ applicantId }: { applicantId: string }) {
  const {
    data: responseData,
    isLoading,
    isError,
    refetch,
  } = useGetJobApplicantsQuery(applicantId, {
    skip: !applicantId,
  });

  if (isLoading) {
    return <ApplicantDetailsSkeleton />;
  }

  const applicant = (responseData?.data ?? responseData) as
    | JobApplicationDetailsType
    | undefined;

  if (isError || !applicant) {
    return <ApplicantError refetch={refetch} />;
  }

  // Derive display data
  const candidateName =
    applicant.full_name || applicant.applicant?.name || "Candidate";

  const resumeFileName = `${candidateName.replace(/\s+/g, "_")}_Resume.pdf`;

  return (
    <div className="w-full pb-8">
     
        <ApplicantsUserHeader applicant={applicant} />
     
    
     

      {/* ================= MAIN CONTENT GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
        <div className="lg:col-span-3 space-y-4">
          <section className="rounded-xl border border-grayColor2 bg-white p-5 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-headerColor mb-3">
              About Candidate
            </h2>
            <p className="text-xs md:text-sm text-descriptionColor leading-relaxed whitespace-pre-line">
              {applicant.about_yourself ||
                applicant.cover_letter ||
                "No candidate description provided."}
            </p>
          </section>
          <section className="rounded-xl border border-grayColor2 bg-white p-5 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-headerColor mb-3">
              Cover Letter
            </h2>
            <div className="text-xs md:text-sm text-descriptionColor leading-relaxed space-y-3">
              <p>Dear Hiring Manager,</p>
              <p className="whitespace-pre-line leading-relaxed">
                {applicant.cover_letter ||
                  "I am excited to apply for this position and contribute my skills and experience to your organization."}
              </p>
              <p className="pt-2">Sincerely,</p>
              <p className="font-semibold text-headerColor">{candidateName}</p>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Overview, Skills, Attachments, Links, Submission Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Candidate Overview Card */}
          <section className="rounded-xl border border-grayColor2 bg-white p-5">
            <h2 className="text-base md:text-lg font-semibold text-headerColor mb-4">
              Candidate Overview
            </h2>
            <div className="space-y-3.5 text-xs md:text-sm">
              <div className="flex justify-between items-center">
                <span className="text-descriptionColor">Total Experience</span>
                <span className="font-semibold text-headerColor">
                  {applicant.experiences || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-descriptionColor">Expected Salary</span>
                <span className="font-semibold text-headerColor">
                  {applicant.expected_salary
                    ? `$${Number(applicant.expected_salary).toLocaleString()}`
                    : "Negotiable"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-descriptionColor">
                  Experience Required
                </span>
                <span className="font-semibold text-headerColor">
                  {applicant.job?.experience || "1 Year"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-descriptionColor">
                  Employment Offering
                </span>
                <span className="font-semibold text-headerColor">
                  {applicant.job?.employment_offering ||
                    applicant.job?.work_mode ||
                    "State and Institution"}
                </span>
              </div>
            </div>
          </section>

          {/* Skills and Expertise Card */}
          <section className="rounded-xl border border-grayColor2 bg-white p-5">
            <h2 className="text-base md:text-lg font-semibold text-headerColor mb-3.5">
              Skills and Expertise
            </h2>
            <div className="flex flex-wrap gap-2">
              {applicant.skills && applicant.skills.length > 0 ? (
                applicant.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-md font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-descriptionColor">
                  No specific skills listed
                </span>
              )}
            </div>
          </section>

          {/* Attachments Card */}
          <section className="rounded-xl border border-grayColor2 bg-white p-5">
            <h2 className="text-base md:text-lg font-semibold text-headerColor mb-3.5">
              Attachments
            </h2>
            {applicant.resume_url ? (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0 shadow-2xs">
                    <span className="text-[11px] font-black text-red-600 tracking-wider">
                      PDF
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4
                      className="text-xs md:text-sm font-semibold text-headerColor truncate"
                      title={resumeFileName}
                    >
                      {resumeFileName}
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">450KB</p>
                  </div>
                </div>
                <Link
                  href={applicant.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="w-full py-2.5 rounded-lg bg-primaryColor hover:bg-[#008999] text-white text-xs md:text-sm font-medium flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Now</span>
                </Link>
              </div>
            ) : (
              <p className="text-xs text-descriptionColor">
                No attachments uploaded
              </p>
            )}
          </section>

          {/* Links Card */}
          {(applicant.linkedin_url || applicant.portfolio_url) && (
            <section className="rounded-xl border border-grayColor2 bg-white p-5">
              <h2 className="text-base md:text-lg font-semibold text-headerColor mb-3.5">
                Links
              </h2>
              <div className="space-y-2.5">
                {applicant.linkedin_url && (
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 text-gray-500 shadow-2xs">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-gray-400 font-medium">
                        Linkedin Profile
                      </p>
                      <Link
                        href={
                          applicant.linkedin_url.startsWith("http")
                            ? applicant.linkedin_url
                            : `https://${applicant.linkedin_url}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs md:text-sm font-medium text-primaryColor hover:underline truncate block mt-0.5"
                      >
                        {applicant.linkedin_url.replace(/^https?:\/\//, "")}
                      </Link>
                    </div>
                  </div>
                )}

                {applicant.portfolio_url && (
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 text-gray-500 shadow-2xs">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-gray-400 font-medium">
                        Portfolio website
                      </p>
                      <Link
                        href={
                          applicant.portfolio_url.startsWith("http")
                            ? applicant.portfolio_url
                            : `https://${applicant.portfolio_url}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs md:text-sm font-medium text-primaryColor hover:underline truncate block mt-0.5"
                      >
                        {applicant.portfolio_url.replace(/^https?:\/\//, "")}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
          {/* Submission Details Card */}
          <section className="rounded-xl bg-[#F8FAFC] border border-grayColor2 p-4">
            <h4 className="text-xs md:text-sm font-semibold text-headerColor mb-1.5">
              Submission Details
            </h4>
            <p className="text-xs md:text-sm text-descriptionColor">
              Submitted for:{" "}
              {applicant.job?.industry?.name ||
                applicant.job?.job_title ||
                "Betopia Group"}
            </p>
            <p className="text-xs md:text-sm text-descriptionColor mt-1">
              Date: {applicant.applied_at || "Sep 28, 2026"}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ApplicantUserDetails;
