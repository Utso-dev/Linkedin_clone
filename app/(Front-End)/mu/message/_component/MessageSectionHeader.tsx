import emptyImage from "@/public/empty_user.jpg";
import { VerifyBadgeIcon } from "@/public/svgIcons/Icons";
import Image from "next/image";
import Link from "next/link";
import { BsThreeDotsVertical } from "react-icons/bs";

function MessageSectionHeader({ conversationList, isOtherUserTyping }: any) {


  return (
    <div>
      <div className="flex p-3! md:p-4! w-full items-center justify-between">
        <div className="flex items-center gap-2! md:gap-3!">
          <div className="w-10 h-10 overflow-hidden rounded-sm">
            <Image
              src={
                conversationList?.other_user?.profile_image_url || emptyImage
              }
              width={40}
              height={40}
              className="rounded-sm w-full h-full object-center object-cover"
              alt=""
            />
          </div>

          <div className="space-y-0.5">
            <Link href={`/mu/profile/${conversationList?.other_user?.id}`} className="flex items-center gap-2">
              <p className="font-semibold text-lg text-headerColor">
                {conversationList?.other_user?.name}
              </p>
              {conversationList?.other_user?.has_premium && (
                <VerifyBadgeIcon className="w-4.5 h-4.5 mt-0.5 text-primaryColor" />
              )}
            </Link>
            <p className="text-xs">
              {isOtherUserTyping ? (
                <span className="text-primaryColor font-medium animate-pulse">
                  typing...
                </span>
              ) : (
                <span className="text-descriptionColor!">
                  {conversationList?.other_user?.title || "No title"}
                </span>
              )}
            </p>
          </div>
        </div>
        {/* <button className="cursor-pointer text-secondaryColor!">
          <BsThreeDotsVertical className="text-blackColor" />
        </button> */}
      </div>
    </div>
  );
}

export default MessageSectionHeader;
