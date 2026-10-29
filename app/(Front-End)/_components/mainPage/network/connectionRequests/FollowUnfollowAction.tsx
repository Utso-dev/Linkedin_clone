"use client";
import { BUTTON_STYLES } from "@/components/reusable/buttonStyles";
import Loader from "@/components/reusable/Loader";
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "@/feature/slice/connect/followSlice";
import toast from "react-hot-toast";

function FollowUnfollowAction({
  userId,
  isFollower,
  follower,
}: {
  userId?: number;
  isFollower?: boolean;
  follower?: string;
}) {
  const [unfollowUser, { isLoading: isUnfollowing }] =
    useUnfollowUserMutation();
  const [followUser, { isLoading: isFollowing }] = useFollowUserMutation();
  const handleUnfollow = async () => {
    try {
      const result = await unfollowUser({ userId: userId }).unwrap();
      toast.success(result.message || "Unfollowed successfully.");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to unfollow user.");
    }
  };
  const handleUserfollow = async () => {
    try {
      const result = await followUser({ userId: userId }).unwrap();
      toast.success(result.message || "Followed successfully.");
    } catch (error) {
      console.error("Error following user:", error);
    }
  };
  return (
    <div>
      {!isFollower ? (
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
      ) : (
        // <button
        //   onClick={handleUserfollow}
        //   disabled={isFollowing}
        //   className={`${BUTTON_STYLES.borderBtn} disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-bgColor `}
        // >
        //   {isFollowing ? (
        //     <span className="px-2">
        //       <Loader className="w-4.5 animate-spin h-4.5 " />
        //     </span>
        //   ) : (
        //     "Follow"
        //   )}
        // </button>
        <p className="font-semibold text-descriptionColor text-sm">
          Follow by me
        </p>
      )}
    </div>
  );
}

export default FollowUnfollowAction;
