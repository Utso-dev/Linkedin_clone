"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import {
  useClearNotificationsMutation,
  useGetNotificationsQuery,
  useUpdateNotificationReadStatusMutation,
} from "@/feature/slice/notifications/notificationSlice";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { calculateTime } from "./_components/CalculateTime";
import NotificationSkeleton from "./_components/NotificationSkeleton";
import toast from "react-hot-toast";

type NotificationDataType = {
  connection_request_id: number;
  sender_id: number;
  sender_name: string;
  sender_profile_image_url: string;
  message: string;
  type: string;
  requested_at: string;
};

type NotificationItem = {
  id: string;
  type: string;
  data: NotificationDataType;
  is_read?: boolean;
  read_at?: string;
  created_at: string;
};

function NotificationPage() {
  const { data, isLoading, error } = useGetNotificationsQuery("notifications");
  const [markAsRead] = useUpdateNotificationReadStatusMutation();
  const [clearNotifications, { isLoading: isClearing }] =
    useClearNotificationsMutation();
  useEffect(() => {
    markAsRead("mark-all-as-read");
  }, [markAsRead]);

  if (isLoading) {
    return <NotificationSkeleton />;
  }
  const handleClear = async () => {
    try {
      await clearNotifications(undefined).unwrap();
      toast.success("All notifications cleared successfully!");
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  return (
    <section className="w-full bg-white px-3 pb-12 pt-4 md:px-4">
      <div className="flex items-center justify-between ">
        <h1 className="text-lg font-semibold leading-tight text-headerColor">
          Notifications
        </h1>
        <ButtonReuseable
          title="Clear All"
          onClick={handleClear}
          loading={isClearing}
          sendingMsg={"clearing..."}
          className="py-2! text-sm! bg-primaryColor!"
        />
      </div>

      <div className="mt-4 border-t border-borderColor">
        {data?.data.map((item) => (
          <article
            key={item.id}
            className="relative flex items-end justify-between gap-3 border-b border-[#d9d9d9] px-3 py-6 md:px-5"
          >
            {/* {item.isUnread && (
              <span className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-x-1.5 -translate-y-1/2 rounded-full bg-[#5b3df5]" />
            )} */}

            <div className="flex  items-center gap-3 md:gap-4">
              <div className="h-10 w-10 shrink-0 rounded-full ">
                {item?.data?.sender_profile_image_url ||
                item?.data?.acceptor_profile_image_url ? (
                  <Image
                    src={
                      item?.data?.sender_profile_image_url ||
                      item?.data?.acceptor_profile_image_url
                    }
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full w-full h-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primaryColor flex items-center justify-center text-white font-bold text-sm">
                    {item?.data?.sender_name?.slice(0, 2).toUpperCase() ||
                      item?.data?.acceptor_name?.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="">
                <Link
                  href={`/mu/profile/${item?.data?.sender_username || item?.data?.inviter_username}`}
                >
                  {" "}
                  <span className="font-bold">
                    {item?.data?.sender_name || item?.data?.acceptor_name}
                  </span>{" "}
                </Link>
                <p className="text-sm leading-[1.2] text-headerColor ">
                  <span className="font-normal">{item?.data?.message}</span>
                </p>

                {item?.data?.description && (
                  <p className="mt-1 text-xs leading-tight text-descriptionColor ">
                    {item?.data?.description}
                  </p>
                )}
              </div>
            </div>

            {item?.created_at && (
              <p className="shrink-0 pt-1 text-xs leading-none text-descriptionColor">
                {calculateTime(item?.created_at)}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default NotificationPage;
