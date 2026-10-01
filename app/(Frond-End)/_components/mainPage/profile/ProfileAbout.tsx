"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetMyProfileQuery,
  useGetProfileByIdQuery,
} from "@/feature/slice/user/userSlice";
import { EditeIcon, PencileIcon } from "@/public/svgIcons/Icons";
import { useState } from "react";
import ProfileAboutUpdateForm from "./ProfileAboutUpdateForm";

function ProfileAbout({ userId }: { userId?: string }) {
  const [isNotify, setIsNotify] = useState(false);

  const { data, isLoading } = userId
    ? useGetProfileByIdQuery(userId || "", {
        skip: !userId,
      })
    : useGetMyProfileQuery("profile");

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-full h-4 bg-gray-200" />
        <Skeleton className="w-full h-4 bg-gray-200" />
        <Skeleton className="w-full h-4 bg-gray-200" />
      </div>
    );
  }
  return (
    <div className="pb-4 border-b border-borderColor">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-semibold ">About</h2>

        {data?.data?.is_own_profile && (
          <button
            aria-label="notify-open"
            onClick={() => setIsNotify(true)}
            className="cursor-pointer"
          >
            <PencileIcon />
          </button>
        )}
      </div>
      <p className="text-base text-descriptionColor leading-[150%]">
        {data?.data?.about ||
          data?.user?.profile?.about ||
          "No about information available."}
      </p>

      {isNotify && (
        <ProfileAboutUpdateForm
          open={isNotify}
          setOpen={setIsNotify}
          initialAbout={
            data?.data?.about ||
            data?.user?.profile?.about ||
            "No about information available."
          }
        />
      )}
    </div>
  );
}

export default ProfileAbout;
