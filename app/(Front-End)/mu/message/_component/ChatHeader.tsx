"use client";

import emptyImage from "@/public/empty_user.jpg";
import Image from "next/image";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaBars } from "react-icons/fa6";

function ChatHeader({
  otherUser,
  onToggleSidebar,
}: {
  otherUser?: any;
  onToggleSidebar: () => void;
}) {
  return (
    <div className="flex p-3! md:p-4!  w-full items-center justify-between">
      <div className=" flex items-center gap-2! md:gap-3!">
        <button
          className="md:hidden  rounded-sm"
          onClick={onToggleSidebar}
        >
          <FaBars />
        </button>
        <Image
          src={otherUser?.profile_image_url || emptyImage}
          width={40}
          height={40}
          className="rounded-sm"
          alt=""
        />
        <div className="space-y-1">
          <p className="font-semibold text-lg text-headerColor">
            {otherUser?.name}
          </p>
          <p className="text-xs text-descriptionColor!">
            {otherUser?.title || "No title"}
          </p>
        </div>
      </div>
      <button className="cursor-pointer text-secondaryColor!">
        <BsThreeDotsVertical className="text-blackColor" />
      </button>
    </div>
  );
}

export default ChatHeader;