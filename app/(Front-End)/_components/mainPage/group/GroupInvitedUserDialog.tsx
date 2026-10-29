"use client";

import GroupSkleton from "@/components/reusable/All Skleton/GroupSkleton";
import Error from "@/components/reusable/Error";
import RootDialog from "@/components/reusable/RootDialog";
import Search from "@/components/reusable/Search";
import {
  useGetInviteUsersGroupQuery,
  useGroupInviteUserMutation,
} from "@/feature/slice/group/groupSlice";
import proImage from "@/public/empty_user.jpg";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

type InviteUser = {
  id: number;
  name?: string;
  first_name?: string;
  last_name?: string;
  title?: string;
  headline?: string;
  profile_image_url?: string;
  is_invited?: boolean;
  action_label?: string;
};

function GroupInvitedUserDialog({
  open,
  setOpen,
  groupId,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  groupId: string;
}) {
  const { data, isLoading, isError } = useGetInviteUsersGroupQuery({
    id: groupId,
  });
  const [groupInviteUser, { isLoading: isInviting }] =
    useGroupInviteUserMutation();
  const [isInvitingGroupId, setIsInvitingGroupId] = useState<number | null>(
    null,
  );
  const inviteUsers: InviteUser[] = data?.data?.users || data?.data || [];

  const handleInvite = async (userId: number) => {
    setIsInvitingGroupId(userId);
    try {
      const payload = { user_id: userId };
      const result = await groupInviteUser({ groupId, payload }).unwrap();
      toast.success(result?.message || "Invitation sent successfully!");
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Failed to send invitation.",
      );
    }
  };

  return (
    <RootDialog open={open} setOpen={setOpen} className="max-w-190">
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-borderColor px-4 md:px-5 py-4">
          <h2 className="text-lg md:text-xl font-semibold text-headerColor">
            Send Invitation to Your Connection
          </h2>
        </div>

        <div className="px-4 md:px-5 pt-4 pb-5">
          <div className="flex flex-col md:flex-row gap-3 md:items-center mb-4">
            <Search className={"py-3!"} />
            <button
              type="button"
              className="rounded-full bg-primaryColor px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-primaryColor/90 active:scale-95"
            >
              Search
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto pr-1">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <GroupSkleton key={index} />
                ))}
              </div>
            ) : isError ? (
              <Error />
            ) : inviteUsers.length ? (
              <div className="space-y-1">
                {inviteUsers.map((user) => {
                  const displayName =
                    user.name ||
                    `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                    "Unknown user";
                  const subtitle = user.title || user.headline || "";

                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between gap-3 border-b border-borderColor/40 py-4 last:border-b-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-full border border-borderColor/20 bg-gray-100 shrink-0">
                          <Image
                            src={user.profile_image_url || proImage}
                            alt={displayName}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-base font-semibold text-headerColor">
                            {displayName}
                          </h3>
                          <p className="truncate text-sm text-descriptionColor">
                            {subtitle ||
                              "Scaling Businesses with Strategy, Systems & Growth"}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isInviting && isInvitingGroupId === user.id}
                        onClick={() => handleInvite(user.id)}
                        className="shrink-0 rounded-full disabled:border-borderColor border cursor-pointer disabled:bg-bgColor border-primaryColor px-5 py-2 text-sm font-semibold text-primaryColor transition-all hover:bg-primaryColor hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isInviting
                          ? "Sending..."
                          : user.action_label || "Send Invitation"}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center text-sm text-descriptionColor">
                No connections found.
              </div>
            )}
          </div>
        </div>
      </div>
    </RootDialog>
  );
}

export default GroupInvitedUserDialog;
