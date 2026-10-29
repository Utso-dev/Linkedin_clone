"use client";
import RootDialog from "@/components/reusable/RootDialog";
import { useGetViewByIdGroupQuery } from "@/feature/slice/group/groupSlice";
import logoPreview from "@/public/images/company-logo-1.png";
import coverPreview from "@/public/images/cover imager.png";
import {
  EditeIcon,
  GroupUserIcon,
  LogoutIcon,
  NotificationIcon,
} from "@/public/svgIcons/Icons";

import Error from "@/components/reusable/Error";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import Image from "next/image";
import { useState } from "react";
import CreateGroupForm from "./GroupCreateModal";
import GroupLeaveDialog from "./GroupLeaveDialog";
import GroupNotifySetting from "./GroupNotifySetting";

function GroupHeroSection({ groupId }: { groupId: string }) {
  const [isleaved, setILeaved] = useState(false);
  const [isNotify, setIsNotify] = useState(false);
  const [positionY, setPositionY] = useState(35);
  const [positionX, setPositionX] = useState(50);
  const [isEdite, setIsEdite] = useState(false);
  const { data, isLoading, isError } = useGetViewByIdGroupQuery({
    id: groupId,
  });
  const { data: myData } = useGetUserProfileQuery("me");
  const groupData = data?.data?.group;

  const IsAdmin = groupData?.creator?.id === myData?.user?.id;

  if (isError) {
    return <Error />;
  }

  return (
    <section>
      <div className=" h-40 md:h-48 w-full bg-linear-to-r rounded-md from-cyan-100 to-blue-200">
        {isLoading ? (
          <Skeleton className="w-full h-full bg-gray-200" />
        ) : (
          <Image
            src={groupData?.cover_photo_url || coverPreview}
            className="w-full h-full object-cover rounded-md"
            alt="Cover"
            width={1200}
            height={400}
            style={{
              objectPosition: `${positionX}% ${positionY}%`,
            }}
          />
        )}

        {/* Floating Logo Box */}
        <div className="flex px-4 justify-between w-full">
          <div className="-mt-11  h-20 w-20 bg-bgLightColor rounded-md flex items-center justify-center">
            {isLoading ? (
              <Skeleton className="w-full h-full bg-gray-200" />
            ) : (
              <Image
                src={groupData?.logo_url || logoPreview}
                className="w-full h-full object-cover rounded-md"
                alt="Logo"
                width={80}
                height={80}
              />
            )}
          </div>
          {data?.data?.is_current_user_member && (
            <div className="flex gap-6 ">
              <button
                aria-label="notify-open"
                onClick={() => setIsNotify(true)}
                className="cursor-pointer"
              >
                <NotificationIcon />
              </button>
              {!IsAdmin ? (
                <button
                  aria-label="leave-open"
                  onClick={() => setILeaved(true)}
                  className="cursor-pointer"
                >
                  <LogoutIcon />
                </button>
              ) : (
                <button
                  aria-label="leave-open"
                  onClick={() => setIsEdite(true)}
                  className="cursor-pointer"
                >
                  <EditeIcon />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-12 border-b border-borderColor pb-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-full bg-gray-200" />
            <Skeleton className="h-4 w-[70%] bg-gray-200" />
            <Skeleton className="h-4 w-[35%] bg-gray-200" />
          </div>
        ) : (
          <>
            <h4 className="text-lg font-semibold text-headerColor leading-[150%]">
              {groupData?.name || "Group Name"}
            </h4>
            <p className=" text-sm md:text-base text-descriptionColor leading-[160%] ">
              {groupData?.description || "No description available."}
            </p>
            <div className="flex items-center gap-2.5 mt-2 text-grayColor1">
              <GroupUserIcon />
              <p className="text-sm   line-clamp-3">
                {groupData?.members_count || 0} members
              </p>
            </div>
          </>
        )}
      </div>
      {isEdite && (
        <CreateGroupForm
          open={isEdite}
          setOpen={setIsEdite}
          groupData={groupData}
        />
      )}
      <RootDialog
        open={isleaved || isNotify}
        setOpen={isleaved ? setILeaved : setIsNotify}
        className=" max-w-150!"
      >
        {isleaved ? (
          <GroupLeaveDialog groupId={groupId} setIsNotify={setILeaved} />
        ) : (
          <GroupNotifySetting
            groupId={groupId}
            groupNotification={data?.data?.notification_status}
            setIsNotify={setIsNotify}
          />
        )}
      </RootDialog>
    </section>
  );
}

export default GroupHeroSection;
