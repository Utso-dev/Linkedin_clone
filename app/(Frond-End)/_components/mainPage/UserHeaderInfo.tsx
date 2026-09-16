"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutMutation } from "@/feature/slice/auth/authSlice";
import baseApiSlice from "@/feature/slice/baseApi";
import { useGetUnreadMessagesCountQuery } from "@/feature/slice/message/messageSlice";
import { useGetNotificationCountQuery } from "@/feature/slice/notifications/notificationSlice";
import { onboardingReset } from "@/feature/slice/onboarding/onboardingSlice";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import echo from "@/lib/echo";
import { clearToken } from "@/lib/token";
import emptyImage from "@/public/empty_user.jpg";
import {
  CompanyIcon,
  LogoutIcon,
  MessageIcon,
  NotificationIcon,
  OfficeBuildingIcon,
  SettingIcon,
  UserCircleIcon,
} from "@/public/svgIcons/Icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch } from "react-redux";

function UserHeaderInfo() {
  const { data: userProfileData } = useGetUserProfileQuery("user");
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  const [unreadCount, setUnreadCount] = useState(0);
  const [newMessagePopup, setNewMessagePopup] = useState<{
    key: number;
    sender: string;
    image: string;
    text: string;
  } | null>(null);
  const popupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data: unreadMessagesCountData } = useGetUnreadMessagesCountQuery(
    "unreadMessagesCount",
  );

  useEffect(() => {
    if (userProfileData?.success) {
      dispatch(onboardingReset());
    }
  }, [userProfileData?.success, dispatch]);

  const router = useRouter();
  const patheName = usePathname();
  const { data: notificationCountData } =
    useGetNotificationCountQuery("notificationCount");

  useEffect(() => {
    if (unreadMessagesCountData?.data?.total_unread_messages !== undefined) {
      setUnreadCount(unreadMessagesCountData?.data?.total_unread_messages);
    }
  }, [unreadMessagesCountData]);

  useEffect(() => {
    if (!echo || !userProfileData?.user?.id) return;
    const channelName = `App.Models.User.${userProfileData?.user?.id}`;
    const channel = echo.private(channelName);

    const handleMessageSent = async (data: any) => {
      setUnreadCount(data?.total_unread_messages);
      if (data?.user && data?.last_message) {
        const lastMessage = data?.last_message;
        const text = lastMessage?.message
          ? lastMessage.message
          : lastMessage?.type === "audio"
            ? "Send a voice message"
            : lastMessage?.type === "file" || lastMessage?.type === "vedio"
              ? "Send a file"
              : "You have a new message";
        setNewMessagePopup({
          key: Date.now(),
          sender: data?.user?.name || "New message",
          image: data?.user?.profile_image_url || emptyImage,
          text,
        });
        if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
        popupTimerRef.current = setTimeout(() => {
          setNewMessagePopup(null);
          popupTimerRef.current = null;
        }, 4000);
        dispatch(baseApiSlice.util.invalidateTags(["conversationList"]));
      }
    };

    channel.listen(".ConversationUpdated", handleMessageSent);

    return () => {
      channel.stopListening(".ConversationUpdated", handleMessageSent);
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    };
  }, [dispatch, userProfileData?.user?.id]);
  const handleLogout = async () => {
    // Clear the access token cookie
    try {
      await logout();
      await clearToken();
      router.push("/login");
    } catch (error) {
      console.error("Error occurred while logging out:", error);
    }
    // Redirect to the login page
  };
  const isMessagePage = patheName.startsWith("/mu/message");

  return (
    <div>
      <div className="flex items-center gap-2 lg:gap-6 justify-end w-full">
        <div className="flex items-center gap-4 lg:gap-5 justify-between">
          <Link
            href={`/mu/notification`}
            className="relative flex justify-center items-center "
          >
            {notificationCountData?.data?.unread_count > 0 && (
              <span className="absolute -top-2 -right-2 flex justify-center items-center text-[0.625rem] w-4 h-4 text-whiteColor rounded-full bg-redColor">
                {notificationCountData?.data?.unread_count > 99
                  ? "99+"
                  : notificationCountData?.data?.unread_count}
              </span>
            )}
            <NotificationIcon className="text-grayColor1" />
          </Link>
          <Link
            href={`/mu/message`}
            className="flex justify-center relative items-center"
          >
            {!isMessagePage && newMessagePopup && (
              <div
                key={newMessagePopup.key}
                className="animate-pop-in absolute top-full right-0 mt-2 z-50 w-60 rounded-lg bg-white shadow-lg border border-gray-100 p-3 cursor-pointer"
              >
                <div className="flex items-start gap-2">
                  <div className="w-10 h-10 overflow-hidden rounded-sm">
                    <Image
                      src={newMessagePopup?.image}
                      width={40}
                      height={40}
                      className="rounded-sm w-full border border-primaryColor h-full object-center object-cover"
                      alt=""
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-headerColor truncate">
                      {newMessagePopup.sender}{" "}
                      <span className="inline-block w-2 h-2 rounded-full bg-green-600"></span>
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-0.5 wrap-break-words">
                      {newMessagePopup.text}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {unreadMessagesCountData?.data?.total_unread_messages === 0 ||
            unreadCount === 0 ? null : (
              <span className="absolute -top-2 -right-2 flex justify-center items-center text-[0.625rem] w-4 h-4 text-whiteColor rounded-full bg-redColor">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
            <MessageIcon className="text-grayColor1" />
          </Link>

          <div className="  relative sm:ml-0">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <div className="flex gap-2 h-full items-end">
                  <div className="flex items-center  rounded-full cursor-pointer hover:opacity-90">
                    <div className=" w-7 h-7 lg:w-12 border border-primaryColor lg:h-12 rounded-full overflow-hidden">
                      <Image
                        src={
                          userProfileData?.user?.profile_image_url || emptyImage
                        }
                        alt="Admin Avatar"
                        width={80}
                        height={80}
                        unoptimized
                        className="rounded-full w-full object-cover h-full"
                      />
                    </div>
                  </div>

                  <button className=" cursor-pointer">
                    <IoIosArrowDown size={16} className="text-blackColor" />
                  </button>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-55.5 p-3">
                <div className="">
                  <div className="flex items-center gap-2 pb-2 border-b border-borderColor">
                    <div className=" w-10 h-10 rounded-md border overflow-hidden ">
                      <Image
                        src={
                          userProfileData?.user?.profile_image_url || emptyImage
                        }
                        alt="Admin Avatar"
                        width={40}
                        height={40}
                        className="rounded-md w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-headerColor">
                        {userProfileData?.user?.first_name +
                          " " +
                          userProfileData?.user?.last_name || "Vin Intini"}
                      </p>
                      <p className="text-sm  text-grayColor1 line-clamp-1">
                        {userProfileData?.user?.title ||
                          "CEO & Founder, MindUnite"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="py-1.5 space-y-0.5">
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/mu/profile`}
                      className="text-headerColor hover:font-semibold  rounded-sm items-center gap-2 group hover:bg-bgLightColor flex  w-full  py-1 px-2 cursor-pointer"
                    >
                      <UserCircleIcon className="w-5 h-5 text-grayColor1" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      href={`/mu/settings/general`}
                      className="text-headerColor hover:font-semibold  rounded-sm items-center gap-2 group hover:bg-bgLightColor flex  w-full  py-1 px-2 cursor-pointer"
                    >
                      <SettingIcon className="w-5 h-5 text-grayColor1  " />
                      Account Setting
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/mu/settings/general`}
                      className="text-headerColor hover:font-semibold  rounded-sm items-center gap-2 group hover:bg-bgLightColor flex  w-full  py-1 px-2 cursor-pointer"
                    >
                      <CompanyIcon className="w-5 h-5 text-grayColor1  " />
                      Create a Company Page
                    </Link>
                  </DropdownMenuItem>
                </div>
                <div className="pt-2  border-t border-borderColor">
                  <button
                    onClick={handleLogout}
                    className="text-headerColor  items-center gap-2 group hover:bg-redColor/8 flex  w-full hover:text-redColor py-1 px-2 font-semibold cursor-pointer"
                  >
                    <LogoutIcon className="w-4 h-4 group-hover:text-redColor group-hover:fill-redColor" />
                    Log Out
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHeaderInfo; 
