import { JobApplicationDetailsType } from "@/lib/type";
import { LocationIcon, PhoneIcon } from "@/public/svgIcons/Icons";
import { Mail, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ApplicantStatusUpdate from "./ApplicantStatusUpdate";

function ApplicantsUserHeader({
  applicant,
}: {
  applicant: JobApplicationDetailsType;
}) {
  // Derive display data
  const candidateName =
    applicant.full_name || applicant.applicant?.name || "Candidate";
  const userInitials =
    candidateName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AP";
  const subtitle =
    [
      applicant.job?.job_title,
      applicant.job?.position,
      applicant.job?.experience,
      applicant.job?.employment_offering || applicant.job?.work_mode,
    ]
      .filter(Boolean)
      .join(" • ") || "No job details available";
  return (
    <section className="rounded-xl border border-grayColor2 bg-white p-4 md:p-6 mb-4">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Avatar */}
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-primaryColor text-white flex items-center justify-center font-bold text-base md:text-lg shrink-0 border border-gray-100 shadow-2xs">
              {applicant.applicant?.profile_image ? (
                <Image
                  src={applicant.applicant.profile_image}
                  alt={candidateName}
                  width={70}
                  height={70}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{userInitials}</span>
              )}
            </div>

            {/* Name and Subtitle */}
            <div>
              <h1 className="text-base md:text-lg lg:text-xl font-bold text-headerColor">
                {candidateName}
              </h1>
              <p className="text-xs md:text-sm text-descriptionColor mt-0.5">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Right: Status */}
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm text-descriptionColor font-medium">
              Status
            </span>
            <ApplicantStatusUpdate
              row={{
                id: applicant.id,
                application_id: applicant.id,
                status: applicant.status,
              }}
              className="inline-flex"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          {/* Left contact info pills */}
          <div className="flex flex-wrap items-center gap-2">
            {applicant.email && (
              <Link
                href={`mailto:${applicant.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-grayColor2/60 bg-bgLightColor text-xs md:text-sm text-descriptionColor hover:border-primaryColor hover:text-primaryColor transition-colors"
              >
                <Mail className="w-3.5 h-3.5 opacity-70" />
                <span>{applicant.email}</span>
              </Link>
            )}
            {applicant.phone_number && (
              <Link
                href={`tel:${applicant.phone_number}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-grayColor2/60 text-xs md:text-sm text-descriptionColor hover:border-primaryColor hover:text-primaryColor bg-bgLightColor transition-colors"
              >
                <PhoneIcon className="w-3.5 h-3.5 opacity-70" />
                <span>{applicant.phone_number}</span>
              </Link>
            )}
            {applicant.location && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-grayColor2/60 text-xs md:text-sm text-descriptionColor bg-bgLightColor">
                <LocationIcon className="w-3.5 h-3.5 opacity-70" />
                <span>{applicant.location}</span>
              </span>
            )}
          </div>

          {/* Right action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs md:text-sm px-3 py-1.5 rounded-full border border-grayColor2/60 text-descriptionColor bg-bgLightColor">
              Application ID: #{applicant.application_id || applicant.id}
            </span>
            <Link
              href={applicant.email ? `mailto:${applicant.email}` : "#"}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primaryColor hover:bg-primaryColor text-white text-xs md:text-sm font-medium transition cursor-pointer shadow-xs"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Sent Message</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ApplicantsUserHeader;
