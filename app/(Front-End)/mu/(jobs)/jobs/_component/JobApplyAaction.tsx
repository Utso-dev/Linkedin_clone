import ButtonReuseable from "@/components/reusable/CustomButton";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import Link from "next/link";
import { useState } from "react";
import { IoMdDoneAll } from "react-icons/io";
import ApplyTypeModal from "./ApplyTypeModal";
export interface ApplyActionType {
  industry_name: string;
  jobTitle: string;
  jobId: string | number;
  industry_id: string | number;
  job_apply?: boolean;
  status?: string;
  is_own_industry?: boolean;
}

interface JobApplyAactionProps {
  jobData: ApplyActionType;
}

function JobApplyAaction({ jobData }: JobApplyAactionProps) {
  const [isApplying, setIsApplying] = useState(false);
  const { data } = useGetUserProfileQuery("");
  const planName = data?.subscription?.plan_type || "basic_user";
  const isPublished = jobData.status === "published";
  const hasApplied = Boolean(jobData.job_apply);
  const isPremiumUser = planName === "premium";
  const isBasicUser = planName === "basic_user";

  const renderApplyAction = () => {
    if (!isPublished) {
      return (
        <ButtonReuseable
          title="Expired"
          disabled
          className="px-5 font-semibold! py-2! rounded-full! disabled:bg-redColor/10! disabled:text-redColor! border-redColor! cursor-not-allowed! text-sm!"
        />
      );
    }

    if (hasApplied) {
      return (
        <ButtonReuseable
          title="Applied"
          disabled
          icon={<IoMdDoneAll className="w-4 h-4 text-lightGreenColor2" />}
          className="px-5 font-semibold! py-2! rounded-full! disabled:bg-lightGreenColor2/10! disabled:text-lightGreenColor2! disabled:border-lightGreenColor2! cursor-not-allowed! text-sm!"
        />
      );
    }

    if (isPremiumUser) {
      return (
        <ButtonReuseable
          title="Apply Now"
          onClick={() => setIsApplying(true)}
          className="px-5 font-semibold! py-2! rounded-full! hover:bg-primaryColor! hover:text-whiteColor! bg-white! text-primaryColor! border border-primaryColor text-sm!"
        />
      );
    }

    if (isBasicUser) {
      return (
        <Link
          href="/mu/subscription?plan_type=premium&billing=monthly"
          className="px-5 font-semibold! py-2! rounded-full! hover:bg-primaryColor! hover:text-whiteColor! bg-white! text-primaryColor! border border-primaryColor text-sm!"
        >
          Apply Now
        </Link>
      );
    }

    return null;
  };

  return (
    <div>
      <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
        {renderApplyAction()}
        <Link
          className="text-sm font-semibold text-primaryColor"
          href={
            jobData?.is_own_industry
              ? `/mu/industry-profile/${jobData?.industry_id}`
              : `/mu/industry/${jobData?.industry_id}`
          }
        >
          View Company
        </Link>
      </div>
      {isApplying && (
        <ApplyTypeModal
          open={isApplying}
          jobData={jobData}
          setOpen={setIsApplying}
        />
      )}
    </div>
  );
}

export default JobApplyAaction;
