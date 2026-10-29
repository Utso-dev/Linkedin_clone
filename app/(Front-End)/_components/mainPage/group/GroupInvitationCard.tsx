import emptyImage from "@/public/empty_user.jpg";
import { GroupUserIcon } from "@/public/svgIcons/Icons";
import { ImageIcon } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import GroupInviteAction from "./GroupInviteAction";

function GroupInvitationCard({ item }: { item: any }) {
  return (
    <div>
      <article className="flex flex-col md:flex-row lg:gap-6 xl:gap-8 items-start justify-between gap-3 border-b border-borderColor py-3">
        <div className="flex h-full items-start flex-1 gap-3 ">
          <div className="flex md:h-16 md:w-16  w-12 h-12 items-center justify-center overflow-hidden rounded-full bg-bgColor">
            {item.id === 1 ? (
              <ImageIcon className="h-4 w-4 text-descriptionColor" />
            ) : (
              <Image
                src={item?.group?.logo_url || emptyImage}
                alt={item?.group?.name}
                width={150}
                height={150}
                unoptimized
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="flex-1">
            <div>
              <Link
                href={`/mu/profile/${item?.inviter?.id}`}
                className=" text-base  text-headerColor font-semibold"
              >
                {item?.inviter?.name}
              </Link>{" "}
              <span>Invited you to the</span>{" "}
              <Link
                href={
                  item?.group?.type == "public"
                    ? `/mu/my-network/group/${item?.group?.id}`
                    : `#`
                }
                className=" text-base  text-headerColor font-semibold"
              >
                {item?.group?.name}
              </Link>
            </div>
            <p className=" text-[14px] line-clamp-1 text-descriptionColor">
              {item?.group?.description || "No description added"}
            </p>
            <div className="flex items-center gap-2 text-grayColor1">
              <GroupUserIcon className=" w-4 h-4 text-grayColor1" />{" "}
              <p>{item?.group?.member_count || 0} members</p>
            </div>
            {/* <div
              className={`flex ${item?.mutual_connections?.length > 0 ? "justify-between" : "justify-end"}  gap-3 items-center`}
            >
              {item?.mutual_connections?.length > 0 ? (
                <div className="mt-1 flex  items-center gap-1 text-[12px] text-grayColor1">
                  <Image
                    src={
                      item?.mutual_connections[0]?.profile_image_url ||
                      emptyImage
                    }
                    alt="mutual"
                    width={24}
                    height={24}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  <span className="">
                    <Link
                      href={`/mu/profile/${item?.mutual_connections[0]?.id}`}
                      className="text-headerColor"
                    >
                      {item?.mutual_connections[0]?.name}
                    </Link>{" "}
                    {item?.mutual_connections_count > 1 &&
                      "and " + item?.mutual_connections_count + " others "}{" "}
                    mutual connections
                  </span>
                </div>
              ) : null}
              <div className="">
                {item?.status == "accepted" && (
                  <span className="text-[12px] leading-3 text-grayColor1 font-semibold">
                    {item?.connected_since}
                  </span>
                )}
              </div>
            </div> */}
          </div>
        </div>

        <div className="flex w-full md:w-fit justify-end items-center">
          <GroupInviteAction
            invitationId={item?.invitation_id}
            groupId={item?.group?.id}
            userId={item?.inviter?.id}
          />
        </div>
      </article>
    </div>
  );
}

export default GroupInvitationCard;
