"use client";

import { BUTTON_STYLES } from "@/components/reusable/buttonStyles";
import {
  useRequestAcceptMutation,
  useRequestRejectMutation,
} from "@/feature/slice/connect/connectSlice";
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "@/feature/slice/connect/followSlice";
import { useStartConversationMutation } from "@/feature/slice/message/messageSlice";
import { MessageIcon, UserMinusIcon } from "@/public/svgIcons/Icons";
import { Loader, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import UserUnfollowDialog from "../UserUnfollowDialog";
import ConnectionUnfriendDialog from "./ConnectionUnfriendDialog";

interface ActionProps {
  id: number;
  status: any;
  userId?: number;
  isFollower?: boolean;
  isfollowedBack?: boolean;
}

export const ConnectionActionButtons = ({
  id,
  status,
  userId,
  isFollower,
  isfollowedBack,
}: ActionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [isUnfriend, setIsUnfriend] = useState(false);
  const [identyConnection, setIdentyConnection] = useState("");
  const [requestAccept, { isLoading: isAccepting }] =
    useRequestAcceptMutation();
  const [requestReject, { isLoading: isRejecting }] =
    useRequestRejectMutation();
  const [startConversation, { isLoading: isStartingConversation }] =
    useStartConversationMutation();
  const [unfollowUser, { isLoading: isUnfollowing }] =
    useUnfollowUserMutation();
  const [followUser, { isLoading: isFollowing }] = useFollowUserMutation();
  const handleConnectionAction = async (type: "accept" | "ignore") => {
    try {
      if (type === "accept") {
        const response = await requestAccept({ id }).unwrap();
        toast.success(response.message || "Connection request accepted!");
        setIdentyConnection("accept");
        return;
      }

      const response = await requestReject({ id }).unwrap();
      toast.success(response.message || "Connection request ignored.");
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to process connection request.",
      );
    }
  };

  const handleUnfollow = async () => {
    try {
      const result = await unfollowUser({ userId: userId }).unwrap();
      toast.success(result.message || "Unfollowed successfully.");
    } catch (error) {
      console.error("Error opening unfollow dialog:", error);
      toast.error(error?.data?.message || "Failed to unfollow user.");
    }
  };
  const handleUserfollow = async () => {
    try {
      const result = await followUser({ userId: userId }).unwrap();
      toast.success(result.message || "Followed successfully.");
    } catch (error) {
      console.error("Error following user:", error);
      toast.error(error?.data?.message || "Failed to follow user.");
    }
  };
  const handleMessageCreate = async () => {
    try {
      const response = await startConversation(userId).unwrap();
      router.push(`/mu/message/${response.data.id}`);
      
    } catch (error) {
      toast.error(error?.data?.message || "Failed to start conversation.");
    }
  };

  const renderButtons = () => {
    switch (status) {
      case "accepted":
        return (
          <div className="flex items-center gap-4">
            <button onClick={handleMessageCreate} title="Message" className="cursor-pointer">
              <MessageIcon className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setIsUnfriend(true)}
              title="Unfriend"
              className={` w-9 h-9 flex items-center disabled:shadow-transparent disabled:cursor-not-allowed disabled:opacity-70 disabled:border-borderColor disabled:bg-bgColor justify-center border border-descriptionColor cursor-pointer rounded-full hover:bg-lightGreenColor/20 hover:border-lightGreenColor hover:shadow-lg transition-all duration-200 `}
            >
              <UserMinusIcon className="w-4.5 h-4.5" />
            </button>
          </div>
        );

      case "pending":
        return (
          <div className="flex items-center gap-2">
            {identyConnection === "ignore" ? (
              <button
                disabled={isAccepting || isRejecting}
                className={BUTTON_STYLES.iconBtn}
              >
                <X className="h-4 w-4" />
              </button>
            ) : identyConnection === "accept" ? (
              <Link
                href={`/mu/profile/${userId}`}
                className={BUTTON_STYLES.primary}
              >
                View profile
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  disabled={isRejecting}
                  onClick={() => handleConnectionAction("ignore")}
                  className={`${BUTTON_STYLES.secondary} disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-bgColor`}
                >
                  {isRejecting ? "Ignoring..." : "Ignore"}
                </button>
                <button
                  disabled={isAccepting}
                  onClick={() => handleConnectionAction("accept")}
                  className={`${BUTTON_STYLES.primary} disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-bgColor`}
                >
                  {isAccepting ? (
                    <span className="">
                      <Loader className="w-4.5 animate-spin h-4.5 " />
                    </span>
                  ) : (
                    "Accept"
                  )}
                </button>
              </div>
            )}
          </div>
        );

      case "connected":
        return (
          <div className="flex items-center gap-2">
            <Link href={`/mu/profile/${id}`} className={BUTTON_STYLES.primary}>
              View profile
            </Link>
            <button
              disabled={isAccepting || isRejecting}
              className={BUTTON_STYLES.iconBtn}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );

      default:
        return isfollowedBack ? (
          <button
            onClick={handleUnfollow}
            disabled={isUnfollowing}
            className={`${BUTTON_STYLES.borderBtn} disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-bgColor `}
          >
            {isUnfollowing ? (
              <span className="">
                <Loader className="w-4.5 animate-spin h-4.5 " />
              </span>
            ) : (
              "Unfollow"
            )}
          </button>
        ) : !isFollower ? (
          <button
            onClick={handleUserfollow}
            disabled={isFollowing}
            className={`${BUTTON_STYLES.borderBtn} disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-bgColor `}
          >
            {isFollowing ? (
              <span className="">
                <Loader className="w-4.5 animate-spin h-4.5 " />
              </span>
            ) : (
              "Follow"
            )}
          </button>
        ) : (
          <p className="font-semibold text-descriptionColor text-sm">
            Follow me
          </p>
        );
    }
  };

  return (
    <>
      {renderButtons()}
      {isOpen && <UserUnfollowDialog setOpen={setIsOpen} open={isOpen} />}
      {isUnfriend && (
        <ConnectionUnfriendDialog
          setOpen={setIsUnfriend}
          open={isUnfriend}
          userId={userId}
        />
      )}
    </>
  );
};
