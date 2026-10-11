import ButtonReuseable from "@/components/reusable/CustomButton";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import Link from "next/link";
import { useState } from "react";
import { IoMdDoneAll } from "react-icons/io";
import ApplyTypeModal from "./ApplyTypeModal";
export interface ApplyActionType {
  company_name: string;
  jobTitle: string;
  jobId: string | number;
  company_id: string | number;
  job_apply?: boolean;
  status?: string;
}

interface JobApplyAactionProps {
  jobData: ApplyActionType;
}

function JobApplyAaction({ jobData }: JobApplyAactionProps) {
  const [isApplying, setIsApplying] = useState(false);
  const { data } = useGetUserProfileQuery("");
  const planName = data?.subscription?.plan_type || "basic_user";

  return (
    <div>
      <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
        {jobData?.status !== "published" ? (
          <ButtonReuseable
            title="Expired"
            disabled
            className="px-5 font-semibold! py-2! rounded-full!  disabled:bg-redColor/10! disabled:text-redColor! border-redColor! cursor-not-allowed! text-sm!"
          />
        ) : jobData?.job_apply ? (
          <ButtonReuseable
            title="Applied"
            disabled
            icon={<IoMdDoneAll className="w-4 h-4 text-lightGreenColor2" />}
            className="px-5 font-semibold! py-2! rounded-full!  disabled:bg-lightGreenColor2/10! disabled:text-lightGreenColor2! disabled:border-lightGreenColor2! cursor-not-allowed! text-sm!"
          />
        ) : planName == "premium" ? (
          <ButtonReuseable
            title="Apply Now"
            onClick={() => setIsApplying(true)}
            className="px-5 font-semibold! py-2! rounded-full! hover:bg-primaryColor! hover:text-whiteColor! bg-white! text-primaryColor! border border-primaryColor  text-sm!"
          />
        ) : planName == "basic_user" ? (
          <Link
            href={`/mu/subscription?billing=monthly`}
            className="px-5 font-semibold! py-2! rounded-full! hover:bg-primaryColor! hover:text-whiteColor! bg-white! text-primaryColor! border border-primaryColor  text-sm!"
          >
            Apply Now
          </Link>
        ) : (
          ""
        )}
        <Link
          className="text-sm font-semibold text-primaryColor"
          href={`/mu/industry-profile/${jobData?.company_id}`}
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
