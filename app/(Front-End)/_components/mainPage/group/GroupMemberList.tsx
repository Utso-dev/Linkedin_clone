"use client";
import { GroupMemberListSkeleton } from "@/components/reusable/All Skleton/GroupMemberListSkeleton";
import Error from "@/components/reusable/Error";
import { useGetViewByIdGroupQuery } from "@/feature/slice/group/groupSlice";
import proImage from "@/public/empty_user.jpg";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import GroupInvitedUserDialog from "./GroupInvitedUserDialog";

const GroupMemberList = ({ groupId }: { groupId: string }) => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const { data, isLoading, isError } = useGetViewByIdGroupQuery({
    id: groupId,
  });
  const groupData = data?.data?.group;

  if (isLoading) {
    return <GroupMemberListSkeleton />;
  }
  if (isError) {
    return <Error />;
  }
 
  return (
    <div className="space-y-4">
      <div className="max-w-full rounded-xl border border-borderColor/30 bg-bgLightColor p-4 ">
        {/* Member Count Header */}
        <div className="mb-3 border-b border-gray-200 pb-3">
          <h2 className="text-[18px] font-bold text-headerColor">
            {groupData?.members_count || 0} Members
          </h2>
        </div>

        {/* Mutual Connections Section */}
        <div className="mb-6">
          <p className="mb-3 text-[14px] text-gray-500">
            {data?.data?.mutual_members_count || 0} mutual connections
          </p>

          <div className="flex items-center">
            {/* Avatar Stack */}
            <div className="flex -space-x-3 overflow-hidden">
              {data?.data?.mutual_members?.slice(0, 5).map((src, index) => (
                <Link
                  href={`/mu/profile/${src?.username}`}
                  key={index}
                  className="inline-block h-10 w-10 rounded-full border-2 border-white bg-gray-200"
                >
                  <Image
                    src={src?.profile_image_url || proImage}
                    alt={`User ${index + 1}`}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover rounded-full"
                  />
                </Link>
              ))}
            </div>

            {/* Remaining Count Badge */}
            {data?.data?.mutual_members?.length > 5 && (
              <div className="z-10 -ml-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white text-[12px] font-medium text-gray-600 shadow-sm">
                {data?.data?.mutual_members_count || 0}+
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        {data?.data?.is_current_user_member && (
          <button
            type="button"
            onClick={() => setIsInviteOpen(true)}
            className="px-6 rounded-full bg-primaryColor py-2 cursor-pointer  text-sm lg:text-base font-semibold text-white transition-all hover:bg-primaryColor active:scale-95"
          >
            Invite a Connection
          </button>
        )}
      </div>
      <div className="max-w-full rounded-xl border border-borderColor/30 bg-bgLightColor p-4 ">
        <div className="mb-3 border-b border-borderColor/90 pb-3">
          <h2 className="text-lg font-semibold text-headerColor">Admin</h2>
        </div>

        {/* Mutual Connections Section */}
        <div className="">
          <div className="flex items-start gap-2">
            {/* Avatar Stack */}
            <div className="flex h-10  w-10 overflow-hidden">
              <Image
                src={groupData?.creator?.profile_image_url || proImage}
                alt={`User profile`}
                width={40}
                height={40}
                className="h-full w-full object-cover rounded-full"
              />
            </div>

            <div className="flex-1">
              <h4 className="text-base md:text-lg font-semibold text-headerColor">
                {groupData?.creator?.first_name +
                  " " +
                  groupData?.creator?.last_name || "Unknown Creator"}
              </h4>
              <p className="text-sm text-descriptionColor line-clamp-2">
                {groupData?.creator?.title || "No headline available."}
              </p>
            </div>
          </div>
        </div>
      </div>
      <GroupInvitedUserDialog
        open={isInviteOpen}
        setOpen={setIsInviteOpen}
        groupId={groupId}
      />
    </div>
  );
};

export default GroupMemberList;
