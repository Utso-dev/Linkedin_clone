"use client";

import Search from "@/components/reusable/Search";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useGetMyConnectionsQuery } from "@/feature/slice/connect/connectSlice";
import {
  useArchiveMessageMutation,
  useDeleteConversationMutation,
  useGetConversationListQuery,
  useMarkReadMessageMutation,
  useMarkUnReadMessageMutation,
  useStartConversationMutation,
  useUnarchiveMessageMutation,
} from "@/feature/slice/message/messageSlice";
import type { AppDispatch } from "@/feature/store";
import { truncateText } from "@/lib/utils";
import emptyImage from "@/public/empty_user.jpg";
import { MessageIcon, VerifyBadgeIcon } from "@/public/svgIcons/Icons";
import dayjs from "dayjs";
import { Archive, ArchiveRestore, Check, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { IoMdDoneAll } from "react-icons/io";
import { useDispatch } from "react-redux";

function MessageUserSection() {
  const dispatch = useDispatch() as AppDispatch;
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "all";
  const searchQuery = searchParams.get("search") ?? "";

  // Popup open/close state & ref for click-outside handling
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { data } = useGetConversationListQuery(activeTab, {
    skip: activeTab === null,
  });

  // Fetch connections based on search query
  const { data: searchResults, isFetching: isSearchFetching } =
    useGetMyConnectionsQuery(
      { query: `?search=${searchQuery}&page=1&limit=10` },
      { skip: !searchQuery },
    );

  const [startConversation, { isLoading: isStartingConv }] =
    useStartConversationMutation();
  const [markReadMessage] = useMarkReadMessageMutation();
  const [markUnReadMessage] = useMarkUnReadMessageMutation();
  const [archiveMessage] = useArchiveMessageMutation();
  const [unarchiveMessage] = useUnarchiveMessageMutation();
  const [deleteConversation] = useDeleteConversationMutation();

  // Open dropdown when user types search
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  }, [searchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const setTab = (tab: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("tab", tab);
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  const messageType = [
    { id: 1, name: "all" },
    { id: 3, name: "unread" },
    { id: 4, name: "archived" },
  ];

  const handleReadMessage = async (messageId: number) => {
    try {
      await markReadMessage(messageId).unwrap();
      router.push(`/mu/message/${messageId}?${searchParams.toString()}`);
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const handleToggleRead = async (msg: any) => {
    try {
      if (msg.unread_count > 0) {
        await markReadMessage(msg.id).unwrap();
      } else {
        await markUnReadMessage(msg.id).unwrap();
        router.push(`/mu/message?${searchParams.toString()}`);
      }
    } catch (error) {
      console.error("Error toggling read status:", error);
    }
  };

  const handleToggleArchive = async (msg: any) => {
    try {
      if (msg.is_archived) {
        await unarchiveMessage(msg.id).unwrap();
        router.push(`/mu/message`);
      } else {
        await archiveMessage(msg.id).unwrap();
        router.push(`/mu/message`);
      }
    } catch (error) {
      console.error("Error toggling archive status:", error);
    }
  };

  const handleDeleteConversation = async (msg: any) => {
    if (window.confirm("Are you sure you want to delete this conversation?")) {
      try {
        await deleteConversation(msg.id).unwrap();
        router.push("/mu/message");
      } catch (error) {
        console.error("Error deleting conversation:", error);
      }
    }
  };

  // Start new conversation from searched connection
  const handleStartConversation = async (userId: number) => {
    try {
      const response = await startConversation(userId).unwrap();
      setIsDropdownOpen(false);
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.delete("search");
      const queryString = currentParams.toString();
      router.push(`/mu/message/${response.data.id}?${queryString}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to start conversation.");
    }
  };

  const connectionsList =
    searchResults?.data?.data || searchResults?.data || [];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Search Bar + Floating Popup Dropdown Container */}
      <div ref={searchContainerRef} className="relative pb-4">
        <Search
          placeHolder="Search messages or connections..."
          className="rounded-sm! py-3!"
        />

        {/* 🌟 Floating Search Popup 🌟 */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 w-full -mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden max-h-80 flex flex-col">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 flex justify-between items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span>My Connections</span>
              {isSearchFetching && (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primaryColor" />
              )}
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
              {isSearchFetching && connectionsList.length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primaryColor" />
                  Searching connections...
                </div>
              ) : connectionsList.length > 0 ? (
                connectionsList.map((conn: any) => {
                  const targetUser = conn?.user || conn?.connected_user || conn;
                  return (
                    <div
                      key={conn.id || targetUser.id}
                      onClick={() => handleStartConversation(targetUser.id)}
                      className="p-2.5 flex items-center justify-between gap-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-sm overflow-hidden shrink-0">
                          <Image
                            src={targetUser?.profile_image_url || emptyImage}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                            alt={targetUser?.name || "User"}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {targetUser?.name}
                            </p>
                            {targetUser?.has_premium && (
                              <VerifyBadgeIcon className="w-3.5 h-3.5 text-primaryColor shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-400 truncate">
                            {targetUser?.title ||
                              targetUser?.headline ||
                              "Connection"}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isStartingConv}
                        className="text-primaryColor cursor-pointer hover:bg-primaryColor/10 p-1.5 rounded-full transition-colors shrink-0"
                        title="Send Message"
                      >
                        <MessageIcon className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-gray-400">
                  No connections found for &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto mb-3 text-base font-medium text-blackColor">
        {messageType.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setTab(item.name);
              router.push(`/mu/message?tab=${item.name}`);
            }}
            className={`py-1 rounded-sm px-4 border capitalize text-sm border-liteDescriptionColor/80 text-liteDescriptionColor cursor-pointer ${
              activeTab === item?.name
                ? "bg-primaryColor text-whiteColor border-0 font-medium"
                : ""
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Main Conversation List */}
      <div className="md:h-135 h-120 border-t overflow-y-auto">
        {data?.data?.length > 0 ? (
          data?.data?.map((msg: any) => {
            return (
              <ContextMenu key={msg.id}>
                <ContextMenuTrigger asChild>
                  <div
                    onClick={() => handleReadMessage(msg.id)}
                    className={`p-2 flex items-center cursor-pointer gap-3 text-left hover:bg-gray-50 transition-colors ${
                      Number(params?.id) === msg.id ? "bg-gray-100" : ""
                    }`}
                  >
                    <div className="w-10 h-10 overflow-hidden rounded-sm shrink-0">
                      <Image
                        src={msg?.user?.profile_image_url || emptyImage}
                        width={40}
                        height={40}
                        className="rounded-sm w-full h-full object-center object-cover"
                        alt=""
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <div className="flex gap-1.5 items-center min-w-0">
                          <p className="font-medium text-sm truncate">
                            {msg?.user?.name}{" "}
                          </p>
                          {msg?.user?.has_premium && (
                            <VerifyBadgeIcon className="w-3.5 h-3.5 text-primaryColor shrink-0" />
                          )}
                        </div>
                        <span className="text-xs text-gray-400 shrink-0">
                          {dayjs(msg?.last_message?.created_at).fromNow()}
                        </span>
                      </div>
                      <p className="text-xs flex justify-between text-gray-500 truncate">
                        <span className="truncate">
                          {msg.last_message?.message
                            ? truncateText(msg.last_message?.message, 30)
                            : msg.last_message?.type === "audio" ||
                                msg.last_message?.type === "voice"
                              ? "Sent a voice message"
                              : msg.last_message?.type === "file" ||
                                  msg.last_message?.type === "image" ||
                                  msg.last_message?.type === "pdf"
                                ? "Sent a file"
                                : msg.last_message?.type === "video" ||
                                    msg.last_message?.type === "vedio"
                                  ? "Sent a video"
                                  : "No message available"}
                        </span>
                        {msg?.unread_count > 0 ? (
                          <span className="bg-redColor inline text-white text-xs px-2 rounded-full shrink-0">
                            {msg?.unread_count}
                          </span>
                        ) : (
                          <IoMdDoneAll className="text-primaryColor shrink-0" />
                        )}
                      </p>
                    </div>
                  </div>
                </ContextMenuTrigger>

                <ContextMenuContent className="w-48">
                  <ContextMenuItem className="cursor-pointer flex items-center gap-2">
                    <button
                      onClick={() => handleToggleArchive(msg)}
                      className="flex items-center gap-2 w-full"
                    >
                      {msg?.is_archived ? (
                        <>
                          <ArchiveRestore className="w-4 h-4 text-gray-600" />
                          <span>Unarchive Chat</span>
                        </>
                      ) : (
                        <>
                          <Archive className="w-4 h-4 text-gray-600" />
                          <span>Archive Chat</span>
                        </>
                      )}
                    </button>
                  </ContextMenuItem>
                  <ContextMenuItem className="cursor-pointer flex items-center gap-2">
                    <button
                      onClick={() => handleToggleRead(msg)}
                      className="flex items-center gap-2 w-full"
                    >
                      {msg?.unread_count > 0 ? (
                        <>
                          <Check className="w-4 h-4 text-gray-600" />
                          <span>Mark as Read</span>
                        </>
                      ) : (
                        <>
                          <IoMdDoneAll className="w-4 h-4 text-gray-600" />
                          <span>Mark as Unread</span>
                        </>
                      )}
                    </button>
                  </ContextMenuItem>
                  <ContextMenuItem className="cursor-pointer flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteConversation(msg)}
                      className="flex items-center gap-2 w-full text-red-500"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                      <span>Delete Chat</span>
                    </button>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })
        ) : (
          <div className="p-4 text-center text-gray-500">
            No messages found.
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageUserSection;
