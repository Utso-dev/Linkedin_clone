import { useSendRequestMutation } from "@/feature/slice/connect/connectSlice";
import { ConnectionRequestType } from "@/lib/type";
import emptyImage from "@/public/empty_user.jpg";
import coverImage from "@/public/images/feature-img.jpg";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
function ConnectionUserCard({ profile }: { profile: ConnectionRequestType }) {
  const { user, mutual_connections_count, is_connectable, action_label } =
    profile;

  const [requestSent, setRequestSent] = useState<any>();
  const [sendRequest, { isLoading }] = useSendRequestMutation();

  const handleConnect = async () => {
    const payload = {
      user_id: user.id,
    };

    try {
      const result = await sendRequest({ payload }).unwrap();

      toast.success(result.message || "Connection request sent!");
      setRequestSent(result.data);
    } catch (error) {
      console.error("Error sending connection request:", error);
      toast.error("Failed to send connection request.");
    }
  };



  return (
    <div>
      <article className="overflow-hidden group rounded-md hover:bg-lightGreenColor/20 hover:border-lightGreenColor hover:shadow-lg transition-all duration-200 flex flex-col h-full justify-between border border-borderColor bg-white">
        <div className="">
          <Image
            src={user?.cover_image_url || coverImage}
            alt="profile cover"
            width={650}
            height={150}
            className="h-18 w-full object-cover"
          />
          <div>
            <div className="-mt-10 h-18 w-18 overflow-hidden mx-auto rounded-full border-2 border-white bg-gray-100">
              <Image
                src={user?.profile_image_url || emptyImage}
                alt={user?.name}
                width={150}
                height={150}
                className="h-full group-hover:scale-110 transition-transform duration-200 w-full object-cover"
              />
            </div>
            <div className="text-center px-1">
              <Link
                href={`/mu/profile/${user?.username}`}
                className="mt-3 line-clamp-2  text-base font-semibold leading-[1.2] text-headerColor"
              >
                {user?.name}
              </Link>
              <p className="mt-1.5 line-clamp-3  text-[14px] leading-[1.2] text-descriptionColor">
                {user?.title}
              </p>
            </div>
          </div>
        </div>
        <div className="px-3  pb-3">
          {mutual_connections_count > 0 && (
            <div className="mt-4 flex items-center gap-1 text-[11px] text-descriptionColor">
              <Image
                src={
                  profile?.mutual_connections[0]?.profile_image_url ||
                  emptyImage
                }
                alt="mutual"
                width={50}
                height={50}
                className="h-5 w-5 rounded-full object-cover"
              />
              <span className="truncate">
                {mutual_connections_count} Mutual Connections
              </span>
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleConnect}
              disabled={
                isLoading ||
                !is_connectable ||
                (requestSent && requestSent?.status === "pending")
              }
              className="mt-3 px-4 py-1 disabled:bg-bgColor disabled:border-borderColor disabled:text-grayColor1 disabled:shadow-transparent disabled:cursor-not-allowed  rounded-lg leading-[140%] border border-lightGreenColor hover:border-primaryColor cursor-pointer hover:shadow-lg shadow-primaryColor/50 text-[14px] text-primaryColor hover:bg-primaryColor font-semibold hover:text-whiteColor transition-colors duration-200 "
            >
              {!is_connectable
                ? action_label
                : requestSent?.status === "pending"
                  ? " Request Send"
                  : isLoading
                    ? "Sending..."
                    : "Connect"}
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

export default ConnectionUserCard;
