import { useSaveUserJobMutation } from "@/feature/slice/jobs/userJobSlice";
import { formatNumberIntoK } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiBookmark } from "react-icons/fi";
import { Employment } from "../page";

type PropType = {
  data: Employment;
};

export default function EmploymentCard({ data }: PropType) {
  const companyName =
    data?.industry?.name || data?.company_name || "Company Name";
  const jobTitle = data?.job_title || data?.title || "Job title";
  const timeDisplay =
    data?.created_at_human ||
    (data?.created_at
      ? formatDistanceToNow(new Date(data.created_at), { addSuffix: true })
      : "0 min ago");
  const [saveUserJob, { isLoading, isSuccess, isError }] =
    useSaveUserJobMutation();
  const handleSaveJob = async (id) => {
    try {
      const response = await saveUserJob(id).unwrap();

      toast.success(response?.message || "Job saved successfully!");
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };


  return (
    <div className="p-4 sm:p-5 bg-white border border-[#D2D2D5] rounded-2xl space-y-3 hover:shadow-md transition-all duration-300">
      {/* Top section */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 sm:space-y-2  w-full">
          <Link
            href={`/mu/industry/${data?.industry?.id}`}
            className="text-base sm:text-lg font-semibold line-clamp-1 text-headerColor"
          >
            {companyName}
          </Link>
          <p className="text-sm text-grayColor1">
            {data?.location || "Location"}
          </p>
        </div>
        <div className="flex space-y-1 sm:space-y-2 justify-end flex-col items-end w-full">
          <button
            type="button"
            onClick={() => handleSaveJob(data?.id)}
            disabled={isLoading}
            aria-busy={isLoading}
            aria-label={`Save ${jobTitle}`}
            className={`flex flex-col text-grayColor1 justify-center items-center gap-1 hover:text-primaryColor transition-colors disabled:opacity-50 ${
              isLoading ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {data?.is_saved ? (
              <Bookmark className="w-6 h-6 fill-primaryColor ml-0.75 text-primaryColor" />
            ) : (
              <FiBookmark className="w-6 h-6 ml-0.75" />
            )}
          </button>

          <p className="text-grayColor1 text-xs sm:text-sm font-normal leading-[140%] tracking-[0.07px]">
            {timeDisplay}
          </p>
        </div>
      </div>

      {/* Job title */}
      <Link
        href={`/mu/jobs-details/${data?.id}`}
        className="text-base hover:text-primaryColor sm:text-lg font-semibold line-clamp-2 text-headerColor"
      >
        {jobTitle}
      </Link>

      {/* Bottom section */}
      <div className="flex flex-row items-center justify-between gap-3">
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <p className="px-2 py-1 rounded-lg bg-sectionColor text-grayColor1 text-xs font-semibold capitalize">
            {data?.employment_type?.replace(/_/g, " ") || "Full-time"}
          </p>
          <p className="px-2 py-1 rounded-lg bg-sectionColor text-grayColor1 text-xs  font-semibold capitalize">
            {data?.work_mode?.replace(/_/g, " ") || "Hybrid"}
          </p>
          <p className="px-2 py-1 rounded-lg bg-sectionColor text-grayColor1 text-xs  font-semibold">
            {data?.salary_min && data?.salary_max
              ? `$${formatNumberIntoK({ value: data.salary_min })} - $${formatNumberIntoK({ value: data.salary_max })}`
              : "$0 - $0"}
          </p>
        </div>

        {/* Button */}
        <Link
          href={`/mu/jobs-details/${data?.id}`}
          title="View details coming soon"
          className="px-4 py-1 bg-white border border-buttonColor rounded-lg text-buttonColor hover:bg-buttonColor hover:text-white duration-300 text-sm sm:text-base disabled:cursor-not-allowed disabled:opacity-50"
        >
          View
        </Link>
      </div>
    </div>
  );
}
