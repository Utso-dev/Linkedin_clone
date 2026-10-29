import { BUTTON_STYLES } from "@/components/reusable/buttonStyles";
import { useSendRequestMutation } from "@/feature/slice/connect/connectSlice";
import emptyImage from "@/public/empty_user.jpg";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
function ProfileUserConnectCard({ profile }: any) {
  const { user, mutual_connections_count } = profile;
  const [sendRequest, { isLoading }] = useSendRequestMutation();
  const [requestSentId, setRequestSentId] = useState();

  const handleConnect = async (id) => {
    const payload = {
      user_id: user.id,
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
  return (
    <div>
      <article
        key={profile.id}
        className={` py-3  border-b border-borderColor" `}
      >
        <div className="flex items-start gap-3">
          <div className="xl:h-14 xl:w-14 w-12 h-12 shrink-0 overflow-hidden rounded-full border-2 border-white bg-bgLightColor shadow-sm ring-1 ring-borderColor/50">
            <Image
              src={user?.profile_image_url || emptyImage}
              alt={user?.name}
              width={148}
              height={148}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <Link
              href={`/mu/profile/${user?.username}`}
              className="truncate text-base  font-semibold leading-[1.2] text-headerColor"
            >
              {user?.name}
            </Link>
            <p className="mt-1 line-clamp-1 text-sm leading-[1.35] text-descriptionColor">
              {user?.title}
            </p>
            {mutual_connections_count > 0 && (
              <div className="mt-2.5 mb-2.5 flex items-center gap-1 text-[11px] text-descriptionColor">
                <Image
                  src={
                    profile?.mutual_connections[0]?.profile_image_url ||
                    emptyImage
                  }
                  alt="mutual"
                  width={24}
                  height={24}
                  className="h-5 w-5 rounded-full object-cover"
                />
                <span className="truncate">
                  {mutual_connections_count} Mutual Connections
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end w-full ">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleConnect(user?.id)}
            className={`${BUTTON_STYLES.primary} disabled:bg-bgColor disabled:text-grayColor1 disabled:border-borderColor disabled:cursor-not-allowed mt-1`}
          >
            {isLoading
              ? "Sending..."
              : requestSentId === user?.id
                ? "Request Sent"
                : "Connect"}
          </button>
        </div>
      </article>
    </div>
  );
}

export default ProfileUserConnectCard;
