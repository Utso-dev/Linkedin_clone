"use client";

import { useGetConversationListQuery } from "@/feature/slice/message/messageSlice";
import { BsEmojiFrown } from "react-icons/bs";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

function Page() {
  const { data, isLoading } = useGetConversationListQuery("all");

  if (isLoading) {
    return (
      <div className="flex h-135 w-full items-center justify-center p-4">
        <span className="text-sm text-grayColor1 animate-pulse">
          Loading conversations...
        </span>
      </div>
    );
  }

  const hasConversations = Boolean(data?.data && data.data.length > 0);

  return (
    <div>
      <div className="flex flex-col justify-center p-4 w-full md:p-6 items-center">
        {hasConversations ? (
          /* Conversation */
          <div className="h-135 flex flex-col px-4 w-full items-center justify-center gap-3">
            <div className="p-3 bg-gray-100 rounded-full text-primaryColor">
              <HiOutlineChatBubbleLeftRight size={32} />
            </div>
            <p className="text-center text-headerColor text-lg font-semibold">
              Select a conversation
            </p>
            <p className="text-center text-sm text-grayColor1 max-w-md">
              Choose a contact from the sidebar to view your chat history or
              send a new message.
            </p>
          </div>
        ) : (
          /* Conversation */
          <div className="h-135 flex flex-col px-4 w-full items-center justify-center gap-2">
            <BsEmojiFrown size={24} className="text-gray-400" />
            <p className="text-center text-headerColor font-semibold">
              You don’t have any messages at the moment.
            </p>
            <p className="text-center text-sm text-grayColor1 max-w-md">
              No messages found at the moment. Start a conversation to engage
              with others, ask questions, or share your thoughts. Don’t wait—get
              the conversation going now and stay connected!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
