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
import { resetPostComposeState } from "@/feature/slice/postCompose/postComposeSlice";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import { persistor } from "@/feature/store";
import echo from "@/lib/echo";
import { clearToken } from "@/lib/token";
import emptyImage from "@/public/empty_user.jpg";
import {
  CompanyIcon,
  DashboardIcon,
  LogoutIcon,
  MessageIcon,
  NotificationIcon,
  PublicationsMenueIcon,
  SettingIcon,
  SingleUserIcon,
  UserCircleIcon,
} from "@/public/svgIcons/Icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaCrown } from "react-icons/fa";
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
    try {
      await logout().unwrap();
    } catch (error) {
      console.error("Error occurred while logging out:", error);
    } finally {
      await clearToken();
      router.replace("/login");
      dispatch(baseApiSlice.util.resetApiState());
      dispatch(onboardingReset());
      dispatch(resetPostComposeState());
      await persistor?.purge();
    }
  };
  const isMessagePage = patheName.startsWith("/mu/message");

  const isPremium = userProfileData?.subscription?.plan_type === "premium";
  const isIndustry = userProfileData?.subscription?.plan_type === "industry";
  const planName = userProfileData?.subscription?.plan_name || "basic_user";

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
                      width={150}
                      height={150}
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
                <div className="flex gap-1 h-full items-end">
                  <div className="flex items-center  rounded-full cursor-pointer hover:opacity-90">
                    <div
                      className={`w-7 h-7 lg:w-12 border-[3px] ${isIndustry ? "border-proIdustryColor" : isPremium ? "border-[#5FC3D0]" : "border-[#87D5FF]"} lg:h-12 rounded-full overflow-hidden`}
                    >
                      <Image
                        src={
                          userProfileData?.user?.profile_image_url || emptyImage
                        }
                        alt="Admin Avatar"
                        width={150}
                        height={150}
                        unoptimized
                        className="rounded-full w-full object-cover  h-full"
                      />
                    </div>
                  </div>

                  <button className=" cursor-pointer">
                    <IoIosArrowDown size={16} className="text-blackColor" />
                  </button>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-60 border border-gray-200 bg-white p-3 text-gray-900 shadow-xl"
              >
                <div className="">
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <div
                      className={`h-12 w-12 shrink-0 overflow-hidden rounded-full border-[3px] ${isIndustry ? "border-proIdustryColor" : isPremium ? "border-[#5FC3D0]" : "border-[#87D5FF]"}`}
                    >
                      <Image
                        src={
                          userProfileData?.user?.profile_image_url || emptyImage
                        }
                        alt="Admin Avatar"
                        width={150}
                        height={150}
                        className="rounded-full object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="mb-1 pl-1 text-base font-semibold text-gray-900">
                        {userProfileData?.user?.first_name +
                          " " +
                          userProfileData?.user?.last_name || "Vin Intini"}
                      </p>
                      <div
                        className={`inline-flex items-center justify-center gap-2 rounded-full px-2.5 py-1 text-sm font-medium capitalize tracking-wide ${isIndustry ? "bg-[#FEF4CF] text-[#BB960B]" : isPremium ? "bg-lightGreenColor text-primaryColor" : "bg-[#87D5FF]/20 text-[#3EA1D6]"}`}
                      >
                        {isIndustry || isPremium ? (
                          <FaCrown
                            size={16}
                            className={`${isIndustry ? "text-[#BB960B]" : isPremium ? "text-primaryColor" : "text-[#3EA1D6]"}`}
                          />
                        ) : (
                          <SingleUserIcon className="h-4 w-4 text-[#3EA1D6]" />
                        )}
                        <span className="text-sm capitalize tracking-wide">
                          {planName.split("_").join(" ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-0.5 py-1.5">
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/mu/profile`}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1 text-gray-800 hover:bg-gray-100 hover:text-gray-950"
                    >
                      <UserCircleIcon className="h-5 w-5 text-grayColor1" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      href={`/mu/settings/general`}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1 text-gray-800 hover:bg-gray-100 hover:text-gray-950"
                    >
                      <SettingIcon className="h-5 w-5 text-grayColor1" />
                      Account Setting
                    </Link>
                  </DropdownMenuItem>
                  {isPremium && (
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/mu/premium/publications`}
                        className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1 text-gray-800 hover:bg-gray-100 hover:text-gray-950"
                      >
                        <PublicationsMenueIcon className="h-5 w-5 text-grayColor1" />
                        Publications
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {userProfileData?.industry?.has_company &&
                    userProfileData?.subscription?.plan_type !== "premium" && (
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/mu/industry-profile/${userProfileData?.industry?.company?.id}`}
                          className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1 text-gray-800 hover:bg-gray-100 hover:text-gray-950"
                        >
                          <DashboardIcon className="h-5 w-5 text-grayColor1" />
                          Industry Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                  {!userProfileData?.industry?.has_company &&
                    userProfileData?.subscription?.plan_type !== "premium" && (
                      <DropdownMenuItem asChild>
                        <Link
                          href={
                            planName == "basic_user"
                              ? `/mu/subscription?billing=monthly&plan_type=industry`
                              : `/mu/create-company-page/`
                          }
                          className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1 text-gray-800 hover:bg-gray-100 hover:text-gray-950"
                        >
                          <CompanyIcon className="h-5 w-5 text-grayColor1" />
                          Create a Company Page
                        </Link>
                      </DropdownMenuItem>
                    )}
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <button
                    onClick={handleLogout}
                    className="group flex w-full cursor-pointer items-center gap-2 px-2 py-1 font-semibold text-gray-800 hover:bg-redColor/8 hover:text-redColor"
                  >
                    <LogoutIcon className="h-4 w-4 group-hover:text-redColor group-hover:fill-redColor" />
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
