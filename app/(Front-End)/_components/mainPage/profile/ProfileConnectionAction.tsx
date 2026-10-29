"use client";
import ButtonReuseable from "@/components/reusable/CustomButton";
import SelecteInputField from "@/components/reusable/InputFiled/SelecteInputField";
import {
  useRemoveRequestMutation,
  useRequestAcceptMutation,
  useSendRequestMutation,
} from "@/feature/slice/connect/connectSlice";
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "@/feature/slice/connect/followSlice";
import { useStartConversationMutation } from "@/feature/slice/message/messageSlice";
import { CrossUserIcon, FollowUserIcon, MessageIcon, PlusUserIcon, UnfollowUserIcon } from "@/public/svgIcons/Icons";
import { icon } from "leaflet";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { MdDone } from "react-icons/md";

function ProfileConnectionAction({ profileData, userId }) {
  const [selectedAction, setSelectedAction] = useState("");
  const [startConversation, { isLoading: isStartingConversation }] =
    useStartConversationMutation();

  const router = useRouter();
  const [sendRequest, { isLoading }] = useSendRequestMutation();
  const [removeConnection, { isLoading: isRemovingConnection }] =
    useRemoveRequestMutation();
  const [requestAccept, { isLoading: isAcceptingRequest }] =
    useRequestAcceptMutation();
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const [requestSentId, setRequestSentId] = useState();

  const connectionActions = [
    { value: "remove", label: "Remove" ,icon : <CrossUserIcon /> },
    { value: "follow", label: "Follow", icon : <FollowUserIcon /> },
    { value: "unfollow", label: "Unfollow", icon : <UnfollowUserIcon /> },
  ];

  const filterFollowUnfollow = connectionActions.filter((action) =>
    profileData?.connection_status?.is_following
      ? action.value !== "follow"
      : action.value !== "unfollow",
  );


  const handleConnect = async (id) => {


    const payload = {
      user_id: profileData?.id,
    };

    try {
      const result = await sendRequest({ payload }).unwrap();
      setRequestSentId(id);
      toast.success(result.message || "Connection request sent!");
    } catch (error) {
      console.error("Error sending connection request:", error);
      toast.error("Failed to send connection request.");
    }
  };

  const handleMessageCreate = async () => {
    try {
      const response = await startConversation(profileData?.id).unwrap();
      router.push(`/mu/message/${response.data.id}`);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to start conversation.");
    }
  };

  const handleConnectionAction = async (action: string) => {
    try {
      if (action === "remove") {
        await removeConnection({ id: userId }).unwrap();
        toast.success("Connection removed successfully!");
      } else if (action === "accept") {
        await requestAccept({
          id: profileData?.connection_status?.pending_request_id,
        }).unwrap();
        toast.success("Connection request accepted!");
      } else if (action === "follow") {
        await followUser({ userId }).unwrap();
        toast.success("Followed successfully!");
      } else if (action === "unfollow") {
        await unfollowUser({ userId }).unwrap();
        toast.success("Unfollowed successfully!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Action failed. Try again.");
    } finally {
      setSelectedAction("");
    }
  };

  return (
    <div>
      {!profileData?.is_own_profile && (
        <div className="flex items-center gap-4">
          {profileData?.connection_status?.action_label === "Connected" && (
            <div className="flex items-center gap-4">
              <ButtonReuseable
                onClick={handleMessageCreate}
                icon={
                  <MessageIcon className="w-4.5 h-4.5 mt-1 text-whiteColor" />
                }
                title="Message"
                className="cursor-pointer py-2! text-whiteColor rounded-md bg-primaryColor hover:bg-primaryColor/90 transition-all duration-200 disabled:cursor-not-allowed hover:shadow-lg disabled:opacity-70 disabled:bg-bgColor"
              />
              <SelecteInputField
                value={selectedAction}
                onValueChange={handleConnectionAction}
                options={filterFollowUnfollow}
                placeholder="Connected"
                className="h-10.25!  w-full"
              />
            </div>
          )}
          {profileData?.connection_status?.state === "pending_sent" && (
            <div className="flex items-center gap-4">
              <ButtonReuseable
                title={"Request Sent"}
                icon={<PlusUserIcon />}
                disabled={false}
                loading={false}
                className="bg-bgColor! text-descriptionColor! py-2!"
              />
              <ButtonReuseable
                title={"Cancel"}
                sendingMsg={"Cancel"}
                loading={isRemovingConnection}
                onClick={() => handleConnectionAction("remove")}
                className=" bg-whiteColor!   text-blackColor! border py-2!"
              />
            </div>
          )}
          {profileData?.connection_status?.state === "pending_received" && (
            <div className="flex items-center gap-4">
              <ButtonReuseable
                icon={<MdDone />}
                title={profileData?.connection_status?.action_label || "Accept"}
                onClick={() => handleConnectionAction("accept")}
                className="bg-primaryColor! py-2!"
              />
              <ButtonReuseable
                title="Ignore"
                onClick={() => handleConnectionAction("remove")}
                className="bg-bgColor! text-descriptionColor! py-2!"
              />
            </div>
          )}
          {profileData?.connection_status?.state === "not_connected" && (
            <ButtonReuseable
              title={profileData?.connection_status?.action_label || "Connect"}
              icon={<PlusUserIcon />}
              onClick={() => handleConnect(userId)}
              className="bg-primaryColor! py-2!"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileConnectionAction;
