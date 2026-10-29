"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import { useFollowIndustryMutation } from "@/feature/slice/jobs/industrySlice";
import { PlusUserIcon, UserMinusIcon } from "@/public/svgIcons/Icons";
import toast from "react-hot-toast";

type RelatedIndustryFollowButtonProps = {
  industryId: string | number;
  initialFollowing?: boolean;
};

export default function RelatedIndustryFollowButton({
  industryId,
  initialFollowing,
}: RelatedIndustryFollowButtonProps) {
  const [followIndustry, { isLoading }] = useFollowIndustryMutation();

  const handleFollow = async () => {
    if (isLoading) return;

    try {
      await followIndustry({ id: industryId }).unwrap();

      toast.success("Following industry successfully!");
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to follow industry. Please try again.",
      );
    }
  };

  return (
    <ButtonReuseable
      type="button"
      aria-label="follow-industry"
      title={
        initialFollowing
          ? "Unfollow"
          : isLoading
            ? "Following..."
            : "Follow Now"
      }
      onClick={handleFollow}
      disabled={isLoading}
      icon={
        initialFollowing ? (
          <UserMinusIcon className="h-4 w-4" />
        ) : (
          <PlusUserIcon className="h-4 w-4" />
        )
      }
      className="mt-3 flex px-4 w-full items-center justify-center bg-primaryColor py-2!"
    />
  );
}
